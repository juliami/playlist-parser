import React from 'react';
import { createUseStyles } from 'react-jss'

import PlaylistConverter from './components/PlaylistConverter';

const useStyles = createUseStyles({
  container: {
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto'
  },
})

function App() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
     <PlaylistConverter />
    </div>
  );
}

export default App;
