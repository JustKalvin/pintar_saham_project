import backgroundImage from "../assets/BackgroundBody.png";
import stonk2 from "../assets/stonk2.jpg";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import { PageContext } from "../App.jsx";
import stonkImage from "../assets/stonk3.jpg";
import chartImage from "../assets/chart.png";

const Modul = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currPage, handleCurrPage } = useContext(PageContext);

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
          <h1 className="text-left text-white" style={{ fontSize: "60px" }}>
            Pintar
          </h1>
          <h1
            className="text-left"
            style={{ color: "#748a64", fontSize: "60px" }}
          >
            Saham
          </h1>
        </div>

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

        <button
          type="button"
          className="btn btn-dark mt-5"
          style={{
            padding: "10px 36px", // padding (top-bottom: 10px, left-right: 30px)
            borderWidth: "2px", // thicker outline
            borderRadius: "50px", // rounded corners     // custom green border
            color: "#ffff", // text color
            fontSize: "20px",
            borderColor: "#71af58",
            //backgroundColor: "#1b1b1b"
          }}
        >
          Learn More
        </button>
      </div>

      <div className="mt-5 ">
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
            <img src={stonkImage} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Learn more
              </a>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src={stonkImage} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Learn more
              </a>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src={stonkImage} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Learn more
              </a>
            </div>
          </div>
          <div className="card" style={{ width: "18rem" }}>
            <img src={stonkImage} className="card-img-top" alt="Sample" />
            <div className="card-body">
              <h5 className="card-title">Card Title</h5>
              <p className="card-text">
                Some quick example text to build on the card title and make up
                the bulk of the card's content.
              </p>
              <a href="#" className="btn btn-primary">
                Learn more
              </a>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-center ">
          <button
            type="button"
            className="btn btn-dark mt-5"
            style={{
              padding: "10px 36px", // padding (top-bottom: 10px, left-right: 30px)
              borderWidth: "2px", // thicker outline
              borderRadius: "50px", // rounded corners     // custom green border
              color: "#ffff", // text color
              fontSize: "20px",
              borderColor: "#71af58",
              //backgroundColor: "#1b1b1b"
            }}
          >
            Learn More
          </button>
        </div>

        {/* Berita Saham */}
        <div className="mt-5 pt-5 container">
          <div className="mt-3 pt-5">
            <h1 className="text-left text-white" style={{ fontSize: "60px" }}>
              Berita Saham
            </h1>
            <p
              className="mt-3 text-left text-white"
              style={{ fontSize: "20px" }}
            >
              Berita saham terbaru menghadirkan informasi penting tentang
              peluang investasi yang sedang naik daun dan pergerakan pasar yang
              cepat berubah. Dapatkan update real-time tentang saham-saham
              unggulan, analisis mendalam dari para ahli, serta tips strategi
              yang bisa meningkatkan keuntungan Anda. Jangan lewatkan kesempatan
              emas untuk memantau tren pasar dan membuat keputusan investasi
              yang tepat hanya di website kami!
            </p>
          </div>

          <div>
            <div
              id="carouselExample"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <div className="container d-flex justify-content-evenly mt-5">
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src={stonkImage}
                        className="card-img-top"
                        alt="Sample"
                      />
                      <div className="card-body">
                        <h5 className="card-title">Harga Antam Naik</h5>
                        <p className="card-text">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit.
                        </p>
                        <a href="#" className="btn btn-primary">
                          Learn more
                        </a>
                      </div>
                    </div>
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src={stonkImage}
                        className="card-img-top"
                        alt="Sample"
                      />
                      <div className="card-body">
                        <h5 className="card-title">Card Title</h5>
                        <p className="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                        <a href="#" className="btn btn-primary">
                          Learn more
                        </a>
                      </div>
                    </div>
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src={stonkImage}
                        className="card-img-top"
                        alt="Sample"
                      />
                      <div className="card-body">
                        <h5 className="card-title">Card Title</h5>
                        <p className="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                        <a href="#" className="btn btn-primary">
                          Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="carousel-item">
                  <div className="container d-flex justify-content-evenly mt-5">
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src={stonkImage}
                        className="card-img-top"
                        alt="Sample"
                      />
                      <div className="card-body">
                        <h5 className="card-title">Card Title</h5>
                        <p className="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                        <a href="#" className="btn btn-primary">
                          Learn more
                        </a>
                      </div>
                    </div>
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src={stonkImage}
                        className="card-img-top"
                        alt="Sample"
                      />
                      <div className="card-body">
                        <h5 className="card-title">Card Title</h5>
                        <p className="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                        <a href="#" className="btn btn-primary">
                          Learn more
                        </a>
                      </div>
                    </div>
                    <div className="card" style={{ width: "18rem" }}>
                      <img
                        src={stonkImage}
                        className="card-img-top"
                        alt="Sample"
                      />
                      <div className="card-body">
                        <h5 className="card-title">Harga Batu Bara Turun</h5>
                        <p className="card-text">
                          Some quick example text to build on the card title and
                          make up the bulk of the card's content.
                        </p>
                        <a href="#" className="btn btn-primary">
                          Learn more
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev pe-5"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                  style={{
                    width: "56px",
                    height: "78px",
                    objectFit: "cover",
                  }}
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next ps-5"
                type="button"
                data-bs-target="#carouselExample"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                  style={{
                    width: "56px",
                    height: "78px",
                    objectFit: "cover",
                  }}
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
          </div>
        </div>
      </div>

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
              alt=""
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
          <button
            type="button"
            className="btn btn-dark mt-2"
            style={{
              padding: "10px 36px", // padding (top-bottom: 10px, left-right: 30px)
              borderWidth: "2px", // thicker outline
              borderRadius: "50px", // rounded corners     // custom green border
              color: "#ffff", // text color
              fontSize: "20px",
              borderColor: "#71af58",
              //backgroundColor: "#1b1b1b"
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      <div className="d-flex justify-content-evenly mt-5 pt-5 container">
        {/* kotak paling luar */}
        <div className="d-flex-column">
          {/* kotak kiri kecil */}
          <div className="d-flex mb-3">
            <div className="card me-3" style={{ width: "18rem" }}>
              <img src={stonkImage} className="card-img-top" alt="Sample" />
              <div className="card-body">
                <h5 className="card-title">Harga Batu Bara Turun</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Learn more
                </a>
              </div>
            </div>
            <div className="card" style={{ width: "18rem" }}>
              <img src={stonkImage} className="card-img-top" alt="Sample" />
              <div className="card-body">
                <h5 className="card-title">Harga Batu Bara Turun</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Learn more
                </a>
              </div>
            </div>
          </div>

          {/* Kotak kanan kecil */}
          <div className="d-flex">
            <div className="card me-3" style={{ width: "18rem" }}>
              <img src={stonkImage} className="card-img-top" alt="Sample" />
              <div className="card-body">
                <h5 className="card-title">Harga Batu Bara Turun</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Learn more
                </a>
              </div>
            </div>
            <div className="card" style={{ width: "18rem" }}>
              <img src={stonkImage} className="card-img-top" alt="Sample" />
              <div className="card-body">
                <h5 className="card-title">Harga Batu Bara Turun</h5>
                <p className="card-text">
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </p>
                <a href="#" className="btn btn-primary">
                  Learn more
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex flex-column my-5">
          <h1 className="text-end text-white" style={{ fontSize: "60px" }}>
            Forum Diskusi
          </h1>
          <p className="mt-3 text-end text-white" style={{ fontSize: "20px" }}>
            Gabung sekarang di forum diskusi saham kami <br></br>dan temukan
            berbagai insight dari para investor berpengalaman.<br></br>{" "}
            Diskusikan strategi, berbagi tips, dan dapatkan analisis pasar yang
            up-to-date secara langsung.<br></br> Jangan lewatkan kesempatan
            untuk memperluas jaringan dan <br></br>
            meningkatkan pengetahuan investasi Anda bersama komunitas kami!
          </p>
          <div className="align-self-end">
            <button
              type="button"
              className="btn btn-dark mt-2"
              style={{
                padding: "10px 36px", // padding (top-bottom: 10px, left-right: 30px)
                borderWidth: "2px", // thicker outline
                borderRadius: "50px", // rounded corners     // custom green border
                color: "#ffff", // text color
                fontSize: "20px",
                borderColor: "#71af58",
                //backgroundColor: "#1b1b1b"
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

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
              alt=""
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
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="mt-5 mb-5 btn btn-dark mt-2"
            style={{
              padding: "10px 36px", // padding (top-bottom: 10px, left-right: 30px)
              borderWidth: "2px", // thicker outline
              borderRadius: "50px", // rounded corners     // custom green border
              color: "#ffff", // text color
              fontSize: "20px",
              borderColor: "#71af58",
              //backgroundColor: "#1b1b1b"
            }}
          >
            Learn More
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Modul;
