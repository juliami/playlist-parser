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
    display: 'flex',
    gap: '1rem',
    height: '100vh',
    padding: '2rem',
    boxSizing: 'border-box',
    backgroundColor: 'hsla(65, 60%, 97%, 1)',
    backgroundImage: 'radial-gradient(circle at 92% 93%, hsla(190, 56%, 91%, 0.53) 11%, transparent 79%), radial-gradient(circle at 24% 86%, hsla(13, 52%, 90%, 1) 16%, transparent 83%), radial-gradient(circle at 11% 94%, hsla(43, 55%, 90%, 1) 16%, transparent 51%), radial-gradient(circle at 36% 38%, hsla(81, 82%, 98%, 1) 3%, transparent 59%), radial-gradient(circle at 44% 9%, hsla(252.79411764705875, 81%, 51%, 0.48) 13%, transparent 83%)',
 
  },
    section: {
    flex: '1',
    width: '33.33%',
    borderRadius: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    display: 'flex',
    flexDirection: 'column'


    
  }
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
        <main className={classes.container}>
          <section className={classes.section}>
            <PlaylistInput />
          </section>
          <section className={classes.section}>
          <CoverGrid />
          </section>
          <section className={classes.section}>
          <div>Display image</div>
          </section>
          {/* <PlaylistConverter /> */}
        </main>
      </AlbumProvider>
    </QueryClientProvider>

  );
}

export default App;
