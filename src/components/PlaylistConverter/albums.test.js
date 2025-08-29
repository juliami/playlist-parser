import { extractAlbumNames } from './albums';

test('extracts album from 3-column tab format', () => {
  const input = 'Artist\tTrack\tAlbum Name';
  const result = extractAlbumNames(input);
  expect(result).toEqual([{ artistName: 'Artist', albumName: 'Album Name' }]);
});

test('extracts album from 5-column tab format (year, duration, album)', () => {
  const input = 'Artist\tTrack\t1986\t4:01\tAlbum Name';
  const result = extractAlbumNames(input);
  expect(result).toEqual([{ artistName: 'Artist', albumName: 'Album Name' }]);
});

test('falls back to bracket format', () => {
  const input = 'Artist - [Album Name #03] Track Title';
  const result = extractAlbumNames(input);
  expect(result).toEqual([{ artistName: 'Artist', albumName: 'Album Name' }]);
});

test('normalizes trailing parentheses', () => {
  const input = 'Artist\tTrack\t1986\t4:01\tAlbum Name (2012 Remastered)';
  const result = extractAlbumNames(input);
  expect(result).toEqual([{ artistName: 'Artist', albumName: 'Album Name' }]);
});

