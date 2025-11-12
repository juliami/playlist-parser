export async function fetchAlbumCovers({ signal, albumEntries }) {
  if (!Array.isArray(albumEntries) || albumEntries.length === 0) return [];

  const results = await Promise.all(
    albumEntries.map(async ({ artistName, albumName }) => {
      const key = `${artistName || ''}:::${albumName}`;
      const url = `https://itunes.apple.com/search?term=${encodeURIComponent(
        `${artistName} ${albumName}`
      )}&entity=album&limit=5`;

      const res = await fetch(url, { signal });
      if (!res.ok) throw new Error(`Request failed for ${artistName} - ${albumName}`);

      const data = await res.json();
      const album = data.results?.[0];
      const artworks = data.results.map((result) => result?.artworkUrl100?.replace('100x100bb', '600x600bb'));

      if (!album) return null;

      return {
        key,
        artistName,
        albumName,
        artworks,
        viewUrl: album.collectionViewUrl,
      };
    })
  );

  // filter out nulls
  return results.filter(Boolean);
}
