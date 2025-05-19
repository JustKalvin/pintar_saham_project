import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import {PageContext} from "../App.jsx"

const Login = () => {
  const location = useLocation();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedIn, setLoggedIn] = useState(false); // State untuk status login
  const [bgHeight, setBgHeight] = useState("100vh"); // Default tinggi layar
  const {currPage, handleCurrPage} = useContext(PageContext)

  useEffect(() =>{
    handleCurrPage("Login")
  }, [])
  // Cek apakah user sudah login (username disimpan di localStorage)
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      setLoggedIn(true);
    }
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBgHeight(`${img.height}px`); // Set tinggi sesuai gambar
    };
  }, []);

  // Fungsi untuk login
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/login', {
        username: username,
        password: password,
      });
      
      if (response.data.message === "Login successful") {
        localStorage.setItem('username', username); // Simpan username di localStorage
        setLoggedIn(true);
        setMessage(`Selamat datang ${username}!`);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMessage('Username tidak ditemukan!');
      } else if (error.response && error.response.status === 401) {
        setMessage('Password salah!');
      } else {
        setMessage('Terjadi kesalahan saat login.');
      }
    }
  };

  // Fungsi untuk logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    setUsername('');
    setPassword('');
    setLoggedIn(false);
    setMessage('');
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Navbar />
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1, // Background di belakang konten
        }}
      />
      <div className="container flex-grow-1">
        <h2 className="text-center my-5 text-white">{loggedIn ? `Hallo, ${username}` : 'Login Form'}</h2>

        {/* Jika belum login, tampilkan form login */}
        {!loggedIn ? (
          <div className="row justify-content-center">
            <div className="col-md-6 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label text-dark">Username:</label>
                      <input
                        type="text"
                        id="username"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label text-dark">Password:</label>
                      <input
                        type="password"
                        id="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-success w-100">Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Jika sudah login, tampilkan nama pengguna
          <div>
            <h3 className="text-white">Selamat datang, {username}!</h3>
            <button className="btn btn-danger mt-3" onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Login;
