"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Matches = () => {
  const [matches, setMatches] = useState<any[]>([]);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/matches", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setMatches(res.data);
      } catch (err: any) {
        console.error(err.response.data);
      }
    };

    fetchMatches();
  }, []);

  const likeUser = async (userId: string) => {
    try {
      const res = await axios.post(
        `http://localhost:3001/api/matches/like/${userId}`,
        {},
        {
          headers: { "x-auth-token": localStorage.getItem("token") },
        }
      );
      console.log(res.data);
    } catch (err: any) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1>Potential Matches</h1>
      <div>
        {matches.map((match: any) => (
          <div key={match._id}>
            <h3>{match.user.name}</h3>
            <p>
              Traveling from {match.from} to {match.to}
            </p>
            <p>
              Departure: {new Date(match.departureDate).toLocaleDateString()}
            </p>
            {match.returnDate && (
              <p>Return: {new Date(match.returnDate).toLocaleDateString()}</p>
            )}
            <p>Travel Type: {match.travelType}</p>
            {match.preferences && <p>Preferences: {match.preferences}</p>}
            <button
              onClick={() => likeUser(match.user._id)}
              className="btn btn-primary"
            >
              Like
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Matches;
