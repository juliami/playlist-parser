import { createContext, useState, useContext } from "react";

const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
  const [searchedAlbums, setSearchedAlbums] = useState([]);
  const [selectedAlbums, setSelectedAlbums] = useState([]); 
  

  const addSearchedAlbums = (albums) => setSearchedAlbums(albums);
//   const clearAlbums = () => setSearchedAlbums([]);

  const toggleSelectedAlbums = ({src}) => {
    const exists = selectedAlbums.find((s) => s.src === src);
        if (exists) {
            setSelectedAlbums(selectedAlbums.filter((s) => s.src !== src));
        } else if (selectedAlbums.length < 4) {
            setSelectedAlbums([...selectedAlbums, { src }]);
        }
  }

  return (
    <AlbumContext.Provider value={{ searchedAlbums, addSearchedAlbums, toggleSelectedAlbums, selectedAlbums }}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbumContext = () => useContext(AlbumContext);