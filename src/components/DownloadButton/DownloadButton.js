import React from "react";
import { createUseStyles } from 'react-jss'


const useStyles = createUseStyles({
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
    collageActions: {
        marginTop: '16px',
        display: 'flex',
        gap: '8px',
        alignItems: 'center'
    }
})


const DownloadButton = ({ selected }) => {
    const classes = useStyles();

    return (<div className={classes.collageActions}>
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
            <div>Select exactly 4 covers to enable download.</div>
        )}
    </div>)
}

export default DownloadButton;