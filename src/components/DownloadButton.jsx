
import Button from './Button';

const DownloadButton = ({ selected }) => {

    if (selected.length < 4) {
        return null;
    }

    return (
        <Button text="Download 2x2 collage (900x900)" onClick={async () => {
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
        }} />
  )
}

export default DownloadButton;