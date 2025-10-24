import React from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createUseStyles } from 'react-jss'
import { AlbumProvider } from './context/AlbumContext'
import PlaylistConverter from './components/PlaylistConverter';
import PlaylistInput from './components/PlaylistInput';
import CoverGrid from './components/CoverGrid';

const useStyles = createUseStyles({
  container: {
    width: '100%',
    minWidth: '1200px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr'

  },
})


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      retry: false,
    },
  },
});


function App() {
  const classes = useStyles();
  return (
    <QueryClientProvider client={queryClient}>
      <AlbumProvider>
        <div className={classes.container}>
          <PlaylistInput />
          <CoverGrid />
          <div>Display image</div>

          {/* <PlaylistConverter /> */}
        </div>
      </AlbumProvider>
    </QueryClientProvider>

  );
}

export default App;
