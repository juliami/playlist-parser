import React, { useState } from 'react';
import { cleanupPlaylist } from './cleanupPlaylist';
import { createUseStyles } from 'react-jss'

const useStyles = createUseStyles({
    textarea: {
        border: '1px solid #3A6073',
        borderRadius: '4px',
        boxSizing: 'border-box',
        resize: 'none',
        fontSize: '18px',
        width: '100%',
        maxWidth: '600px',
        height: '500px',
        margin: {
            top: 'auto',
            right: 0,
            bottom: 0,
            left: 'auto'
        },
        padding: '30px',
        '&:focus': {
            border: '1px solid #84a2b1',
            outline: 'none'
        }
    },
    button: {
        backgroundImage: 'linear-gradient(to right, #16222A 0%, #3A6073 51%, #16222A 100%)',
        borderRadius: '4px',
        display: 'block',
        width: '100%',
        color: '#fff',
        cursor: 'pointer',
        fontSize: '20px',
        height: '50px',
        '&:hover': {
            backgroundImage: 'linear-gradient(to right, #16222A 0%, #498daf 51%, #16222A 100%)',

        }
    },
})

const PlaylistConverter = (props) => {
    const [value, setValue] = useState('');

    const handleChange = event => {
        event.preventDefault();
        setValue(cleanupPlaylist(value))
    };

    const classes = useStyles();

    return (
        <>
            <textarea onChange={e => setValue(e.target.value)} className={classes.textarea} value={value}/>
            <button onClick={e => handleChange(e)} className={classes.button}>Go!</button>
        </>
);
}

export default PlaylistConverter;
