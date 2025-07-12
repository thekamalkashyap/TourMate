"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const Trips = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    from: "",
    to: "",
    departureDate: "",
    returnDate: "",
    travelType: "",
    preferences: "",
  });

  const { from, to, departureDate, returnDate, travelType, preferences } =
    formData;

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/trips", {
          headers: { "x-auth-token": localStorage.getItem("token") },
        });
        setTrips(res.data);
      } catch (err: any) {
        console.error(err.response.data);
      }
    };

    fetchTrips();
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
      const body = JSON.stringify(formData);
      const res = await axios.post(
        "http://localhost:3001/api/trips",
        body,
        config
      );
      setTrips([res.data, ...trips]);
      setFormData({
        from: "",
        to: "",
        departureDate: "",
        returnDate: "",
        travelType: "",
        preferences: "",
      });
    } catch (err: any) {
      console.error(err.response.data);
    }
  };

  return (
    <div className="form-container">
      <h1>Create a Trip</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="from">From</label>
          <input type="text" name="from" value={from} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="to">To</label>
          <input type="text" name="to" value={to} onChange={onChange} />
        </div>
        <div className="form-group">
          <label htmlFor="departureDate">Departure Date</label>
          <input
            type="date"
            name="departureDate"
            value={departureDate}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="returnDate">Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={returnDate}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="travelType">Travel Type</label>
          <input
            type="text"
            name="travelType"
            value={travelType}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="preferences">Preferences</label>
          <input
            type="text"
            name="preferences"
            value={preferences}
            onChange={onChange}
          />
        </div>
        <input
          type="submit"
          value="Create Trip"
          className="btn btn-primary btn-block"
        />
      </form>
      <div>
        <h2>My Trips</h2>
        {trips.map((trip: any) => (
          <div key={trip._id}>
            <h3>
              {trip.from} to {trip.to}
            </h3>
            <p>
              Departure: {new Date(trip.departureDate).toLocaleDateString()}
            </p>
            {trip.returnDate && (
              <p>Return: {new Date(trip.returnDate).toLocaleDateString()}</p>
            )}
            <p>Travel Type: {trip.travelType}</p>
            {trip.preferences && <p>Preferences: {trip.preferences}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;
