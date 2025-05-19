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
import { motion } from "framer-motion";
import "./Produk.css";
import ProdukCard from "../components/ProdukCard.jsx";

const GradientBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 100%
    ),
    url(${backgroundImage});
  background-size: cover;
  background-position: top;
  background-repeat: no-repeat;
  background-attachment: fixed;
`;

const FloatingParticles = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;

  &::before {
    content: "";
    position: absolute;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    top: -100px;
    left: -100px;
    filter: blur(30px);
  }

  &::after {
    content: "";
    position: absolute;
    width: 200px;
    height: 200px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
    bottom: -50px;
    right: -50px;
    filter: blur(30px);
  }
`;

const FloatingElements = () => {
  return (
    <>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, (Math.random() - 0.5) * 50],
            x: [0, (Math.random() - 0.5) * 30],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </>
  );
};

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
      color: "#4e54c8",
      gradient: "linear-gradient(135deg, #4e54c8 0%, #8f94fb 100%)"
    },
    {
      title: "Game Tebak Naik atau Turun",
      description: "Uji intuisi dan analisis Anda dengan permainan seru untuk memprediksi apakah harga saham akan naik atau turun!",
      url: "https://stock-market-game-uwlsqju6nubudzxrzhjkt4.streamlit.app/",
      buttonText: "Main Sekarang",
      imageDir: stonk2,
      color: "#f54ea2",
      gradient: "linear-gradient(135deg, #f54ea2 0%, #ff7676 100%)"
    },
    {
      title: "Analisis Saham secara Real-Time",
      description: "Analisis saham manapun secara real time dengan LLM (Large Language Model)!",
      url: "https://stock-analysis-pintarsaham-aj5644turzjjrfornmcnv8.streamlit.app/",
      buttonText: "Analisis Sekarang",
      imageDir: stonk3,
      color: "#17ead9",
      gradient: "linear-gradient(135deg, #17ead9 0%, #6078ea 100%)"
    },
  ];

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
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <Navbar />
      <GradientBackground />
      <FloatingParticles />
      <FloatingElements />
      
      <motion.div
        className="container flex-grow-1 mx-auto d-flex flex-column justify-content-center align-items-center"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h2
          className="text-center my-5 text-white py-5"
          variants={itemVariants}
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
          Produk PintarSaham
          <motion.div 
            style={{
              position: "absolute",
              bottom: "10px",
              left: "50%",
              transform: "translateX(-50%)",
              height: "4px",
              width: "100px",
              background: "linear-gradient(to right, #d9d9d9, #848484)", 
              borderRadius: "2px"
            }}
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </motion.h2>
        
        <motion.div 
          className="row justify-content-center w-100"
          variants={containerVariants}
        >
          {games.map((game, index) => (
            <motion.div
              className="col-md-6 col-lg-4 mb-4 d-flex"
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ProdukCard
                title={game.title}
                description={game.description}
                buttonText={game.buttonText}
                imageDir={game.imageDir}
                color={game.color}
                gradient={game.gradient}
                url={game.url}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
      
      <Footer className="py-5" />
    </div>
  );
};

export default Produk;