import React, { useState } from 'react';
import { extractAlbumNames, fetchAlbumCovers } from './albums';
import { createUseStyles } from 'react-jss'
import DownloadButton from '../DownloadButton';
import Loading from '../Loading';
const useStyles = createUseStyles({
    smallButton: {
        background: 'transparent',
        border: 'none',
        color: '#3A6073',
        cursor: 'pointer',
        fontSize: '16px',
        padding: '4px 6px',
        '&:hover': {
            color: '#498daf'
        }
    },
    coversGrid: {
        marginTop: '20px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
        gridGap: '16px'
    },
    coverItem: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: '#f8fafb',
        border: '1px solid #e6ecef',
        borderRadius: '6px',
        padding: '10px'
    },

    coverCaption: {
        marginTop: '6px',
        fontSize: '12px'
    },
    albumHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: '8px'
    },
    albumTitle: {
        fontSize: '14px',
        fontWeight: 600,
        color: '#16222A'
    },
    selectedImage: {
        outline: '3px solid #3A6073'
    },
    collageActions: {
        marginTop: '16px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    }
})

const PlaylistConverter = (props) => {
    const [value, setValue] = useState('');
    const [rawValue, setRawValue] = useState('');
    const [albumEntries, setAlbumEntries] = useState([]); // { artistName, albumName }
    const [coversMap, setCoversMap] = useState({}); // key: `${artist}:::${album}` -> [candidates]
    const [coverIndex, setCoverIndex] = useState({}); // key -> current index (kept for potential future use)
    const [selected, setSelected] = useState([]); // [{ src, caption }]
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = async event => {
        event.preventDefault();
        setError(null);
        const extracted = extractAlbumNames(rawValue);
        setAlbumEntries(extracted);
        if (extracted.length > 0) {
            try {
                setLoading(true);
                const fetched = await fetchAlbumCovers(extracted);
                setCoversMap(fetched);
                setCoverIndex({});
            } catch (e) {
                setError('Failed to fetch album covers.');
            } finally {
                setLoading(false);
            }
        } else {
            setCoversMap({});
        }
        setValue(rawValue)
    };

    const keyFor = (artistName, albumName) => `${artistName || ''}:::${albumName}`;

    const refreshCover = async (artistName, albumName) => {
        const key = keyFor(artistName, albumName);
        // Always refetch to try new results and advance the shown index
        try {
            setLoading(true);
            const fetched = await fetchAlbumCovers([{ artistName, albumName }]);
            const newMap = { ...coversMap, ...fetched };
            setCoversMap(newMap);
            const candidates = newMap[key] || [];
            if (candidates.length > 0) {
                const currentIdx = coverIndex[key] || 0;
                const nextIdx = (currentIdx + 1) % candidates.length;
                setCoverIndex({ ...coverIndex, [key]: nextIdx });
            }
        } catch (e) {
            // On failure, try cycling locally through existing candidates
            const candidates = coversMap[key] || [];
            if (candidates.length > 1) {
                const currentIdx = coverIndex[key] || 0;
                const nextIdx = (currentIdx + 1) % candidates.length;
                setCoverIndex({ ...coverIndex, [key]: nextIdx });
            } else {
                setError('Failed to refresh cover.');
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleSelect = (src, caption) => {
        const exists = selected.find((s) => s.src === src);
        if (exists) {
            setSelected(selected.filter((s) => s.src !== src));
        } else if (selected.length < 4) {
            setSelected([...selected, { src, caption }]);
        }
    };

    const classes = useStyles();

    return (
        <>
            {/* {isEditing && (
                <>
                    <textarea onChange={e => { setRawValue(e.target.value); setValue(e.target.value); }} className={classes.textarea} value={value}/>
                    <button onClick={e => handleChange(e)} className={classes.button}>Go!</button>
                </>
            )} */}
{/*           
                <div className={classes.collageActions}>
                    <button className={classes.button} onClick={() => {  setAlbumEntries([]); setCoversMap({}); setSelected([]); setError(null); setLoading(false); setValue(rawValue); }}>Edit playlist</button>
                </div> */}
         
            {loading && (<Loading />)}
            {error && (<div className={classes.coversGrid}>{error}</div>)}
            {!loading && !error && albumEntries && albumEntries.length > 0 && (
                <>
                    <div className={classes.coverCaption}>Album covers</div>
                    <div className={classes.coversGrid}>
                        {albumEntries.map(({ artistName, albumName }) => {
                            const key = keyFor(artistName, albumName);
                            const candidates = coversMap[key] || [];
                            const idx = coverIndex[key] || 0;
                            const current = candidates[idx];
                            const caption = `${artistName ? artistName + ' — ' : ''}${albumName}`;
                            return (
                                <div key={key} className={classes.coverItem}>
                                    <div className={classes.albumHeader}>
                                        <div className={classes.albumTitle}>{caption}</div>
                                        <button className={classes.smallButton} aria-label="Refresh covers" title="Refresh covers" onClick={() => refreshCover(artistName, albumName)}>⟳</button>
                                    </div>
                                    {current && current.artworkUrl600 && (
                                        <a href={current.viewUrl} target="_blank" rel="noopener noreferrer">
                                            <img alt={caption} src={current.artworkUrl600} className={`${classes.coverImage} ${selected.find(s => s.src === current.artworkUrl600) ? classes.selectedImage : ''}`} onClick={(e) => { e.preventDefault(); toggleSelect(current.artworkUrl600, caption); }} />
                                        </a>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    {albumEntries.filter(({ artistName, albumName }) => {
                        const key = keyFor(artistName, albumName);
                        const candidates = coversMap[key] || [];
                        const idx = coverIndex[key] || 0;
                        const current = candidates[idx];
                        return current && current.artworkUrl600;
                    }).length === 0 && (
                        <div className={classes.coverCaption}>No album covers found.</div>
                    )}
                    {selected && selected.length > 0 && (
                        <div className={classes.coverCaption}>{`Selected: ${selected.length} / 4 (click an image to toggle)`}</div>
                    )}
                    <DownloadButton selected={selected} />
                
                </>
            )}
        </>
);
}

export default PlaylistConverter;
