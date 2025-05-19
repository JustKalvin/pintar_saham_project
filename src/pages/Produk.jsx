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
import "./Produk.css"; // Impor file CSS kustom

const Produk = () => {
  const location = useLocation();
  const { currPage, handleCurrPage } = useContext(PageContext);

  useEffect(() => {
    handleCurrPage("Produk");
  }, [handleCurrPage]); // Tambahkan handleCurrPage ke dependency array

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll ke atas setiap kali halaman diakses
  }, [location.pathname]);

  const games = [
    {
      title: "Prediksi Saham dengan AI",
      description:
        "Gunakan model AI untuk menganalisis dan memprediksi pergerakan harga saham berdasarkan data historis.",
      url: "https://stock-market-prediction-app-x8vbrg3zaolma7hdekykbw.streamlit.app/",
      buttonText: "Coba Sekarang",
      imageDir: stonk,
    },
    {
      title: "Game Tebak Naik atau Turun",
      description:
        "Uji intuisi dan analisis Anda dengan permainan seru untuk memprediksi apakah harga saham akan naik atau turun!",
      url: "https://stock-market-game-uwlsqju6nubudzxrzhjkt4.streamlit.app/",
      buttonText: "Main Sekarang",
      imageDir: stonk2,
    },
    {
      title: "Analisis Saham secara Real-Time",
      description:
        "Analisis saham manapun secara real time dengan LLM (Large Language Model)!",
      url: "https://stock-analysis-pintarsaham-aj5644turzjjrfornmcnv8.streamlit.app/",
      buttonText: "Analisis Sekarang",
      imageDir: stonk3,
    },
  ];

  // State untuk mengontrol animasi fade-in judul
  const [titleVisible, setTitleVisible] = useState(false);
  // State untuk animasi kartu (jika diperlukan untuk stagger effect, dll.)
  // const [cardsVisible, setCardsVisible] = useState(false);


  // Efek untuk animasi judul
  useEffect(() => {
    const timer = setTimeout(() => {
      setTitleVisible(true);
    }, 300); // Sedikit delay untuk efek fade-in
    return () => clearTimeout(timer);
  }, []);

  // Tidak perlu lagi state bgHeight jika background hanya menutupi viewport
  // const [bgHeight, setBgHeight] = useState("100vh");
  // useEffect(() => {
  //   const img = new Image();
  //   img.src = backgroundImage;
  //   img.onload = () => {
  //     setBgHeight(`${img.height}px`); // Ini akan membuat tinggi berdasarkan gambar asli, mungkin tidak ideal untuk responsivitas
  //   };
  // }, []);


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Pastikan minimal setinggi viewport
        position: "relative",
        overflowX: "hidden", // Mencegah scroll horizontal karena animasi
      }}
    >
      <Navbar />
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // Membuat background tetap saat scroll
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -1,
        }}
      />
      <div className="container flex-grow-1">
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
              className="col-md-6 col-lg-4 mb-4 d-flex card-container-animation"
              key={index}
              style={{ animationDelay: `${index * 0.2}s` }} // Stagger effect untuk kartu
            >
              <div className="card shadow-sm w-100 h-100 product-card"> {/* Tambahkan class product-card */}
                <img
                  src={game.imageDir}
                  alt={game.title}
                  className="card-img-top"
                  style={{ objectFit: "cover", height: "200px" }}
                />
                <div className="card-body d-flex flex-column justify-content-between text-center">
                  <div>
                    <h5 className="card-title">{game.title}</h5>
                    <p className="card-text">{game.description}</p>
                  </div>
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn mt-3 custom-button" // Tambahkan class custom-button
                    // Hapus inline style untuk tombol karena sudah di CSS
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