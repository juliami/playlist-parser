import React, { useState } from 'react';
import { extractAlbumNames, fetchAlbumCovers } from './albums';
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
    coverImage: {
        width: '100%',
        maxWidth: '120px',
        borderRadius: '6px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
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
    const [isEditing, setIsEditing] = useState(true);
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
                setIsEditing(false);
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
            {isEditing && (
                <>
                    <textarea onChange={e => { setRawValue(e.target.value); setValue(e.target.value); }} className={classes.textarea} value={value}/>
                    <button onClick={e => handleChange(e)} className={classes.button}>Go!</button>
                </>
            )}
            {!isEditing && (
                <div className={classes.collageActions}>
                    <button className={classes.button} onClick={() => { setIsEditing(true); setAlbumEntries([]); setCoversMap({}); setSelected([]); setError(null); setLoading(false); setValue(rawValue); }}>Edit playlist</button>
                </div>
            )}
            {loading && (<div className={classes.coversGrid}>Loading covers...</div>)}
            {error && (<div className={classes.coversGrid}>{error}</div>)}
            {!loading && !error && !isEditing && albumEntries && albumEntries.length > 0 && (
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
                    <div className={classes.collageActions}>
                        <button disabled={selected.length !== 4} className={classes.button} onClick={async () => {
                            const size = 900;
                            const tile = size / 2;
                            const canvas = document.createElement('canvas');
                            canvas.width = size;
                            canvas.height = size;
                            const ctx = canvas.getContext('2d');

                            const loadImage = (src) => new Promise((resolve, reject) => {
                                const img = new Image();
                                img.crossOrigin = 'anonymous';
                                img.onload = () => resolve(img);
                                img.onerror = reject;
                                img.src = src;
                            });

                            try {
                                const imgs = await Promise.all(selected.slice(0, 4).map(s => loadImage(s.src)));
                                // Draw 2x2
                                ctx.drawImage(imgs[0], 0, 0, tile, tile);
                                ctx.drawImage(imgs[1], tile, 0, tile, tile);
                                ctx.drawImage(imgs[2], 0, tile, tile, tile);
                                ctx.drawImage(imgs[3], tile, tile, tile, tile);

                                const link = document.createElement('a');
                                const today = new Date();
                                const yyyy = today.getFullYear();
                                const mm = String(today.getMonth() + 1).padStart(2, '0');
                                const dd = String(today.getDate()).padStart(2, '0');
                                const dateStr = `${yyyy}-${mm}-${dd}`;
                                link.download = `${dateStr}-matrix900.png`;
                                link.href = canvas.toDataURL('image/png');
                                link.click();
                            } catch (e) {
                                alert('Failed to generate collage. Some images may not allow cross-origin use.');
                            }
                        }}>Download 2x2 collage (900x900)</button>
                        {selected.length !== 4 && (
                            <div className={classes.coverCaption}>Select exactly 4 covers to enable download.</div>
                        )}
                    </div>
                </>
            )}
        </>
);
}

export default PlaylistConverter;
