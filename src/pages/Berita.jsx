import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import React, { useState, useEffect, useRef, useContext } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {PageContext} from "../App.jsx"

const News = () => {
  const location = useLocation();
  const scrollRef = useRef(null);
  const [articles, setArticles] = useState([]);
  const [bgHeight, setBgHeight] = useState("100vh");
  const {currPage, handleCurrPage} = useContext(PageContext)

  useEffect(() =>{
    handleCurrPage("Berita")
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch news articles
  useEffect(() => {
    const fetchAPI = async () => {
      try {
        const response = await axios.post(
          "https://nominally-picked-grubworm.ngrok-free.app/webhook/scrapping-saham"
        );
        console.log("News data:", response.data);
        setArticles(response.data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchAPI();
  }, []);

  // Set background height
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBgHeight(`${img.height}px`);
    };
  }, []);

  // Carousel scroll functions
  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" });
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

      <div className="container flex-grow-1">
        <h2 className="text-center my-5 text-white py-5">Tips Memulai Belajar Saham</h2>

        {/* Carousel */}
        <div className="position-relative">
          {articles.length != 0 ? (
            <div>
              <button
                onClick={scrollLeft}
                style={{
                  position: "absolute",
                  left: "-7%", // tambahin margin
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10, // tambahin biar pasti nongol
                  backgroundColor: "#ffffffaa", // warna terang semi transparan
                  border: "none",
                  color: "black", // kontras
                  height : "80px",
                  borderRadius: "50%",
                  fontSize: "50px",
                  cursor: "pointer",
                  width : "75px",
                  // height
                }}
              >
                &lt;
              </button>
              
              <button className="d-flex"
                onClick={scrollRight}
                style={{
                  position: "absolute",
                  right: "-7%",
                  top: "50%",
                  transform: "translateY(-50%)",
                  zIndex: 10,
                  backgroundColor: "#ffffffaa",
                  border: "none",
                  color: "black",
                  // padding: "10px",
                  borderRadius: "50%",
                  fontSize: "50px",
                  cursor: "pointer",
                  width : "75px",
                  height : "80px",
                  display: "flex", // ini penting!
                  justifyContent: "center",
                  alignItems: "start"
                }}
              >
                &gt;
              </button>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}


          <div
            className="d-flex overflow-x-auto"
            ref={scrollRef}
            style={{
              scrollSnapType: "x mandatory",
              scrollBehavior: "smooth",
              gap: "20px",
              paddingBottom: "20px",
            }}
          >
            {articles?.title?.map((title, index) => (
              <div
                className="card"
                key={index}
                style={{
                  minWidth: "300px",
                  flexShrink: "0",
                  scrollSnapAlign: "start",
                  borderRadius: "10px",
                }}
              >
                <img
                  src={articles?.image?.[index]}
                  alt={`Gambar ${index + 1}`}
                  className="card-img-top"
                  style={{
                    objectFit: "cover",
                    height: "200px",
                    borderTopLeftRadius: "10px",
                    borderTopRightRadius: "10px",
                  }}
                />
                <div
                  className="card-body d-flex flex-column justify-content-center align-items-center"
                  style={{
                    backgroundColor: "#395F2E",
                    borderBottomLeftRadius: "10px",
                    borderBottomRightRadius: "10px",
                  }}
                >
                  <h5 className="card-title text-white">{title}</h5>
                  <a
                    href={articles?.link?.[index]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-light mt-auto bg-dark"
                    style={{
                      borderRadius: "20px",
                      width: "200px",
                      color: "white",
                      backgroundImage: "linear-gradient(45deg, #395F2E, black)",
                      padding: "10px 20px",
                      textDecoration: "none",
                    }}
                  >
                    Baca Selengkapnya
                  </a>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default News;
