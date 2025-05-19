import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import {PageContext} from "../App.jsx"

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [bgHeight, setBgHeight] = useState("100vh");
  const {currPage, handleCurrPage} = useContext(PageContext)

  useEffect(() =>{
    handleCurrPage("Register")
  }, [])
    
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBgHeight(`${img.height}px`);
    };
  }, []);

  // Fungsi untuk menangani registrasi
  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/users", {
        username: username,
        password: password,
      });

      if (response.data.message === "User created successfully") {
        setMessage("Registrasi berhasil! Silakan login.");
        setUsername("");
        setPassword("");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setMessage("Username sudah digunakan!");
      } else {
        setMessage("Terjadi kesalahan saat registrasi.");
      }
    }
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
      <Navbar registeredPage = "true"/>
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
          zIndex: -1,
        }}
      />
      <div className="container flex-grow-1">
        <h2 className="text-center my-5 text-white">Register Form</h2>

        <div className="row justify-content-center">
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm bg-transparent">
              <div className="card-body bg-transparent">
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label text-white">
                      Username:
                    </label>
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
                    <label htmlFor="password" className="form-label text-white">
                      Password:
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-outline-success w-100">
                    Register
                  </button>
                </form>
                {message === "Username sudah digunakan!" || message === "Terjadi kesalahan saat registrasi." ? (<p className="text-center mt-3 text-danger">{message}</p>) : (<p className="text-center mt-3 text-white">{message}</p>)}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
