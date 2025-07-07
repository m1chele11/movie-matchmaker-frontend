"use client";

import React from "react";
import Image from "next/image";

interface UserProfilePanelProps {
  username: string;
  avatarUrl?: string;
  onLogout: () => void;
}

export default function UserProfilePanel({
  username,
  avatarUrl,
  onLogout,
}: UserProfilePanelProps) {
  return (
    <>
      <style jsx>{`
        .profile-panel {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(255 255 255 / 0.05);
          backdrop-filter: blur(12px);
          padding: 1.5rem;
          border-radius: 16px;
          width: 250px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
          color: #f5f5f5;
          font-family: "Segoe UI", sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          z-index: 1000;
        }

        .avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background-color: #444;
          object-fit: cover;
          border: 2px solid #ffc107;
        }

        .username {
          font-size: 1.25rem;
          font-weight: 600;
          color: #ffc107;
          text-align: center;
          word-break: break-word;
        }

        .logout-btn {
          background-color: #e50914;
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.3s ease;
        }

        .logout-btn:hover {
          background-color: #b20710;
        }
      `}</style>

      <aside className="profile-panel" aria-label="User Profile Panel">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${username} avatar`}
            className="avatar"
            width={80}
            height={80}
          />
        ) : (
          <div className="avatar" />
        )}
        <div className="username">{username}</div>
        <button className="logout-btn" onClick={onLogout} type="button">
          Log Out
        </button>
      </aside>
    </>
  );
}
