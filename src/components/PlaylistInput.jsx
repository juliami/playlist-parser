
import { useState} from 'react';
import { createUseStyles } from "react-jss";
import { extractAlbumNames } from './PlaylistConverter/albums';
import { useAlbumContext } from '../context/AlbumContext';
import Button from './Button';

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
    })

const PlaylistInput = () => {
        const [value, setValue] = useState('');
        const { addSearchedAlbums } = useAlbumContext();
   
        const handleChange = async event => {
            event.preventDefault();
            const searchedAlbums = extractAlbumNames(value);   
            addSearchedAlbums(searchedAlbums);
    
        };
    const classes = useStyles();

    return (
        <>
            <textarea className={classes.textarea} onChange={e => {setValue(e.target.value)}} placeholder="Paste playlist here"/>
            <Button text="Go!" onClick={handleChange} />   
        </>
    )
}

export default PlaylistInput;