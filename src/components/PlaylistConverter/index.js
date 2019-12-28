import React, { useState } from 'react';
import { cleanupPlaylist } from './cleanupPlaylist';

const PlaylistConverter = (props) => {
    const [value, setValue] = useState('');

    const handleChange = event => {
        event.preventDefault();
        setValue(cleanupPlaylist(value))
    };

    return (
        <>
            <textarea onChange={e => setValue(e.target.value)} width="1800" height = "1800" value={value}/>
            <button onClick={e => handleChange(e)}>Go!</button>
        </>
);
}

export default PlaylistConverter;
