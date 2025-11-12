import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import { createUseStyles } from "react-jss";
import { useAlbumContext } from '../context/AlbumContext';
import { fetchAlbumCovers } from '../api/fetch';
import { useAlbumCovers } from '../hooks/useAlbumCovers';


const styles = {
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
};
const useStyles = createUseStyles(styles);

const Cover = ({album}) => {
  const classes = useStyles();
  const { toggleSelectedAlbums, selectedAlbums } = useAlbumContext();
  
const {status, data, error, refetch} = useAlbumCovers([album])


  const fetchDifferentCover = (e) => {
    e.stopPropagation();
    console.log('fetch different');
    
  }

  return (
    <div key={album.key} className={`${classes.coverItem} ${selectedAlbums.find(s => s.src === album.artworkUrl600) ? classes.selectedImage : ''}`} onClick={() => toggleSelectedAlbums({ src: album.artworkUrl600 })}>
      <img
        src={album.artworkUrl600}
        alt={album.albumName}
        className={classes.coverImage}
      />
      <div className={classes.albumTitle}>
        {album.artistName} — {album.albumName}
      </div>
      <IconButton aria-label="Refresh" onClick={fetchDifferentCover}>
        <RefreshIcon />
      </IconButton>
    </div>
  )
}

export default Cover;