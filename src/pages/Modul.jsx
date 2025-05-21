import backgroundImage from "../assets/BackgroundBody.png";
import stonk2 from "../assets/stonk2.jpg";
import React, { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { PageContext } from "../App.jsx";
import styled, { keyframes } from 'styled-components';
import { motion } from "framer-motion";
import LockedImage from "../assets/Locked.jpg"

// Keyframes for border animation
const glowingBorder = keyframes`
  0% { border-color: rgba(255, 255, 255, 0.5); box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); }
  50% { border-color: #00ff00; box-shadow: 0 0 20px rgba(0, 255, 0, 0.7); }
  100% { border-color: rgba(255, 255, 255, 0.5); box-shadow: 0 0 5px rgba(0, 0, 0, 0.3); }
`;

// Styled components for 3D card with border animation
const ModuleCard = styled.div`
  width: 18rem;
  cursor: pointer;
  perspective: 1000px;
  margin-bottom: 1rem;
  transform-style: preserve-3d;
  transition: all 0.5s ease-in-out;
  border-radius: 10px;

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.5s;
    border: 1px solid rgba(255, 255, 255, 0.5);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    background: #ffffff;
    border-radius: 10px;
    overflow: hidden;
  }

  &:hover {
    .card-inner {
      transform: rotate3d(0.5, 1, 0, 15deg);
      background-position: -30px 30px, -30px 30px;
      animation: ${glowingBorder} 2s linear infinite;
    }

    .card-title, .card-text {
      transform: translateZ(20px);
    }
  }

  .card-img-top {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  }

  .card-body {
    padding: 1.5rem;
    transform-style: preserve-3d;
  }

  .card-title {
    color: black;
    font-weight: bold;
    transition: transform 0.5s;
    transform: translateZ(10px);
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  }

  .card-text {
    color: rgba(0, 0, 0, 0.8);
    transition: transform 0.5s;
    transform: translateZ(5px);
  }

  .completion-marker {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 1.5rem;
    transform: translateZ(15px);
    text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    color: green;
  }
`;

// Styled components for the chatbot interface
const ChatbotContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1); /* Slightly transparent background */
  border-radius: 15px;
  padding: 2rem;
  margin-top: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px); /* Frosted glass effect */
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const ChatMessage = styled(motion.div)`
  background: ${props => props.isUser ? '#007bff' : '#6c757d'};
  color: white;
  padding: 0.8rem 1.2rem;
  border-radius: ${props => props.isUser ? '15px 15px 0 15px' : '15px 15px 15px 0'};
  margin-bottom: 1rem;
  max-width: 80%;
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const ChatInputContainer = styled.div`
  display: flex;
  margin-top: 1.5rem;
  gap: 10px;
`;

const ChatInput = styled.input`
  flex-grow: 1;
  padding: 0.8rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const SendButton = styled.button`
  background-color: #28a745; /* Green for send */
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.8rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #218838;
  }
`;

const ChatMessagesWrapper = styled.div`
  max-height: 300px; /* Limit height for scrollability */
  overflow-y: auto;
  padding-right: 10px; /* For scrollbar */
  display: flex;
  flex-direction: column;
`;

const LockedContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  margin: 2rem 0;
  perspective: 1000px;
`;

const LockedImageWrapper = styled(motion.div)`
  width: 50%;
  height: auto;
  position: relative;
  cursor: pointer;
  transform-style: preserve-3d;
`;

const LockedText = styled(motion.p)`
  font-size: 1.2rem;
  margin-top: 1.5rem;
  text-align: center;
  background: linear-gradient(90deg, #ff0000, #ff8c00, #ff0000);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${props => props.animate ? 'shine 2s linear infinite' : 'none'};
  
  @keyframes shine {
    to {
      background-position: 200% center;
    }
  }
`;

const LockShine = styled.div`
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  animation: shine 3s infinite;
  
  @keyframes shine {
    100% {
      left: 100%;
    }
  }
`;



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
  const [idClicked, setIdClicked] = useState(null);
  const [selectedModules, setSelectedModules] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const { currPage, handleCurrPage } = useContext(PageContext);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]); // To store chat messages
  const [selectedModuleId, setSelectedModuleId] = useState([""])

  useEffect(() => {
    handleCurrPage("Modul");
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

  useEffect(() => {
    const handleModules = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/modules");
        setModules(response.data);
      } catch (error) {
        console.log("Error when getting modules!");
      }
    };
    handleModules();
  }, []);

  const handleIsModuleClicked = (id) => {
    setSelectedModuleId("Modul " + String(id))
    setIsModuleClicked(true);
    setIdClicked(id);
    const temp_module = modules.filter((item, index) => (index + 1) === id);
    setSelectedModules(temp_module[0]);
    setChatHistory([]); // Clear chat history when a new module is selected
    setQuestion(""); // Clear question input
  };

  const handleAnswer = (answer) => {
    let valid = false;
    if (selectedOption) {
      selectedModules.option.forEach((item, index) => {
        if (answer === item) {
          if (selectedOption === index + 1) {
            valid = true;
          }
        }
      });
    }
    if (valid) {
      setSelectedAnswer(null);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setSelectedAnswer(answer);
      setIsCorrect(answer === selectedModules.correctAnswer);
      selectedModules.option.forEach((item, index) => {
        if (answer === item) {
          setSelectedOption(index + 1);
        }
      });
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

    if (userModules.includes(`Modul ${selectedModules.id}`)) {
      setMessage("Kamu Sudah Pernah Menjawab Benar. 👍");
      return;
    }

    const updatedModules = [...userModules, `Modul ${selectedModules.id}`];

    try {
      await axios.put(`http://localhost:8000/users/${username}/modules`, updatedModules);
      setUserModules(updatedModules);
      setMessage("Modul berhasil ditambahkan.");
      navigate("/Modul"); // Consider whether to navigate back or just show success
    } catch (error) {
      console.error("Error updating user modules:", error);
      setMessage("Terjadi kesalahan saat menambahkan modul.");
    }
    setIsModuleClicked(false);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSendQuestion = async (modulId) => {
    if (!question.trim()) return; // Don't send empty questions

    const newUserMessage = { text: question, isUser: true };
    setChatHistory(prev => [...prev, newUserMessage]);
    setQuestion(""); // Clear input field

    try {
      const response = await axios.post("https://nominally-picked-grubworm.ngrok-free.app/webhook-test/modul", {
        id: modulId,
        question: question
      });
      const botAnswer = response.data.message.content.answer;
      const newBotMessage = { text: botAnswer, isUser: false };
      setChatHistory(prev => [...prev, newBotMessage]);
    } catch (error) {
      console.error("Error sending question to chatbot:", error);
      const errorMessage = { text: "Maaf, terjadi kesalahan saat menghubungi chatbot.", isUser: false };
      setChatHistory(prev => [...prev, errorMessage]);
    }
  };

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
            Modul Pembelajaran Saham
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

        <div className="container">
          {!isModuleClicked ? (
            <div className="row justify-content-center">
              {modules.map((modul) => {
                const isCompleted = userModules.some(m => m === `Modul ${modul.id}`);
                return (
                  <div className="col-3 d-flex justify-content-center my-3" key={modul.id}>
                    <ModuleCard onClick={() => handleIsModuleClicked(Number(modul.id))}>
                      <div className="card-inner">
                        <img src={modul.thumbnail} className="card-img-top" alt={modul.title} />
                        <div className="card-body">
                          {isCompleted && <span className="completion-marker">✅</span>}
                          <h5 className="card-title text-dark">{modul.title}</h5>
                          <p className="card-text text-dark pt-3">
                            {modul.description}
                          </p>
                        </div>
                      </div>
                    </ModuleCard>
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
                  src={`http://www.youtube.com/embed/${selectedModules.link}`}
                  title={selectedModules.title}
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
                    <h4 className="text-center">{selectedModules.question}</h4>
                    <div className="mt-3">
                      {selectedModules.option.map((choice, index) => (
                        <div key={index}>
                          <button
                            className={`btn btn-outline-light d-block w-100 my-2 ${selectedAnswer === choice ? (isCorrect ? "btn-success" : "btn-danger") : ""}`}
                            onClick={() => handleAnswer(choice)}
                          >
                            {choice}
                          </button>
                        </div>
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
                <button className="btn btn-light" onClick={() => handleModuleSubmit()}>
                  Submit
                </button>
                <p className="text-danger h6 mt-4">{message}</p>
              </div>

              {isCorrect || userModules.includes(selectedModuleId) ? (
                <ChatbotContainer
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h4 className="text-center text-white mb-4">Tanya Bot Modul Ini</h4>
                <ChatMessagesWrapper>
                  {chatHistory.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      isUser={msg.isUser}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      {msg.text}
                    </ChatMessage>
                  ))}
                </ChatMessagesWrapper>
                <ChatInputContainer>
                  <ChatInput
                    type="text"
                    placeholder="Ketik pertanyaan Anda di sini..."
                    value={question}
                    onChange={handleQuestionChange}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSendQuestion(selectedModules.id);
                      }
                    }}
                  />
                  <SendButton onClick={() => handleSendQuestion(selectedModules.id)}>
                    Kirim
                  </SendButton>
                </ChatInputContainer>
              </ChatbotContainer>
              ) : (
                <LockedContainer
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <LockedImageWrapper
                    whileHover={{ scale: 1.05, rotateY: 10 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      y: {
                        repeat: Infinity,
                        duration: 2,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <img
                      src={LockedImage}
                      alt="Locked"
                      style={{ width: "100%", height: "auto" }}
                    />
                    
                  </LockedImageWrapper>
                  <LockedText
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    Jawab QUIZ Untuk Membuka Bot
                  </LockedText>
                </LockedContainer>
              )}
              {/* Chatbot Section */}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Modul;