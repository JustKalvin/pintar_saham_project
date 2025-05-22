import backgroundImage from "../assets/BackgroundBody.png";
import stonk2 from "../assets/stonk2.jpg"; // This import seems unused
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate seems unused
import { PageContext } from "../App.jsx";
import stonkImage from "../assets/stonk3.jpg"; // Used for module cards and forum cards
import chartImage from "../assets/chart.png";
import Spline from '@splinetool/react-spline';
import { motion } from "framer-motion";
import axios from "axios";
import thumbnail1 from "../assets/thumbnail1.jpg"
import thumbnail2 from "../assets/thumbnail2.jpg"
import thumbnail3 from "../assets/thumbnail3.jpg"
import thumbnail4 from "../assets/thumbnail4.jpg"
import discussion from "../assets/discussion.png"

import { Link } from "react-router-dom";


const Modul = () => {
  const location = useLocation();
  const { handleCurrPage } = useContext(PageContext);
  const [news, setNews] = useState({ title: [], link: [], image: [] }); // Initialize with empty arrays to prevent errors

  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await axios.post(
          "https://nominally-picked-grubworm.ngrok-free.app/webhook/scrap-stock-news"
        );
        console.log("News data:", response.data);
        setNews(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
        // Optionally, set news to a default empty state or show an error message
        setNews({ title: [], link: [], image: [] });
      }
    };

    fetchAPI();
  }, []);

  useEffect(() => {
    handleCurrPage("Home");
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [bgHeight, setBgHeight] = useState("100vh");

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBgHeight(`${img.height}px`);
    };
  }, []);

  // completedModules state is not used in the provided JSX, but kept for completeness
  const [completedModules, setCompletedModules] = useState({
    module1: localStorage.getItem("module1_completed") === "true",
    module2: localStorage.getItem("module2_completed") === "true",
    module3: localStorage.getItem("module3_completed") === "true",
  });

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
          zIndex: -1,
        }}
      />
      <div className="mt-5 pt-5 container">
        <div className="d-flex mt-5 pt-5">
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
              Pintar
              <motion.span
                style={{
                  fontSize: "3rem",
                  fontWeight: "700",
                  textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                  background: "linear-gradient(to right, #6F9356, #6F9356)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  position: "relative",
                  paddingBottom: "20px"
                }}
              >
                Saham
              </motion.span>
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
                  marginTop: "100px"
                }}
                initial={{ width: 0 }}
                animate={{ width: "100px" }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </motion.h2>
          </motion.div>
        </div>

        <div className="d-flex flex-row">
          <div className="d-flex flex-column mt-4">
            <p className="text-left text-white fs-4">
              PintarSaham adalah platform edukasi saham interaktif yang dirancang
              untuk<br></br>membantu pengguna memahami investasi dengan mudah.
            </p>
            <p className="text-lef text-white fs-4">
              Kami menyediakan materi edukatif, simulasi trading, dan analisis
              pasar<br></br>untuk membantu pengguna membangun strategi investasi
              yang cerdas
            </p>
          </div>
          <div>
            <Spline
              scene="https://prod.spline.design/vXCLAC8yW6xqZurs/scene.splinecode"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 d-flex flex-column align-items-center">
        <div>
          <h1
            className="pt-5 text-center text-white"
            style={{ fontSize: "60px" }}
          >
            Modul Pembelajaran
          </h1>
          <p
            className="pt-3 text-center text-white"
            style={{ fontSize: "20px" }}
          >
            Modul pembelajaran saham ini dirancang khusus untuk pemula agar
            mudah memahami dasar-dasar investasi dengan cara yang menyenangkan
            dan praktis.<br></br> Melalui pendekatan interaktif dan studi kasus
            nyata, kamu akan belajar menganalisis saham serta mengambil
            keputusan investasi yang cerdas.<br></br>Tak perlu latar belakang
            finansial—cukup rasa ingin tahu dan semangat belajar untuk memulai
            perjalanan investasimu hari ini!
          </p>
        </div>
        <div className="container d-flex justify-content-evenly mt-5">
          <div className="card" style={{ width: "18rem" }}>
            <img src={thumbnail1} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Pengenalan Pasar Saham</h5>
              <p className="card-text">
                Video ini menjelaskan bagaimana produk di sekitar kita berasal dari perusahaan yang sahamnya bisa dibeli.
              </p>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src={thumbnail2} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Cara Membeli Saham</h5>
              <p className="card-text">
                Video ini menjelaskan alur sederhana agar Anda lebih memahami mekanisme jual beli saham.
              </p>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src={thumbnail3} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Pentingya Belajar Investasi Saham Dahulu</h5>
              <p className="card-text">
                Video ini dibuat untuk mendorong Anda belajar lebih dulu sebelum berinvestasi di pasar modal.
              </p>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src={thumbnail4} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Saham dari nol.</h5>
              <p className="card-text">
                Video ini dibuat untuk memperkenalkan saham dari nol.
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center ">
          <Link to="/Modul">
            <button
              type="button"
              className="btn btn-dark mt-5"
              style={{
                padding: "10px 36px",
                borderWidth: "2px",
                borderRadius: "50px",
                color: "#ffff",
                fontSize: "20px",
                borderColor: "#71af58",
              }}
            >
              Pergi Ke Modul
            </button>
          </Link>
        </div>

        ---

        {/* Latest Stock News Section */}
        <div className="mt-5 pt-5 container">
          <div className="mt-3 pt-5">
            <h1 className="text-left text-white" style={{ fontSize: "60px" }}>
              Latest Stock News
            </h1>
            <p className="mt-3 text-left text-white" style={{ fontSize: "20px" }}>
              Stay updated with the latest stock market news and trends that could impact your investments.
              Our curated news feed brings you the most relevant financial updates.
            </p>
          </div>

          {news.title && news.title.length > 0 ? (
            <div id="newsCarousel" className="carousel slide mt-5" data-bs-ride="carousel">
              {/* Indicators */}
              <div className="carousel-indicators">
                {news.title.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    data-bs-target="#newsCarousel"
                    data-bs-slide-to={index}
                    className={index === 0 ? "active" : ""}
                    aria-current={index === 0 ? "true" : "false"}
                  />
                ))}
              </div>

              {/* Carousel items */}
              <div className="carousel-inner" style={{ borderRadius: "15px" }}>
                {news.title.map((title, index) => (
                  <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                    <div className="d-flex justify-content-center">
                      <div className="card" style={{ width: "70%", maxWidth: "800px" }}>
                        <img
                          src={news.image[index] || stonkImage}
                          className="card-img-top"
                          alt={title}
                          style={{ height: '400px', objectFit: 'cover' }}
                        />
                        <div className="card-body">
                          <h5 className="card-title">{title}</h5>
                          <p className="card-text">
                            Klik "Telusuri" Untuk Melihat Berita.
                          </p>
                          <a href={news.link[index]} className="btn btn-success" target="_blank" rel="noopener noreferrer">
                            Telusuri
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <button className="carousel-control-prev" type="button" data-bs-target="#newsCarousel" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button className="carousel-control-next" type="button" data-bs-target="#newsCarousel" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          ) : (
            <p className="text-white text-center w-100">No news available at the moment. Please try again later.</p>
          )}
        </div>
        <Link to="/Berita">
          <button
            type="button"
            className="btn btn-dark mt-5"
            style={{
              padding: "10px 36px",
              borderWidth: "2px",
              borderRadius: "50px",
              color: "#ffff",
              fontSize: "20px",
              borderColor: "#71af58",
            }}
          >
            Pergi Ke Berita
          </button>
        </Link>
      </div>

      ---

      {/* Stock Chart View */}
      <div className="mt-5 pt-5 container">
        <div className="mt-3 pt-5">
          <h1
            className="text-left text-white text-center"
            style={{ fontSize: "60px" }}
          >
            Stock Chart View
          </h1>
          <div className="d-flex justify-content-center mt-5">
            <img
              src={chartImage}
              alt="Stock Chart"
              style={{ borderRadius: "50px", width: "1100px" }}
            />
          </div>
        </div>
        <div>
          <p
            className="mt-5 text-center text-white"
            style={{ fontSize: "20px" }}
          >
            Lihatlah stock chart kami yang interaktif dan mudah dipahami untuk
            membantu Anda mengambil keputusan investasi dengan lebih percaya
            diri. Grafik real-time kami menampilkan tren pasar terkini sehingga
            Anda tidak ketinggalan peluang emas. Mulai pantau dan analisis
            pergerakan saham favorit Anda sekarang juga untuk hasil investasi
            yang maksimal!
          </p>
        </div>
        <div className="d-flex justify-content-center ">
          <Link to="/StockChart">
            <button
              type="button"
              className="btn btn-dark mt-5"
              style={{
                padding: "10px 36px",
                borderWidth: "2px",
                borderRadius: "50px",
                color: "#ffff",
                fontSize: "20px",
                borderColor: "#71af58",
              }}
            >
              Pergi Ke StockChart
            </button>
          </Link>
        </div>
      </div>

      ---

      <div className="d-flex justify-content-evenly mt-5 pt-5 container">
        <div className="d-flex flex-column my-5">
          <h1 className="text-end text-white" style={{ fontSize: "60px" }}>
            Forum Diskusi
          </h1>
          <div className="d-flex flex-row">
            <img src={discussion} className="mx-5" style={{ width: "200px", height: "auto" }} />
            <p className="mt-3 text-end text-white" style={{ fontSize: "20px" }}>
              Gabung sekarang di forum diskusi saham kami <br></br>dan temukan
              berbagai insight dari para investor berpengalaman.<br></br>{" "}
              Diskusikan strategi, berbagi tips, dan dapatkan analisis pasar yang
              up-to-date secara langsung.<br></br> Jangan lewatkan kesempatan
              untuk memperluas jaringan dan <br></br>
              meningkatkan pengetahuan investasi Anda bersama komunitas kami!
            </p>
          </div>
          <div className="align-self-end">
            <Link to="/Forum">
              <button
                type="button"
                className="btn btn-dark mt-5"
                style={{
                  padding: "10px 36px",
                  borderWidth: "2px",
                  borderRadius: "50px",
                  color: "#ffff",
                  fontSize: "20px",
                  borderColor: "#71af58",
                }}
              >
                Pergi Ke Forum
              </button>
            </Link>
          </div>
        </div>
      </div>

      ---

      <div className="mt-5 pt-5 container">
        <h1 className="text-center text-white" style={{ fontSize: "60px" }}>
          Game dan Analisa Saham
        </h1>
        <p className="mt-3 text-white" style={{ fontSize: "20px" }}>
          Gunakan hasil prediksi AI kami sebagai referensi untuk menganalisis
          pergerakan saham dan mengidentifikasi peluang investasi dengan lebih
          cepat dan efisien. Teknologi kami memanfaatkan data historis dan tren
          pasar untuk memberikan gambaran yang lebih luas mengenai potensi arah
          saham ke depan. Namun, perlu diingat bahwa prediksi ini bukan
          merupakan jaminan keuntungan, sehingga keputusan investasi tetap perlu
          disesuaikan dengan pertimbangan pribadi dan risiko masing-masing.
        </p>
        <div className="d-flex justify-content-center mt-5">
          <div style={{ position: "relative", width: "1100px" }}>
            <img
              src={chartImage}
              alt="Blurred Stock Chart"
              style={{
                borderRadius: "50px",
                width: "100%",
                filter: "blur(5px)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                padding: "20px",
                borderRadius: "15px",
                textAlign: "center",
                maxWidth: "80%",
              }}
            >
              <h5 style={{ fontSize: "40px" }}>Disclaimer</h5>
              <p style={{ fontSize: "18px" }}>
                Grafik ini hanya sebagai gambaran umum dari hasil prediksi AI
                dan bukan merupakan saran keuangan. Selalu lakukan analisis
                tambahan sebelum mengambil keputusan investasi.
              </p>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center mb-5 pb-5">
          <Link to="/Produk">
            <button
              type="button"
              className="btn btn-dark mt-5"
              style={{
                padding: "10px 36px",
                borderWidth: "2px",
                borderRadius: "50px",
                color: "#ffff",
                fontSize: "20px",
                borderColor: "#71af58",
              }}
            >
              Pergi Ke Produk
            </button>
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Modul;