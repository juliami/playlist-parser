export async function fetchAlbumCovers(albumEntries) {
  if (!Array.isArray(albumEntries) || albumEntries.length === 0) return [];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const results = await Promise.allSettled(
      albumEntries.map(async ({ artistName, albumName }) => {
        const key = `${artistName || ''}:::${albumName}`;
        const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
          artistName + ' ' + albumName
        )}&entity=album&limit=1`;

        const res = await fetch(url, { signal: controller.signal });
        const data = await res.json();
        const album = data.results?.[0];
        if (!album) return null;

        return {
          key,
          artistName,
          albumName,
          artworkUrl600: album.artworkUrl100?.replace('100x100bb', '600x600bb'),
          viewUrl: album.collectionViewUrl,
        };
      })
    );

    return results
      .filter((r) => r.status === 'fulfilled' && r.value)
      .map((r) => r.value);
  } finally {
    clearTimeout(timeoutId);
  }
}
