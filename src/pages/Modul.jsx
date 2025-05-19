import backgroundImage from "../assets/BackgroundBody.png";
import stonk2 from "../assets/stonk2.jpg";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {PageContext} from "../App.jsx"

const Modul = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userModules, setUserModules] = useState([]);
  const [modules, setModules] = useState([]);
  const [isModuleClicked, setIsModuleClicked] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [message, setMessage] = useState("");
  const username = localStorage.getItem("username");
  const [idClicked, setIdClicked] = useState(null)
  const [selectedModules, setSelectedModules] = useState([])
  const [selectedOption, setSelectedOption] = useState(null);
  const {currPage, handleCurrPage} = useContext(PageContext)

  useEffect(() =>{
    handleCurrPage("Modul")
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const [bgHeight, setBgHeight] = useState("100vh");
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBgHeight(`${img.height}px`); // Set tinggi sesuai gambar
    };
  }, []);

  useEffect(() => {
    if (username) {
      axios.get(`http://localhost:8000/users/${username}`)
        .then(response => {
          setUserModules(response.data.modules || []);
        })
        .catch(error => {
          console.error("Error fetching user modules:", error);
        });
    }
  }, [username]);

  // const modules = [
  //   {
  //     id: 1,
  //     title: "Pengenalan Pasar Saham",
  //     description: "Pelajari dasar-dasar pasar saham dan bagaimana cara kerjanya.",
  //     videoPage: "/Modules1",
  //     thumbnail: stonk2,
  //   },
  //   {
  //     id: 2,
  //     title: "Analisis Teknikal Saham",
  //     description: "Memahami cara membaca grafik dan indikator teknikal.",
  //     videoPage: "/Modules2",
  //     thumbnail: stonk2,
  //   },
  //   {
  //     id: 3,
  //     title: "Strategi Investasi Jangka Panjang",
  //     description: "Pelajari strategi untuk investasi saham jangka panjang.",
  //     videoPage: "/Modules3",
  //     thumbnail: stonk2,
  //   },
  // ];
  useEffect(() => {
    const handleModules = async () => {
      try{
        const response = await axios.get("http://127.0.0.1:8000/modules")
        setModules(modules => (response.data))
        console.log(response.data)
      }
      catch(error) {
        console.log("Error when getting modules!")
      }
    }
    handleModules()
  }, [])

  const handleIsModuleClicked = (id) => {
    setIsModuleClicked(isModuleClicked => (!isModuleClicked))
    setIdClicked(idClicked => (id))
    const temp_module = modules.filter((item, index) => (index + 1) === id)
    setSelectedModules(selectedModules => (temp_module[0]))
    console.log("nih")
    console.log(temp_module[0])
  }

  const handleAnswer = (answer) => {
    let valid = false
    if(selectedOption) {
      selectedModules.option.forEach((item, index) => {
        if(answer === item) {
          if(selectedOption === index + 1) {
            valid = true
          }
        }
      })
    }
    if(valid) {
      setSelectedAnswer(null)
      setSelectedOption(null)
      setIsCorrect(null)
    }
    else {
      setSelectedAnswer(answer);
      setIsCorrect(answer === selectedModules.correctAnswer);
      selectedModules.option.forEach((item, index) => {
        if(answer === item) {
          setSelectedOption(index + 1)
        }
      })
    }
  };

  const handleModuleSubmit = async () => {
    if (!selectedAnswer) {
      setMessage("Silakan pilih jawaban terlebih dahulu!");
      return;
    }
    if (!isCorrect) {
      setMessage("Jawaban masih salah. Silakan coba lagi!");
      return;
    }
    if (!username) {
      setMessage("Username tidak ditemukan.");
      return;
    }
  
    // Cek apakah "Modul 1" sudah ada di userModules
    if (userModules.includes(`Modul ${selectedModules.id}`)) {
      setMessage("Kamu Sudah Pernah Menjawab Benar. 👍");
      return;
    }
  
    const updatedModules = [...userModules, `Modul ${selectedModules.id}`];
    
    try {
      await axios.put(`http://localhost:8000/users/${username}/modules`, updatedModules);
      setUserModules(updatedModules);
      setMessage("Modul berhasil ditambahkan.");
      navigate("/Modul");
    } catch (error) {
      console.error("Error updating user modules:", error);
      setMessage("Terjadi kesalahan saat menambahkan modul.");
    }
    setIsModuleClicked(isModuleClicked => (false))
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
      <div className="flex-grow-1 my-5 py-5">
        <h2 className="text-center my-5 text-white">Modul Pembelajaran Saham</h2>

        <div className="container">
          {!isModuleClicked ? (
            <div className="row justify-content-center">
              {modules.map((modul) => {
                const isCompleted = userModules.some(m => m === `Modul ${modul.id}`);
                return (
                  <div className="col-3 d-flex justify-content-center my-3" key={modul.id}>
                    <div 
                      className="card shadow-sm mb-4"
                      style={{ width: "18rem", cursor: "pointer" }}
                      onClick={() => handleIsModuleClicked(Number(modul.id))}
                    >
                      {/* <p>testtt</p> */}
                      <img src={modul.thumbnail} className="card-img-top" />
                      <div className="card-body">
                        <h5 className="card-title">{modul.title}</h5>
                        <p className="card-text">
                          {modul.description} {isCompleted ? "✅" : "❌"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="container text-white pt-5">
              <div className="d-flex justify-content-center pt-5">
                <iframe
                  width="560"
                  height="315"
                  src= {`https://www.youtube.com/embed/${selectedModules.link}`}
                  title={selectedModules.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="mt-5 pt-5">
                <button className="btn btn-outline-light d-block mx-auto" onClick={() => setShowQuiz(!showQuiz)}>
                  {showQuiz ? "Sembunyikan Quiz" : "Tampilkan Quiz"}
                </button>
                {showQuiz ? (
                  <div className="mt-4 p-4 bg-transparent rounded">
                    <h4 className="text-center">{selectedModules.question}</h4>
                    <div className="mt-3">
                      {selectedModules.option.map((choice, index) => (
                        <button
                          key={index}
                          className={`btn btn-outline-light d-block w-100 my-2 ${selectedAnswer === choice ? (isCorrect ? "btn-success" : "btn-danger") : ""}`}
                          onClick={() => handleAnswer(choice)}
                        >
                          {choice}
                        </button>
                      ))}
                    </div>
                    {selectedAnswer && (
                      <p className="mt-3 text-center">
                        {isCorrect ? "✅ Jawaban benar!" : "❌ Jawaban salah, coba lagi!"}
                      </p>
                    )}
                  </div>
                ) : (null)}
                  
              </div>
              <div className="text-center mt-5">
                <button className="btn btn-light" onClick={() => handleModuleSubmit()}>
                  Submit
                </button>
                <p className="text-danger h6 mt-4">{message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Modul;
