"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import MovieSpinner from "@/assets/lotties/movieSpinner.json";
import { useEffect } from "react";



const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

export default function LoginPage() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
      setIsHydrated(true);
    }, []);

    if (!isHydrated) {
      return (
        <div style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }}>
          <Player
            autoplay
            loop
            src={MovieSpinner}
            style={{ height: "80px", width: "80px" }}
          />
        </div>
      );
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

      e.preventDefault();

      setErrorMsg("");//reset error message

      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          setErrorMsg("Invalid username or password");
          setIsLoading(false);
          return;
        }
        const token = await response.text();
        localStorage.setItem("token", token);
        setIsLoading(false);


        //redirect to home page or dashboard
        router.push("/");
      } catch (error) {
        console.error("Login failed:", error);
        setErrorMsg("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    return (
    <>
      <style jsx>{`
        .form-container {
          background-color: #222;
          padding: 2rem;
          border-radius: 10px;
          width: 320px;
          box-shadow: 0 0 15px rgba(0,0,0,0.7);
          color: #eee;
          font-family: 'Arial', sans-serif;
          margin: auto;
          margin-top: 5rem;
        }
        h2 {
          margin-bottom: 1.5rem;
          font-weight: 700;
          font-size: 1.75rem;
          color: #f39c12;
          text-align: center;
        }
        label {
          display: block;
          margin-bottom: 0.4rem;
          font-weight: 600;
          font-size: 0.9rem;
        }
        input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          margin-bottom: 1rem;
          border: none;
          border-radius: 6px;
          background-color: #333;
          color: #eee;
          font-size: 1rem;
        }
        input::placeholder {
          color: #999;
        }
        button {
          width: 100%;
          padding: 0.75rem;
          background-color: #f39c12;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          color: #222;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #d87e0a;
        }
        .link {
          margin-top: 1rem;
          text-align: center;
          font-size: 0.9rem;
          color: #ccc;
        }
        .link a {
          color: #f39c12;
          text-decoration: none;
        }
        .link a:hover {
          text-decoration: underline;
        }
      `}</style>

      <div className="form-container">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Player
                autoplay
                loop
                src={MovieSpinner}
                style={{ height: "40px", width: "40px", margin: "0 auto" }}
              />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="link">
          <p>
            Dont have an account? <Link href="/register">Sign Up</Link>
          </p>
        </div>

        {errorMsg && <p style={{ color: "#f39c12", textAlign: "center" }}>{errorMsg}</p>}
      </div>
    </>

    );
  }
  