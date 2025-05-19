import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import stonk from "../assets/stonk.jpg";
import stonk2 from "../assets/stonk2.jpg";
import stonk3 from "../assets/stonk3.jpg";
import { PageContext } from "../App.jsx";
import styled from "styled-components";
import "./Produk.css";
import ProdukCard from "../components/ProdukCard.jsx"


const Produk = () => {
  const location = useLocation();
  const { currPage, handleCurrPage } = useContext(PageContext);

  useEffect(() => {
    handleCurrPage("Produk");
  }, [handleCurrPage]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const games = [
    {
      title: "Prediksi Saham dengan AI",
      description: "Gunakan model AI untuk menganalisis dan memprediksi pergerakan harga saham berdasarkan data historis.",
      url: "https://stock-market-prediction-app-x8vbrg3zaolma7hdekykbw.streamlit.app/",
      buttonText: "Coba Sekarang",
      imageDir: stonk,
      color: "#4e54c8"
    },
    {
      title: "Game Tebak Naik atau Turun",
      description: "Uji intuisi dan analisis Anda dengan permainan seru untuk memprediksi apakah harga saham akan naik atau turun!",
      url: "https://stock-market-game-uwlsqju6nubudzxrzhjkt4.streamlit.app/",
      buttonText: "Main Sekarang",
      imageDir: stonk2,
      color: "#f54ea2"
    },
    {
      title: "Analisis Saham secara Real-Time",
      description: "Analisis saham manapun secara real time dengan LLM (Large Language Model)!",
      url: "https://stock-analysis-pintarsaham-aj5644turzjjrfornmcnv8.streamlit.app/",
      buttonText: "Analisis Sekarang",
      imageDir: stonk3,
      color: "#17ead9"
    },
  ];

  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      <div className="container flex-grow-1 mx-auto d-flex flex-column justify-content-center align-items-center">
        <h2
          className={`text-center my-5 text-white py-5 title-animation ${
            titleVisible ? "fade-in" : ""
          }`}
        >
          Produk PintarSaham
        </h2>
        <div className="row justify-content-center">
        {games.map((game, index) => (
          <div
            className="col-md-6 col-lg-4 mb-4 d-flex card-container-animation pb-5 mb-5 mx-3"
            key={index}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <ProdukCard
              title={game.title}
              description={game.description}
              buttonText={game.buttonText}
              imageDir={game.imageDir}
              color={game.color}
              url={game.url}
            />
          </div>
        ))}
        </div>
      </div>
      <Footer className="py-5" />
    </div>
  );
};

export default Produk;