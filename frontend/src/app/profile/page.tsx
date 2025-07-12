"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    interests: "",
    travelStyle: "",
  });

  const { interests, travelStyle } = formData;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/profile/me", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setProfile(res.data);
        setFormData({
          interests: res.data.interests.join(","),
          travelStyle: res.data.travelStyle,
        });
      } catch (err: any) {
        console.error(err.response.data);
      }
    };

    fetchProfile();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
      };
      const body = JSON.stringify({
        interests: interests.split(",").map((interest) => interest.trim()),
        travelStyle,
      });
      const res = await axios.post(
        "http://localhost:3001/api/profile",
        body,
        config
      );
      setProfile(res.data);
    } catch (err: any) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1>User Profile</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="interests">Interests (comma separated)</label>
          <input
            type="text"
            name="interests"
            value={interests}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="travelStyle">Travel Style</label>
          <input
            type="text"
            name="travelStyle"
            value={travelStyle}
            onChange={onChange}
          />
        </div>
        <input
          type="submit"
          value="Update Profile"
          className="btn btn-primary btn-block"
        />
      </form>
    </div>
  );
};

export default Profile;
