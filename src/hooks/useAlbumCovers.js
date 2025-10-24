import { useQuery } from '@tanstack/react-query';
import { fetchAlbumCovers } from '../api/fetch';

export function useAlbumCovers(albumEntries) {
  return useQuery({
    queryKey: ['albumCovers', albumEntries],
    queryFn: () => fetchAlbumCovers(albumEntries),
    enabled: Array.isArray(albumEntries) && albumEntries.length > 0,
    suspense: true,
  });
}
