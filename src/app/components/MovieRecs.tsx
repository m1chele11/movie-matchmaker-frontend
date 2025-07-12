"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

export default function MovieRecs({ title }: { title: string }) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommendations() {
      try {
        const res = await fetch(
          `/api/recommendations/enhanced?title=${encodeURIComponent(title)}`
        );
        if (!res.ok) throw new Error("Failed to fetch recommendations");
        const data = await res.json();
        setRecommendations(data.recommendations);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    }

    if (title) {
      fetchRecommendations();
    }
  }, [title]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (!recommendations.length) return <p style={{ textAlign: "center" }}>No results found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 px-4">
      {recommendations.map((movie, idx) => (
        <div key={idx} className="bg-white rounded-xl p-4 shadow-md text-black">
          <Image
            src={movie.posterUrl || "https://via.placeholder.com/300x450"}
            alt={movie.title}
            width={300}
            height={450}
            className="w-full h-72 object-cover rounded-lg mb-4"

          />
          <h2 className="text-xl font-bold">{movie.title} ({movie.releaseYear})</h2>
          <p className="text-sm text-gray-600">{movie.genres.join(", ")}</p>
          <p className="mt-2 text-sm">{movie.overview}</p>
          <p className="text-sm mt-2 text-blue-600">
            Available on: {movie.streamingPlatforms.join(", ") || "Not found"}
          </p>
          <p className="text-sm text-gray-800">IMDB Rating: {movie.voteAverage ?? "N/A"}</p>
        </div>
      ))}
    </div>
  );
}
