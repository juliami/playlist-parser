
import { useState, useRef} from 'react';
import { createUseStyles } from "react-jss";
import { extractAlbumNames } from './PlaylistConverter/albums';
import { useAlbumContext } from '../context/AlbumContext';
import Button from './Button';
import { useEffect } from 'react';

 const useStyles = createUseStyles({
        textarea: {
            borderStyle: 'none',
            backgroundColor: 'transparent',
            boxSizing: 'border-box',
            resize: 'none',
            width: '100%',
            height: '100%',
            outline: 'none',
            fontSize: 'clamp(0.8rem, 1.5vh, 2rem)',
            margin: {
                top: 'auto',
                right: 0,
                bottom: 0,
                left: 'auto'
            },
            padding: '30px',
         
        },
    })

const PlaylistInput = () => {
        const [value, setValue] = useState('');
        const { addSearchedAlbums } = useAlbumContext();
     const valueRef = useRef();

    useEffect(()=> {
   const searchedAlbums = extractAlbumNames(value);   
        addSearchedAlbums(searchedAlbums);
    }, [value])    

    const classes = useStyles();

    return (
        <>
        <textarea ref={valueRef} className={classes.textarea} onChange={e => {setValue(e.target.value)}} placeholder="Paste playlist here" id="playlist-input"/>
        </>
    )
}

export default PlaylistInput;