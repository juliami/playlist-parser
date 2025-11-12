import { useQuery } from '@tanstack/react-query';
import { fetchAlbumCovers } from '../api/fetch';

export function useAlbumCovers(albumEntries) {
  return useQuery({
    queryKey: ['albumCovers', albumEntries],
    queryFn: ({ signal }) => fetchAlbumCovers({ signal, albumEntries }),
    enabled: Array.isArray(albumEntries) && albumEntries.length > 0,
    suspense: true,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 30, 
    retry: 2,
  });
}
