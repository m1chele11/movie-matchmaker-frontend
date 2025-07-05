"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";



export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();


    try{
      const response = await fetch("http://localhost:8080/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        setErrorMsg("Username already exists");
        return;
      }

      router.push("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      setErrorMsg("An error occurred. Please try again.");
    }

    setErrorMsg("");//reset error message
    
  };
    
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
        .error {
          color: red;
          text-align: center;
          margin-top: 1rem;
        }
      `}</style>

      <div className="form-container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
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

          <button type="submit">Register</button>
        </form>

        {errorMsg && <div className="error">{errorMsg}</div>}

        <div className="link">
          <p>
            Dont have an account? <Link href="/login">Sign In</Link>
          </p>
        </div>
      </div>
    </>
    );
  }
  