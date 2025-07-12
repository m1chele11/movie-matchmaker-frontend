"use client";

import { useState } from "react";
import { useEffect } from "react";
import UserProfilePanel from "../components/profile";
import { useRouter } from "next/navigation";
import { parseJwt } from "./Parser";
import MovieRecs from "../components/MovieRecs";

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
  const router = useRouter();

  const [genreRanks, setGenreRanks] = useState<Record<string, number>>(() =>
    genres.reduce((acc, genre) => {
      acc[genre] = 3;
      return acc;
    }, {} as Record<string, number>)
  );

  const [genreRanks2, setGenreRanks2] = useState<Record<string, number>>(() =>
    genres.reduce((acc, genre) => {
      acc[genre] = 3;
      return acc;
    }, {} as Record<string, number>)
  );

  const [showSecondUser, setShowSecondUser] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userInfo, setUserInfo] = useState<{username: string; email?: string; avatarUrl?: string} | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [titleInput, setTitleInput] = useState("");
  const [searchedTitle, setSearchedTitle] = useState("");
  const [activeTab, setActiveTab] = useState<"preferences" | "title">("preferences");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      const payload = parseJwt(token);
      console.log("Decoded JWT payload:", payload); 
      if (payload && payload.sub) {
        setUserInfo({
          username: payload.sub,
          email: payload.email || "",
        });
      }
      setToken(token);
      setIsHydrated(true);
    }
  }, [router]);

  function handleRankChange(genre: string, value: number, user: 1 | 2 = 1) {
    if (user === 1) {
      setGenreRanks((prev) => ({ ...prev, [genre]: value }));
    } else {
      setGenreRanks2((prev) => ({ ...prev, [genre]: value }));
    }
  }

  function toggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service) ? prev.filter((s) => s !== service) : [...prev, service]
    );
  }

  async function handleSave() {
    const payload: {
      user1Genres: Record<string, number>;
      services: string[];
      user2Genres?: Record<string, number>;
    } = {
      user1Genres: genreRanks,
      services: selectedServices,
    };

    if (showSecondUser) {
      payload.user2Genres = genreRanks2;
    }
  
    try {
      const response = await fetch("http://localhost:8080/api/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
  
      const data = await response.json();
      alert("Preferences saved successfully!");
      console.log("Response from server:", data);
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences (mock)!");
    }
  }

  if (!isHydrated) {
    return null;
  }

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
    alert("Logged out!");
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

        .tab-container {
          max-width: 720px;
          margin: 1rem auto;
        }

        .tab-buttons {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 16px 16px 0 0;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
        }

        .tab-button {
          flex: 1;
          padding: 1rem 2rem;
          background: transparent;
          border: none;
          color: #f5f5f5;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .tab-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .tab-button.active {
          color: #ffc107;
          border-bottom-color: #ffc107;
          background: rgba(255, 193, 7, 0.1);
        }

        .tab-content {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(12px);
          border-radius: 0 0 16px 16px;
          padding: 2rem;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.3);
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

        .title-input {
          width: 100%;
          padding: 0.75rem;
          background-color: #1f1f1f;
          color: #f5f5f5;
          border: 1px solid #444;
          border-radius: 8px;
          font-size: 1rem;
          margin-bottom: 1rem;
        }

        .title-input:focus {
          outline: none;
          border-color: #ffc107;
          box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.2);
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

        .hamburger-btn {
          position: fixed;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 0.6rem;
          z-index: 1000;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
        }

        .hamburger-btn:hover {
          box-shadow: 0 0 8px 2px rgba(255, 193, 7, 0.6);
        }

        .bar {
          width: 24px;
          height: 3px;
          background-color: #ffc107;
          border-radius: 3px;
        }

        .profile-panel-wrapper {
          position: fixed;
          top: 0;
          right: 0;
          height: 100vh;
          width: 280px;
          background: rgba(18, 18, 18, 0.95);
          backdrop-filter: blur(12px);
          border-left: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
          z-index: 999;
          animation: slideIn 0.3s ease-out forwards;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>

      <button
        className="hamburger-btn"
        onClick={() => setShowProfile(!showProfile)}
        aria-label="Toggle profile panel"
      >
        <div className="bar"></div>
        <div className="bar"></div>
        <div className="bar"></div>
      </button>

      <main>
        <h1 className="title">🎬 Customize Your Movie Preferences</h1>

        {/* Tab Container */}
        <div className="tab-container">
          <div className="tab-buttons">
            <button
              className={`tab-button ${activeTab === "preferences" ? "active" : ""}`}
              onClick={() => setActiveTab("preferences")}
            >
              Genre Preferences
            </button>
            <button
              className={`tab-button ${activeTab === "title" ? "active" : ""}`}
              onClick={() => setActiveTab("title")}
            >
              Movie Title Search
            </button>
          </div>

          <div className="tab-content">
            {activeTab === "preferences" ? (
              <div>
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

                <div style={{ marginTop: "2rem" }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={showSecondUser}
                      onChange={(e) => setShowSecondUser(e.target.checked)}
                    />
                    &nbsp; Add preferences for a second user
                  </label>
                </div>

                {showSecondUser && (
                  <div style={{ marginTop: "2rem" }}>
                    <h2 style={{ color: "#FF9800" }}>2nd User Genre Preferences</h2>
                    {genres.map((genre) => (
                      <div key={genre} className="genre-row">
                        <span>{genre}</span>
                        <select
                          value={genreRanks2[genre]}
                          onChange={(e) =>
                            handleRankChange(genre, Number(e.target.value), 2)
                          }
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
                )}
              </div>
            ) : (
              <div>
                <h2>Get Recommendations by Movie Title</h2>
                <input
                  type="text"
                  className="title-input"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  placeholder="Enter a movie title to get similar recommendations..."
                />
                <button 
                  onClick={() => setSearchedTitle(titleInput)} 
                  className="save-btn"
                  style={{ margin: "0 auto", display: "block" }}
                >
                  Get Recommendations
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Streaming Services - Always visible below tabs */}
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
                    "--glow-color": color,
                  } as React.CSSProperties}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Save Button - Only show for preferences tab */}
        {activeTab === "preferences" && (
          <button className="save-btn" onClick={handleSave}>
            Save Preferences
          </button>
        )}
      </main>

      {showProfile && (
        <UserProfilePanel
          username={userInfo?.username || "Guest"}
          email={userInfo?.email}
          avatarUrl=""
          onLogout={handleLogout}
          onClose={() => setShowProfile(false)}
        />
      )}

      {/* Movie Recommendations */}
      {searchedTitle && <MovieRecs title={searchedTitle} />}
    </>
  );
}