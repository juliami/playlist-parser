import { Suspense } from "react";
import { createUseStyles } from "react-jss";
import { useAlbumContext } from '../context/AlbumContext';
import { useAlbumCovers } from '../hooks/useAlbumCovers';

const useStyles = createUseStyles({
  coversGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gridGap: "0.5rem",
    height: "100vh",
    overflowY: "scroll",
    padding: '1rem'
  },
  coverItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    background: "#f8fafb",
    border: "1px solid #e6ecef",
    borderRadius: "6px",
  },
  albumTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#16222A"
  },
    coverImage: {
      width: '100%',
      borderRadius: '6px',
      boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
      marginBottom: '0.2rem',
      cursor: 'pointer',
      '&:hover': {
        opacity: 0.9
      }
    },


       selectedImage: {
        outline: '3px solid #b17ad5',
            boxShadow: '0 7px 12px rgba(0,0,0,0.35)',

    },
});

const Loading = () => <div>Loading…</div>;

export default function CoverGrid() {
  const { searchedAlbums } = useAlbumContext();

  return (
    <Suspense fallback={<Loading />}>
      <Grid albumEntries={searchedAlbums} />
    </Suspense>
  );
}

const Grid = ({ albumEntries }) => {
  const { data: covers } = useAlbumCovers(albumEntries);
  const { toggleSelectedAlbums, selectedAlbums } = useAlbumContext();

  const classes = useStyles();

  

  return (
    <div className={classes.coversGrid}>
      {covers.map((album) => (
        <div key={album.key} className={`${classes.coverItem} ${selectedAlbums.find(s => s.src === album.artworkUrl600) ? classes.selectedImage : ''}`} onClick={() => toggleSelectedAlbums({src: album.artworkUrl600})}>
          <img
            src={album.artworkUrl600}
            alt={album.albumName} 
            className={classes.coverImage}
          />
          <div className={classes.albumTitle}>
            {album.artistName} — {album.albumName}
          </div>
        </div>
      ))}
    </div>
  );
};