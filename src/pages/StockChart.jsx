import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import { useLocation } from "react-router-dom";
import {PageContext} from "../App.jsx"
import { motion } from "framer-motion";

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

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
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center my-5 py-5"
          >
            <motion.h2
              style={{
                fontSize: "3rem",
                fontWeight: "700",
                textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                background: "linear-gradient(to right, #fff, #ddd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                position: "relative",
                paddingBottom: "20px"
              }}
            >
              Stock Chart
              <motion.div 
                style={{
                  position: "absolute",
                  bottom: "10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  height: "4px",
                  width: "100px",
                  background: "linear-gradient(to right, #d9d9d9, #848484)", 
                  borderRadius: "2px",
                  marginTop : "100px"
                }}
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </motion.h2>
          </motion.div>
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
