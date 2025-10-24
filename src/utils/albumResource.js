import { fetchAlbumCovers } from "../components/PlaylistConverter/albums";

// Simple cache to avoid refetching for the same album list
const resourceCache = new Map();

export function createAlbumResource(albumEntries) {
  const key = JSON.stringify(albumEntries);
  console.log({key});
  if (resourceCache.has(key)) {
    return resourceCache.get(key);
  }

  let status = "pending";
  let result;

  const promise = fetchAlbumCovers(albumEntries)
    .then((data) => {
      status = "success";
      result = data;
    })
    .catch((error) => {
      status = "error";
      result = error;
    });

  const resource = {
    read() {
      if (status === "pending") throw promise; // Suspends
      if (status === "error") throw result;     // Throws error
      return result;
    },
  };

  resourceCache.set(key, resource);
  return resource;
}
