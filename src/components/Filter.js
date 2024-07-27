import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api';
import './Filter.css';

const Filter = ({ setFilteredMovies }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(new URLSearchParams(location.search).get('genre') || '');

  useEffect(() => {
    const fetchGenres = async () => {
      const response = await api.get('/genre/movie/list');
      setGenres(response.data.genres);
    };

    fetchGenres();
  }, []);

  useEffect(() => {
    const fetchMovies = async () => {
      if (selectedGenre) {
        const response = await api.get('/discover/movie', { params: { with_genres: selectedGenre } });
        setFilteredMovies(response.data.results);
      } else {
        setFilteredMovies([]);
      }
    };

    fetchMovies();
  }, [selectedGenre, setFilteredMovies]);

  const handleChange = (e) => {
    const genreId = e.target.value;
    setSelectedGenre(genreId);
    navigate(`?genre=${genreId}`);
  };

  return (
    <div className="filter-container">
      <select onChange={handleChange} value={selectedGenre}>
        <option value="">Select Genre</option>
        {genres.map(genre => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;