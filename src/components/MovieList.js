import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate,Link } from 'react-router-dom';
import api from '../api';
import Filter from './Filter';
import Search from './Search';
import './MovieList.css';

const MovieList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchedMovies, setSearchedMovies] = useState([]);
  const [page, setPage] = useState(1);

  const fetchMovies = async (params = {}) => {
    try {
      const response = await api.get('/movie/popular', { params });
      setMovies(response.data.results);
    } catch (error) {
      console.error("Failed to fetch movies", error);
    }
  };

  useEffect(() => {
    const handleURLChange = () => {
      const searchParams = new URLSearchParams(location.search);
      const query = searchParams.get('query');
      const genre = searchParams.get('genre');

      if (query) {
        api.get('/search/movie', { params: { query } })
          .then(response => setSearchedMovies(response.data.results))
          .catch(error => console.error("Failed to search movies", error));
      } else if (genre) {
        api.get('/discover/movie', { params: { with_genres: genre } })
          .then(response => setFilteredMovies(response.data.results))
          .catch(error => console.error("Failed to filter movies", error));
      } else {
        fetchMovies({ page });
      }
    };

    handleURLChange();
  }, [location.search, page]);

  useEffect(() => {
    if (location.pathname === '/') {
      setSearchedMovies([]);
      setFilteredMovies([]);
      setPage(1);
      if (location.search) {
        navigate('/'); 
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className="movie-list-container">
      <Search setSearchedMovies={setSearchedMovies} />
      <Filter setFilteredMovies={setFilteredMovies} />
      <div className="movie-list">
        {(searchedMovies.length > 0 ? searchedMovies : (filteredMovies.length > 0 ? filteredMovies : movies)).map(movie => (
          <Link key={movie.id} to={`/movie/${movie.id}`}>
            <div className="movie-item">
              <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
              <div className="movie-info">
                <h3>{movie.title}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
};

export default MovieList;