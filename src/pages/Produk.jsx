import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png"
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import stonk from "../assets/stonk.jpg"
import stonk2 from "../assets/stonk2.jpg"
import stonk3 from "../assets/stonk3.jpg"
import {PageContext} from "../App.jsx"

const Produk = () => {
  const location = useLocation();
  const {currPage, handleCurrPage} = useContext(PageContext)

  useEffect(() => {
    handleCurrPage("Produk")
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll ke atas setiap kali halaman diakses
  }, [location.pathname]);
  const games = [
    {
      title: "Prediksi Saham dengan AI",
      description:
        "Gunakan model AI untuk menganalisis dan memprediksi pergerakan harga saham berdasarkan data historis.",
      url: "https://stock-market-prediction-app-x8vbrg3zaolma7hdekykbw.streamlit.app/", // Ganti dengan link Streamlit asli
      buttonText: "Coba Sekarang",
      imageDir : stonk
    },
    {
      title: "Game Tebak Naik atau Turun",
      description:
        "Uji intuisi dan analisis Anda dengan permainan seru untuk memprediksi apakah harga saham akan naik atau turun!",
      url: "https://stock-market-game-uwlsqju6nubudzxrzhjkt4.streamlit.app/", // Ganti dengan link Streamlit asli
      buttonText: "Main Sekarang",
      imageDir : stonk2
    },
    {
      title: "Analisis Saham secara Real-Time",
      description:
        "Analisis saham manapun secara real time dengan LLM (Large Language Model)!",
      url: "https://stock-analysis-pintarsaham-aj5644turzjjrfornmcnv8.streamlit.app/", // Ganti dengan link Streamlit asli
      buttonText: "Analisis Sekarang",
      imageDir : stonk3
    },
  ];

  const [bgHeight, setBgHeight] = useState("100vh"); // Default tinggi layar

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBgHeight(`${img.height}px`); // Set tinggi sesuai gambar
    };
  }, []);

  return (
    <div 
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: bgHeight,
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
        <h2 className="text-center my-5 text-white py-5">Produk PintarSaham</h2>

        <div className="row justify-content-center">
          {games.map((game, index) => (
            <div className="col-md-6 col-lg-4 mb-4 d-flex" key={index}>
              <div className="card shadow-sm w-100 h-100">
                {/* Gambar di atas */}
                <img
                  src={game.imageDir} // gunakan require jika menggunakan file lokal
                  alt={game.title}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "200px" }} // sesuaikan tinggi gambar
                />

                {/* Konten card di bawah */}
                <div className="card-body d-flex flex-column justify-content-between text-center">
                  <div>
                    <h5 className="card-title">{game.title}</h5>
                    <p className="card-text">{game.description}</p>
                  </div>
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn mt-3"
                    style={{
                      background: "linear-gradient(to right, #000000, #527942)", 
                      border: "none",
                      color: "white",
                      fontWeight: 600,
                      padding: "0.5rem 1rem",
                      borderRadius: "0.375rem",
                      textDecoration: "none",
                      display: "inline-block",
                      transition: "background 0.3s ease"
                    }}
                  >
                    {game.buttonText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default Produk;