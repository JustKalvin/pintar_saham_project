import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import backgroundImage from "../../assets/BackgroundBody.png";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Modules1() {
  const navigate = useNavigate();
  const location = useLocation();

  const [bgHeight, setBgHeight] = useState("100vh");
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [username, setUsername] = useState("");
  const [userModules, setUserModules] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setBgHeight(`${img.height}px`);
    };
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
      getUserModules(storedUsername);
    }
  }, []);

  const getUserModules = async (username) => {
    try {
      const response = await axios.get(`http://localhost:8000/users/${username}`);
      setUserModules(response.data.modules);
    } catch (error) {
      console.error("Error fetching user modules:", error);
      setMessage("Terjadi kesalahan saat memuat modul.");
    }
  };

  const question = {
    text: "Apa yang dimaksud dengan saham?",
    choices: [
      "Surat utang negara",
      "Bukti kepemilikan suatu perusahaan",
      "Tabungan deposito",
      "Instrumen investasi emas",
    ],
    correctAnswer: "Bukti kepemilikan suatu perusahaan",
  };

  const handleAnswer = (answer) => {
    let valid = false
    if(selectedOption) {
      question.choices.forEach((item, index) => {
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
      setIsCorrect(answer === question.correctAnswer);
      question.choices.forEach((item, index) => {
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
    if (userModules.includes("Modul 2")) {
      setMessage("Kamu Sudah Pernah Menjawab Benar. 👍");
      return;
    }
  
    const updatedModules = [...userModules, "Modul 2"];
    
    try {
      await axios.put(`http://localhost:8000/users/${username}/modules`, updatedModules);
      setUserModules(updatedModules);
      setMessage("Modul berhasil ditambahkan.");
      navigate("/Modul");
    } catch (error) {
      console.error("Error updating user modules:", error);
      setMessage("Terjadi kesalahan saat menambahkan modul.");
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: bgHeight,
      position: "relative",
    }}>
      <Navbar />
      <div style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
      }} />
      <div className="container text-white py-5 my-5">
        <div className="d-flex justify-content-center my-4">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/uGzToPCX8nU"
            title="Apa Itu Saham?"
            frameBorder="0"
            allowFullScreen
          ></iframe>
        </div>
        <div className="mt-5 pt-5">
          <button className="btn btn-outline-light d-block mx-auto" onClick={() => setShowQuiz(!showQuiz)}>
            {showQuiz ? "Sembunyikan Quiz" : "Tampilkan Quiz"}
          </button>
          {showQuiz && (
            <div className="mt-4 p-4 bg-transparent rounded">
              <h4 className="text-center">{question.text}</h4>
              <div className="mt-3">
                {question.choices.map((choice, index) => (
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
          )}
        </div>
        <div className="text-center mt-5">
          <button className="btn btn-light" onClick={handleModuleSubmit}>
            Submit
          </button>
          <p className="text-danger h6 mt-4">{message}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Modules1;
