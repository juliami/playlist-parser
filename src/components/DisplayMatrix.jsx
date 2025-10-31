import { createUseStyles } from "react-jss";
import { useAlbumContext } from '../context/AlbumContext';
import DownloadButton from "./DownloadButton";

const useStyles = createUseStyles({
  container: {
    padding: '1rem'
  },
  coversGrid: {
    display: "grid",
    marginBottom: '1rem',
    gridTemplateColumns: "50% 50%",
    backgroundColor: 'hsla(65, 60%, 97%, 1)',
    backgroundImage: 'radial-gradient(circle at 92% 93%, hsla(190, 56%, 91%, 0.53) 11%, transparent 79%), radial-gradient(circle at 24% 86%, hsla(13, 52%, 90%, 1) 16%, transparent 83%), radial-gradient(circle at 11% 94%, hsla(43, 55%, 90%, 1) 16%, transparent 51%), radial-gradient(circle at 36% 38%, hsla(81, 82%, 98%, 1) 3%, transparent 59%), radial-gradient(circle at 44% 9%, hsla(252.79411764705875, 81%, 51%, 0.48) 13%, transparent 83%)',
    '& > *' : {
      width: '100%',
      aspectRatio: '1 / 1',
    },
    '& > div' : {
      outline: '1px solid #fff'
    }  
  },
});


const SelectedImage = (src) => {
  console.log(src)
  if (!src.src) { 
    return (
      <div />
    )
  }
  else {
     return(<img
            src={src.src}
            alt=""
          />)
  }
}

const DisplayMatrix = () => {
  const { selectedAlbums } = useAlbumContext();

  const classes = useStyles();

  

  return (
    <div className={classes.container}>
    <div className={classes.coversGrid}>
          <SelectedImage src={selectedAlbums[0]?.src} />
          <SelectedImage src={selectedAlbums[1]?.src} />
          <SelectedImage src={selectedAlbums[2]?.src} />
          <SelectedImage src={selectedAlbums[3]?.src} />

    </div>
    <DownloadButton selected={selectedAlbums}/>

</div>
  );
};

export default DisplayMatrix;