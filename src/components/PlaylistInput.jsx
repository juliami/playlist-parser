
import { useState} from 'react';
import { createUseStyles } from "react-jss";
import { extractAlbumNames } from './PlaylistConverter/albums';
import { useAlbumContext } from '../context/AlbumContext';

 const useStyles = createUseStyles({
        textarea: {
            borderStyle: 'none',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            resize: 'none',
            width: '100%',
            height: 'calc(100% - 5vh)',
            outline: 'none',
            margin: {
                top: 'auto',
                right: 0,
                bottom: 0,
                left: 'auto'
            },
            padding: '30px',
         
        },
        button: {
            borderRadius: '4px',
            display: 'block',
            width: '100%',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '20px',
            backgroundColor: '#b17ad5',
            borderStyle: 'none',
            height: '5vh',
           transition: 'background-color 0.8s',
            '&:hover': {
                backgroundColor: '#74369c'
            }
        },
    })

const PlaylistInput = () => {
        const [value, setValue] = useState('');
        const { addAlbums } = useAlbumContext();
   
        const handleChange = async event => {
            event.preventDefault();
            const searchedAlbums = extractAlbumNames(value);   
            addAlbums(searchedAlbums);
    
        };
    const classes = useStyles();

    return (
        <>
            <textarea className={classes.textarea} onChange={e => {setValue(e.target.value)}} placeholder="Paste playlist here"/>
            <button className={classes.button} onClick={handleChange}>Go!</button>
        </>
    )
}

export default PlaylistInput;