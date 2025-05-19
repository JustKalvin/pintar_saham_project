import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import { useLocation } from "react-router-dom";
import {PageContext} from "../App.jsx"

function Home() {
  const location = useLocation();
  const {currPage, handleCurrPage} = useContext(PageContext)

  useEffect(() =>{
    handleCurrPage("StockChart")
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll ke atas setiap kali halaman diakses
  }, [location.pathname]);
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
      {/* Navbar */}
      <Navbar />

      {/* Background Layer */}
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

      {/* Konten Utama */}
      <div className="content text-white text-center py-5" style={{ flexGrow: 1 }}>
        <h2 className="text-xl font-bold mb-2">Stock Chart</h2>
        <iframe
          src="https://stock-chart-view.streamlit.app/?embedded=true"
          width="80%"
          height="600px"
          style={{ border: "none" }}
          title="Stock Chart"
        />
      </div>

      {/* Footer (Selalu di Bawah) */}
      <Footer />
    </div>
  );
}

export default Home;
