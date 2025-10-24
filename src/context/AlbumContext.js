import { createContext, useState, useContext } from "react";

const AlbumContext = createContext();

export const AlbumProvider = ({ children }) => {
  const [searchedAlbums, setSearchedAlbums] = useState([]);

  const addAlbums = (albums) => setSearchedAlbums(albums);
//   const clearAlbums = () => setSearchedAlbums([]);

  return (
    <AlbumContext.Provider value={{ searchedAlbums, addAlbums }}>
      {children}
    </AlbumContext.Provider>
  );
};

export const useAlbumContext = () => useContext(AlbumContext);