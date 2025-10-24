import { Suspense, useMemo } from "react";
import { createUseStyles } from "react-jss";
import { useAlbumContext } from '../context/AlbumContext';
import { useAlbumCovers } from '../hooks/useAlbumCovers';


const useStyles = createUseStyles({
  coversGrid: {
    marginTop: "20px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
    gridGap: "16px",
  },
  coverItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    background: "#f8fafb",
    border: "1px solid #e6ecef",
    borderRadius: "6px",
    padding: "10px",
  },
  albumTitle: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#16222A",
  },
});

const Loading = () => <div>Loading…</div>;

export default function CoverGrid() {
  const { searchedAlbums } = useAlbumContext();


  return (
    <Suspense fallback={<Loading />}>
      <Grid albumEntries={searchedAlbums} />
    </Suspense>
  );
}

const Grid = ({ albumEntries }) => {
  const { data: covers } = useAlbumCovers(albumEntries);

  return (
    <div className="coversGrid">
      {covers.map((album) => (
        <div key={album.key} className="coverItem">
          <img
            src={album.artworkUrl600}
            alt={album.albumName}
            className="coverImage"
          />
          <div className="albumTitle">
            {album.artistName} — {album.albumName}
          </div>
        </div>
      ))}
    </div>
  );
};