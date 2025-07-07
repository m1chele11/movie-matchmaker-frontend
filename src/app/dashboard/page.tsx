"use client";

import { useState } from "react";
import { useEffect } from "react";


const genres = [
  "Action",
  "Comedy",
  "Drama",
  "Horror",
  "Sci-Fi",
  "Romance",
  "Thriller",
  "Fantasy",
];


const streamingServices = [
  { name: "Netflix", color: "#E50914" },
  { name: "Hulu", color: "#1CE783" },
  { name: "Amazon Prime", color: "#FF6700" },
  { name: "Disney+", color: "#00A8E1" },
  { name: "HBO Max", color: "#5B3994" },
];

export default function Dashboard() {
  const [genreRanks, setGenreRanks] = useState<Record<string, number>>(() =>
    genres.reduce((acc, genre) => {
      acc[genre] = 3;
      return acc;
    }, {} as Record<string, number>)
  );

  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  function handleRankChange(genre: string, value: number) {
    setGenreRanks((prev) => ({ ...prev, [genre]: value }));
  }

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  function handleSave() {
    console.log("Genre Ranks:", genreRanks);
    console.log("Selected Services:", selectedServices);
    alert("Preferences saved (mock)!");
  }

  if (!isHydrated) {
    return null;
  }

  return (
    <>
      <style jsx>{`
        main {
          min-height: 100vh;
          background-color: #121212;
          color: #f5f5f5;
          padding: 2rem;
          font-family: "Segoe UI", sans-serif;
        }

        .title {
          text-align: center;
          font-size: 2.5rem;
          font-weight: bold;
          margin-bottom: 2rem;
          color: #ffc107;
        }

        .card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 16px;
          padding: 2rem;
          max-width: 720px;
          margin: 1rem auto;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .card h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #e50914;
        }

        .genre-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        select {
          background-color: #1f1f1f;
          color: #f5f5f5;
          border: 1px solid #444;
          border-radius: 6px;
          padding: 0.4rem 0.6rem;
        }

        .services {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .service-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          background-color: #333;
          color: #fff;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: none;
        }

        .service-btn.selected {
          transform: scale(1.05);
          box-shadow: 0 0 8px 2px var(--glow-color);
          border: 1.5px solid var(--glow-color);
        }

        .save-btn {
          display: block;
          margin: 2rem auto 0;
          background-color: #ffc107;
          color: #222;
          font-size: 1rem;
          font-weight: bold;
          padding: 0.75rem 2rem;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .save-btn:hover {
          background-color: #e6b007;
        }
      `}</style>

      <main>
        <h1 className="title">🎬 Customize Your Movie Preferences</h1>

        <div className="card">
          <h2>Rank Your Favorite Genres</h2>
          {genres.map((genre) => (
            <div key={genre} className="genre-row">
              <span>{genre}</span>
              <select
                value={genreRanks[genre]}
                onChange={(e) => handleRankChange(genre, Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <div className="card">
          <h2 style={{ color: "#007BFF" }}>Select Streaming Services</h2>
          <div className="services">
            {streamingServices.map(({ name, color }) => {
              const isSelected = selectedServices.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleService(name)}
                  className={`service-btn ${isSelected ? "selected" : ""}`}
                  style={{
                    backgroundColor: isSelected ? color : "#333",
                    // pass glow color as CSS variable
                    "--glow-color": color,
                  } as React.CSSProperties}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        <button className="save-btn" onClick={handleSave}>
          Save Preferences
        </button>
      </main>
    </>
  );
}
