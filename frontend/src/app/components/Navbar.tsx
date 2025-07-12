"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const authLinks = (
    <>
      <li>
        <Link href="/profile">Profile</Link>
      </li>
      <li>
        <Link href="/trips">Trips</Link>
      </li>
      <li>
        <Link href="/matches">Matches</Link>
      </li>
      <li>
        <Link href="/chat">Chat</Link>
      </li>
      <li>
        <a onClick={logout} href="#!">
          <i className="fas fa-sign-out-alt"></i>{" "}
          <span className="hide-sm">Logout</span>
        </a>
      </li>
    </>
  );

  const guestLinks = (
    <>
      <li>
        <Link href="/register">Register</Link>
      </li>
      <li>
        <Link href="/login">Login</Link>
      </li>
    </>
  );

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1>
          <Link href="/" className="text-white text-2xl font-bold">
            TourMate
          </Link>
        </h1>
        <ul className="flex space-x-4 text-white">
          {token ? authLinks : guestLinks}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
