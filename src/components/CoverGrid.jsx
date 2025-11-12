import { Suspense } from "react";
import { useAlbumContext } from '../context/AlbumContext';
import { useAlbumCovers } from '../hooks/useAlbumCovers';
import Cover from './Cover';
import Grid from '@mui/material/Grid';


const Loading = () => <div>Loading…</div>;

export default function CoverGrid() {
  const { searchedAlbums } = useAlbumContext();

  return (
    <Suspense fallback={<Loading />}>
      <InnerGrid albumEntries={searchedAlbums} />
    </Suspense>
  );
}

const InnerGrid = ({ albumEntries }) => {
  const { data: covers } = useAlbumCovers(albumEntries);


  return (
    <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3 }} sx={{p: 4, overflowY: 'scroll', maxHeight: '100vh'}}>
      {covers.map((album) => (
        <Grid  key={album.key} size={{ xs: 1, sm: 1, md: 1 }}>
          <Cover album={album}/>
        </Grid>
      ))}
    </Grid>
  );
};