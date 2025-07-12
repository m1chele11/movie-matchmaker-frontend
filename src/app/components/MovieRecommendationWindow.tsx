"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, Star, Calendar, Play, ExternalLink } from "lucide-react";

type Recommendation = {
  title: string;
  overview: string;
  popularity: number;
  similarity: number;
  voteAverage: number;
  posterUrl: string;
  streamingPlatforms: string[];
  releaseYear: number;
  imdbId: string;
  genres: string[];
};

interface MovieRecommendationWindowProps {
  recommendations: Recommendation[];
  isOpen: boolean;
  onClose: () => void;
  searchedTitle?: string;
}

const streamingColors: Record<string, string> = {
  "Netflix": "#E50914",
  "Hulu": "#1CE783",
  "Amazon Prime": "#FF6700",
  "Disney+": "#00A8E1",
  "HBO Max": "#5B3994",
  "Prime Video": "#FF6700",
  "Apple TV+": "#000000",
  "Paramount+": "#0066CC",
  "Peacock": "#00A96E",
  "Crunchyroll": "#FF6500",
};

export default function MovieRecommendationWindow({
  recommendations,
  isOpen,
  onClose,
  searchedTitle,
}: MovieRecommendationWindowProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Recommendation | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setTimeout(() => setIsVisible(false), 300);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setSelectedMovie(null);
    onClose();
  };

  const handleMovieClick = (movie: Recommendation) => {
    setSelectedMovie(movie);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      if (selectedMovie) {
        setSelectedMovie(null);
      } else {
        handleClose();
      }
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <style jsx>{`
        .theater-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(8px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          opacity: ${isOpen ? 1 : 0};
          transition: opacity 0.3s ease;
        }

        .theater-window {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 24px;
          max-width: 95vw;
          max-height: 90vh;
          width: 1200px;
          position: relative;
          overflow: hidden;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.8),
            0 0 100px rgba(255, 193, 7, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          transform: ${isOpen ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(20px)'};
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .theater-header {
          padding: 2rem 2rem 1rem;
          background: linear-gradient(45deg, #ffc107 0%, #ff8f00 100%);
          color: #000;
          position: relative;
          overflow: hidden;
        }

        .theater-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20zm0 0c0 11.046 8.954 20 20 20s20-8.954 20-20-8.954-20-20-20-20 8.954-20 20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
          opacity: 0.1;
        }

        .theater-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin: 0 0 0.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          position: relative;
          z-index: 1;
        }

        .theater-subtitle {
          font-size: 1.1rem;
          opacity: 0.8;
          margin: 0;
          position: relative;
          z-index: 1;
        }

        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: none;
          color: #000;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 2;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .close-btn:hover {
          background: rgba(0, 0, 0, 0.5);
          transform: scale(1.1);
        }

        .theater-content {
          padding: 0;
          max-height: calc(90vh - 140px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: #ffc107 #2d2d2d;
        }

        .theater-content::-webkit-scrollbar {
          width: 8px;
        }

        .theater-content::-webkit-scrollbar-track {
          background: #2d2d2d;
        }

        .theater-content::-webkit-scrollbar-thumb {
          background: #ffc107;
          border-radius: 4px;
        }

        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }

        .movie-card {
          background: linear-gradient(145deg, #2a2a2a 0%, #1e1e1e 100%);
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .movie-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.8),
            0 0 30px rgba(255, 193, 7, 0.2);
          border-color: rgba(255, 193, 7, 0.3);
        }

        .movie-poster {
          position: relative;
          height: 400px;
          overflow: hidden;
        }

        .movie-poster img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .movie-card:hover .movie-poster img {
          transform: scale(1.05);
        }

        .movie-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
          padding: 2rem 1rem 1rem;
          color: white;
        }

        .movie-info {
          padding: 1.5rem;
        }

        .movie-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: #ffc107;
          line-height: 1.2;
        }

        .movie-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: #ccc;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #ffc107;
          font-weight: 600;
        }

        .genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .genre-tag {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid rgba(255, 193, 7, 0.3);
        }

        .movie-overview {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #e0e0e0;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .streaming-platforms {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 1rem;
        }

        .platform-tag {
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          color: white;
          background: #666;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(255, 193, 7, 0.9);
          color: #000;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .movie-card:hover .play-icon {
          opacity: 1;
        }

        .movie-detail-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          z-index: 10000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          opacity: ${selectedMovie ? 1 : 0};
          visibility: ${selectedMovie ? 'visible' : 'hidden'};
          transition: all 0.3s ease;
        }

        .movie-detail-content {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border-radius: 24px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          transform: ${selectedMovie ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'};
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .movie-detail-header {
          position: relative;
          height: 300px;
          overflow: hidden;
        }

        .movie-detail-poster {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .movie-detail-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.9));
          padding: 3rem 2rem 2rem;
          color: white;
        }

        .movie-detail-info {
          padding: 2rem;
        }

        .detail-title {
          font-size: 2.5rem;
          font-weight: 900;
          margin: 0 0 1rem;
          color: #ffc107;
        }

        .detail-overview {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #e0e0e0;
          margin-bottom: 2rem;
        }

        .detail-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .meta-item {
          background: rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .meta-label {
          font-size: 0.9rem;
          color: #ccc;
          margin-bottom: 0.5rem;
        }

        .meta-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #ffc107;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #999;
        }

        @media (max-width: 768px) {
          .theater-window {
            width: 95vw;
            max-height: 95vh;
          }
          
          .movies-grid {
            grid-template-columns: 1fr;
            padding: 1rem;
          }
          
          .theater-title {
            font-size: 1.8rem;
          }
          
          .movie-detail-content {
            width: 95vw;
            max-height: 95vh;
          }
        }
      `}</style>

      <div className="theater-backdrop" onClick={handleBackdropClick}>
        <div className="theater-window">
          <div className="theater-header">
            <h2 className="theater-title">
              🎭 Cinematic Recommendations
            </h2>
            <p className="theater-subtitle">
              {searchedTitle ? `Based on "${searchedTitle}"` : 'Curated for you'}
            </p>
            <button className="close-btn" onClick={handleClose}>
              <X size={20} />
            </button>
          </div>

          <div className="theater-content">
            {recommendations.length > 0 ? (
              <div className="movies-grid">
                {recommendations.map((movie, index) => (
                  <div
                    key={index}
                    className="movie-card"
                    onClick={() => handleMovieClick(movie)}
                  >
                    <div className="movie-poster">
                      <Image
                        src={movie.posterUrl || "https://via.placeholder.com/300x450/1a1a1a/666?text=No+Image"}
                        alt={movie.title}
                        width={300}
                        height={450}
                        className="movie-poster-img"
                      />
                      <div className="play-icon">
                        <Play size={24} fill="currentColor" />
                      </div>
                    </div>

                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      
                      <div className="movie-meta">
                        <span className="rating">
                          <Star size={16} fill="currentColor" />
                          {movie.voteAverage ? movie.voteAverage.toFixed(1) : 'N/A'}
                        </span>
                        <span className="year">
                          <Calendar size={16} />
                          {movie.releaseYear}
                        </span>
                      </div>

                      <div className="genres">
                        {movie.genres.slice(0, 3).map((genre, idx) => (
                          <span key={idx} className="genre-tag">
                            {genre}
                          </span>
                        ))}
                      </div>

                      <p className="movie-overview">
                        {movie.overview || "No overview available."}
                      </p>

                      {movie.streamingPlatforms.length > 0 && (
                        <div className="streaming-platforms">
                          {movie.streamingPlatforms.slice(0, 3).map((platform, idx) => (
                            <span
                              key={idx}
                              className="platform-tag"
                              style={{
                                background: streamingColors[platform] || '#666'
                              }}
                            >
                              <Play size={12} fill="currentColor" />
                              {platform}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <h3>No recommendations found</h3>
                <p>Try searching for a different movie title or adjust your preferences.</p>
              </div>
            )}
          </div>
        </div>

        {/* Movie Detail Modal */}
        {selectedMovie && (
          <div className="movie-detail-modal" onClick={handleBackdropClick}>
            <div className="movie-detail-content">
              <div className="movie-detail-header">
                <Image
                  src={selectedMovie.posterUrl || "https://via.placeholder.com/800x300/1a1a1a/666?text=No+Image"}
                  alt={selectedMovie.title}
                  width={800}
                  height={300}
                  className="movie-detail-poster"
                />
                <div className="movie-detail-overlay">
                  <h2 className="detail-title">{selectedMovie.title}</h2>
                  <div className="movie-meta">
                    <span className="rating">
                      <Star size={20} fill="currentColor" />
                      {selectedMovie.voteAverage ? selectedMovie.voteAverage.toFixed(1) : 'N/A'}
                    </span>
                    <span className="year">
                      <Calendar size={20} />
                      {selectedMovie.releaseYear}
                    </span>
                  </div>
                </div>
                <button className="close-btn" onClick={() => setSelectedMovie(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="movie-detail-info">
                <p className="detail-overview">
                  {selectedMovie.overview || "No overview available."}
                </p>

                <div className="detail-meta">
                  <div className="meta-item">
                    <div className="meta-label">Genres</div>
                    <div className="meta-value">
                      {selectedMovie.genres.join(', ') || 'N/A'}
                    </div>
                  </div>

                  <div className="meta-item">
                    <div className="meta-label">Popularity</div>
                    <div className="meta-value">
                      {selectedMovie.popularity ? Math.round(selectedMovie.popularity) : 'N/A'}
                    </div>
                  </div>

                  <div className="meta-item">
                    <div className="meta-label">Similarity Score</div>
                    <div className="meta-value">
                      {selectedMovie.similarity ? `${Math.round(selectedMovie.similarity * 100)}%` : 'N/A'}
                    </div>
                  </div>

                  <div className="meta-item">
                    <div className="meta-label">Available On</div>
                    <div className="meta-value">
                      {selectedMovie.streamingPlatforms.length > 0 
                        ? selectedMovie.streamingPlatforms.join(', ')
                        : 'Check local providers'
                      }
                    </div>
                  </div>
                </div>

                {selectedMovie.imdbId && (
                  <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <a
                      href={`https://www.imdb.com/title/${selectedMovie.imdbId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#ffc107',
                        color: '#000',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        fontWeight: '600',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <ExternalLink size={18} />
                      View on IMDb
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}