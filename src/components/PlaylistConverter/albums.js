// Utilities to extract artist+album from raw playlist text and fetch their covers

/**
 * Extract unique album names from raw playlist text.
 * Expected line format example:
 *   Artist - [Album Name #03] Track Title
 * We take the content inside the first [...] on each line.
 */
export const extractAlbumNames = (rawPlaylist) => {
    if (!rawPlaylist || typeof rawPlaylist !== 'string') {
        return [];
    }
    const normalizeAlbumName = (name) => {
        if (!name) return '';
        // Remove trailing parenthetical annotations e.g., (2012 Remastered)
        const stripped = name.replace(/\s*\([^)]*\)\s*$/g, '').trim();
        return stripped || name.trim();
    };

    const lines = rawPlaylist.split(/\r?\n/);
    const unique = new Map();

    lines.forEach((line) => {
        if (!line || !line.trim()) return;

        // Prefer tab-separated columns; typical formats:
        //  - Artist \t Track \t Album
        //  - Artist \t Track \t Year \t Duration \t Album
        const parts = line.split(/\t+/).map((p) => (p || '').trim());
        if (parts.length >= 3) {
            const artist = parts[0] || '';
            // Find last non-empty column that is not a 4-digit year and not mm:ss
            const isYear = (s) => /^\d{4}$/.test(s);
            const isDuration = (s) => /^\d{1,2}:\d{2}$/.test(s);
            let albumCandidate = '';
            for (let i = parts.length - 1; i >= 0; i -= 1) {
                const v = parts[i];
                if (!v) continue;
                if (isYear(v) || isDuration(v)) continue;
                // Skip repeating artist/track in case of malformed rows
                if (i === 0) break;
                albumCandidate = v;
                break;
            }
            const album = normalizeAlbumName(albumCandidate);
            if (album) {
                const key = `${artist}:::${album}`;
                if (!unique.has(key)) unique.set(key, { artistName: artist, albumName: album });
            }
            if (album) return;
        }

        // Fallback: original bracket format: Artist - [Album #xx] Track
        const match = line.match(/\[(.*?)\]/);
        const artistMatch = line.split(' - ')[0];
        if (match && match[1]) {
            const inside = match[1].split('#')[0].trim();
            const album = normalizeAlbumName(inside);
            const artist = (artistMatch || '').trim();
            if (album) {
                const key = `${artist}:::${album}`;
                if (!unique.has(key)) unique.set(key, { artistName: artist, albumName: album });
            }
        }
    });

    return Array.from(unique.values());
};

/**
 * Fetch album cover art using the iTunes Search API.
 * Returns a map of albumName -> artwork object.
 */
export const fetchAlbumCovers = async (albumEntries) => {
    if (!Array.isArray(albumEntries) || albumEntries.length === 0) {
        return {};
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
        const tryFetch = async (url) => {
            try {
                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) return [];
                const data = await response.json();
                return (data && Array.isArray(data.results) ? data.results : []);
            } catch (_) {
                return [];
            }
        };

        const requests = albumEntries.map(async ({ artistName, albumName }) => {
            const key = `${artistName || ''}:::${albumName}`;
            const termStrict = [artistName, albumName].filter(Boolean).join(' ');
            const urls = [
                `https://itunes.apple.com/search?term=${encodeURIComponent(termStrict)}&entity=album&limit=10&attribute=albumTerm`,
                `https://itunes.apple.com/search?term=${encodeURIComponent(termStrict)}&entity=album&limit=10`,
                `https://itunes.apple.com/search?term=${encodeURIComponent(albumName)}&entity=album&limit=10`
            ];

            let aggregated = [];
            // Sequential fallbacks to avoid unnecessary requests if we already have hits
            /* eslint-disable no-restricted-syntax */
            for (const u of urls) {
                const r = await tryFetch(u);
                aggregated = aggregated.concat(r);
                if (aggregated.length > 0) break;
            }
            /* eslint-enable no-restricted-syntax */

            const results = aggregated.map((r) => ({
                collectionId: r.collectionId,
                collectionName: r.collectionName,
                artistName: r.artistName,
                artworkUrl100: r.artworkUrl100,
                artworkUrl600: r.artworkUrl100 ? r.artworkUrl100.replace('100x100bb', '600x600bb') : null,
                viewUrl: r.collectionViewUrl
            }));

            return [key, results];
        });

        const settled = await Promise.allSettled(requests);
        const map = {};
        settled.forEach((s) => {
            if (s.status === 'fulfilled' && Array.isArray(s.value) && s.value.length === 2) {
                const [key, value] = s.value;
                map[key] = value;
            }
        });
        return map;
    } finally {
        clearTimeout(timeoutId);
    }
};


