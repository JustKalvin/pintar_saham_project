import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Search from "../assets/Search.png";
import { PageContext } from "../App.jsx";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const location = useLocation();
  const [forum, setForum] = useState([]);
  const [text, setText] = useState("");
  const [isSended, setIsSended] = useState(false);
  const [replying, setReplying] = useState({});
  const [isFocused, setIsFocused] = useState(false);
  const [isPost, setIsPost] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [tempForum, setTempForum] = useState([]);
  const [mostLikedButton, setMostLikedButton] = useState(false);
  const [mostDislikedButton, setMostDislikedButton] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [showingReply, setShowingReply] = useState({});
  const { currPage, handleCurrPage } = useContext(PageContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    handleCurrPage("Forum");
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
    const fetchingAPI = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/get-forum");
        setForum(response.data.forum);
        setTempForum(response.data.forum);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching forum:", error);
        setIsLoading(false);
      }
    };
    fetchingAPI();
  }, []);

  useEffect(() => {
    if (isSended) {
      const fetchingAPI = async () => {
        const response = await axios.get("http://127.0.0.1:8000/get-forum");
        setForum(response.data.forum);
        setTempForum(response.data.forum);
        setIsSended(false);
      };
      fetchingAPI();
    }
  }, [isSended]);

  const handleText = (event) => {
    setText(event.target.value);
  };

  async function classifyAndPost() {
    if (!text.trim()) return;
    
    setIsLoading(true);
    const apiKey = "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";
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    
    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { 
          role: "system", 
          content: "Anda adalah AI yang mengklasifikasikan thread/komen ke dalam kategori 'Positif' atau 'Negatif'. Jawaban hanya 'Positif' atau 'Negatif'." 
        },
        { 
          role: "user", 
          content: `Classify the following review: "${text}"` 
        }
      ],
      temperature: 0.5
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) throw new Error("Gagal mendapatkan respons dari server");

      const result = await response.json();
      const sentiment = result.choices[0]?.message?.content?.trim();
      let sentimentEmoji = sentiment.includes("Positif") ? "Positif 🙂" : "Negatif ☹️";

      await axios.post("http://127.0.0.1:8000/post-forum", {
        text: text,
        user: localStorage.getItem("username"),
        sentiment: sentimentEmoji
      });

      setIsSended(true);
      setText("");
      setIsPost(false);
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpVote = async (username, id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/add-user-liked-forums/${username}/${id}`,
        { forum_id: id }
      );
      setIsSended(true);
    } catch (error) {
      console.error("Error upvoting forum:", error);
    }
  };

  const handleDownVote = async (username, id) => {
    try {
      await axios.post(
        `http://127.0.0.1:8000/add-user-disliked-forums/${username}/${id}`,
        { forum_id: id }
      );
      setIsSended(true);
    } catch (error) {
      console.error("Error downvoting forum:", error);
    }
  };

  const handleReplying = (id) => {
    setReplying(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleShowingReply = (id) => {
    setShowingReply(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleIsPost = () => {
    setIsPost(!isPost);
  };

  const handleReplyText = (event) => {
    setReplyText(event.target.value);
  };

  const handleAddReplyForum = async (id, user, theReplyText) => {
    if (!theReplyText.trim()) return;
    
    try {
      await axios.post(`http://127.0.0.1:8000/add-reply-forum/${id}`, {
        user: user,
        text: theReplyText
      });
      setIsSended(true);
      setReplyText("");
      setReplying(prev => ({ ...prev, [id]: false }));
    } catch (error) {
      console.log("Error when adding reply:", error);
    }
  };

  const handleSortMostLiked = () => {
    setSearchFilter("");
    if (mostLikedButton) {
      setTempForum(forum);
      setMostLikedButton(false);
      setMostDislikedButton(false);
      return;
    }
    setMostLikedButton(true);
    setMostDislikedButton(false);
    const sortedForum = [...forum].sort((a, b) => b.upVoteCount - a.upVoteCount);
    setTempForum(sortedForum);
  };

  const handleSortMostDisliked = () => {
    setSearchFilter("");
    if (mostDislikedButton) {
      setTempForum(forum);
      setMostLikedButton(false);
      setMostDislikedButton(false);
      return;
    }
    setMostDislikedButton(true);
    setMostLikedButton(false);
    const sortedForum = [...forum].sort((a, b) => b.downVoteCount - a.downVoteCount);
    setTempForum(sortedForum);
  };

  const handleSearchFilter = (event) => {
    setSearchFilter(event.target.value);
  };

  const handleSortBySearchFilter = () => {
    if (!searchFilter.trim()) {
      setTempForum(forum);
      return;
    }
    
    setMostLikedButton(false);
    setMostDislikedButton(false);
    const filtered_forum = forum.filter(item => 
      item.text.toLowerCase().includes(searchFilter.toLowerCase())
    );
    setTempForum(filtered_forum);
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  const replyVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: { duration: 0.3 }
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
          zIndex: -1,
        }}
      />

      <div className="container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="my-5 py-5"
        style={{textAlign : "left", transform: "translateX(-50%)",}}
      >
        <div className="d-flex flex-column ">
          <motion.h2
            style={{
              fontSize: "3rem",
              fontWeight: "700",
              textShadow: "0 2px 10px rgba(0,0,0,0.3)",
              background: "linear-gradient(to right, #fff, #ddd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              paddingBottom: "40px"
            }}
          >
            Buat Utas Dan Diskusikan<br />Dengan Pengguna Lain
          </motion.h2>

          <motion.div 
            style={{
              bottom: "0px",
              left: "0", // rata kiri
              height: "4px",
              width: "100px",
              background: "linear-gradient(to right, #d9d9d9, #848484)", 
              borderRadius: "2px",
              transform : "translateX(200px)"
            }}
            initial={{ width: 0 }}
            animate={{ width: "100px" }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>
      </motion.div>


        <div className="d-flex flex-row align-items-center mb-4">
          <motion.button 
            onClick={handleIsPost}
            className="text-white ms-3"
            style={{
              backgroundColor: "transparent",
              borderRadius: "20px",
              borderColor: "#527942",
              borderStyle: "solid",
              borderWidth: "3px",
              padding: "8px 20px"
            }}
            whileHover={{ 
              backgroundColor: "#527942",
              scale: 1.05
            }}
            whileTap={{ scale: 0.95 }}
          >
            + Buat Utas
          </motion.button>
          
          <div className="d-flex justify-content-end flex-grow-1">
            <div className="d-flex flex-column" style={{ maxWidth: "600px", width: "100%" }}>
              <div className="input-group">
                <input 
                  onChange={handleSearchFilter}
                  value={searchFilter}
                  type="text"
                  className="form-control"
                  placeholder="Cari utas..."
                  style={{
                    borderRadius: "10px 0 0 10px",
                    borderRight: "none"
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSortBySearchFilter()}
                />
                <button 
                  onClick={handleSortBySearchFilter}
                  className="btn btn-success"
                  style={{
                    borderRadius: "0 10px 10px 0",
                    borderLeft: "none"
                  }}
                >
                  <img src={Search} alt="Search" style={{ width: "20px", height: "20px" }} />
                </button>
              </div>
              
              <div className="d-flex gap-2 mt-2">
                <motion.button
                  onClick={handleSortMostLiked}
                  className={`btn ${mostLikedButton ? "btn-success" : "btn-outline-success"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Paling Disukai
                </motion.button>
                <motion.button
                  onClick={handleSortMostDisliked}
                  className={`btn ${mostDislikedButton ? "btn-success" : "btn-outline-success"}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Paling Tidak Disukai
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isPost && (
            <motion.div
              className="d-flex align-items-center ms-3 mb-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <input
                onChange={handleText}
                value={text}
                type="text"
                className="form-control me-2"
                placeholder="Tulis sesuatu..."
                style={{
                  maxWidth: "400px",
                  borderRadius: "10px",
                  outline: "none",
                  boxShadow: isFocused ? "0 0 8px 2px rgba(0, 128, 0, 0.7)" : "none",
                  border: isFocused ? "1px solid #28a745" : "1px solid #ced4da"
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
              <motion.button 
                onClick={classifyAndPost} 
                className="btn btn-success px-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  "Kirim"
                )}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Konten Utama */}
        <div className="py-4">
          {isLoading ? (
            <div className="d-flex justify-content-center my-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : tempForum.length === 0 ? (
            <motion.div 
              className="text-center text-white my-5 py-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <h3>Tidak ada utas ditemukan</h3>
              <p>Jadilah yang pertama membuat utas!</p>
            </motion.div>
          ) : (
            <div className="row justify-content-center">
              {tempForum.map((item) => (
                <motion.div 
                  key={item.id} 
                  className="col-12 col-lg-8 mb-4"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                >
                  <div className="card text-white shadow-lg" style={{
                    backgroundColor: "#395F2E", 
                    borderRadius: "15px",
                    border: "none",
                    overflow: "hidden",
                    transition: "transform 0.3s, box-shadow 0.3s"
                  }}>
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}>
                          <span className="fw-bold">{item.user.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <h5 className="card-title mb-0">{item.user}</h5>
                          <small className="text-light">
                            {new Date(item.created_at).toLocaleDateString('id-ID', {
                              weekday: 'long',
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </small>
                        </div>
                      </div>
                      
                      <div className="my-3">
                        <p className="card-text">{item.text}</p>
                        {item.sentiment && (
                          <span className="badge bg-light text-dark">
                            {item.sentiment}
                          </span>
                        )}
                      </div>
                      
                      <div className="d-flex justify-content-between align-items-center mt-3">
                        <motion.button 
                          onClick={() => handleReplying(item.id)}
                          className="btn btn-sm btn-outline-light"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {replying[item.id] ? "Batal" : "Balas"}
                        </motion.button>
                        
                        <div className="d-flex align-items-center">
                          <motion.button 
                            onClick={() => handleUpVote(localStorage.getItem("username"), item.id)}
                            className="btn btn-sm btn-success mx-1 d-flex align-items-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="me-1">👍</span> 
                            <span>{item.upVoteCount}</span>
                          </motion.button>
                          <motion.button 
                            onClick={() => handleDownVote(localStorage.getItem("username"), item.id)}
                            className="btn btn-sm btn-danger mx-1 d-flex align-items-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="me-1">👎</span> 
                            <span>{item.downVoteCount}</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {replying[item.id] && (
                        <motion.div
                          className="p-3"
                          style={{ backgroundColor: "#2C4A23" }}
                          variants={replyVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          <div className="d-flex">
                            <input
                              onChange={handleReplyText}
                              value={replyText}
                              type="text"
                              className="form-control me-2"
                              placeholder="Tulis balasan..."
                              style={{
                                borderRadius: "10px",
                                outline: "none",
                                boxShadow: isFocused ? "0 0 8px 2px rgba(0, 128, 0, 0.7)" : "none",
                                border: isFocused ? "1px solid #28a745" : "1px solid #ced4da"
                              }}
                              onFocus={() => setIsFocused(true)}
                              onBlur={() => setIsFocused(false)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddReplyForum(item.id, localStorage.getItem("username"), replyText)}
                            />
                            <motion.button 
                              onClick={() => handleAddReplyForum(item.id, localStorage.getItem("username"), replyText)}
                              className="btn btn-light"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={!replyText.trim()}
                            >
                              Kirim
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {item.replies.length > 0 && (
                      <div className="px-3 pb-3">
                        <motion.button 
                          onClick={() => handleShowingReply(item.id)}
                          className="btn btn-sm btn-outline-light w-100"
                          whileHover={{ scale: 1.02 }}
                        >
                          {showingReply[item.id] ? "Sembunyikan Balasan" : `Tampilkan Balasan (${item.replies.length})`}
                        </motion.button>
                        
                        <AnimatePresence>
                          {showingReply[item.id] && (
                            <motion.div
                              className="mt-2"
                              variants={replyVariants}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                            >
                              {item.replies.map((reply, index) => (
                                <motion.div 
                                  key={index}
                                  className="d-flex align-items-start my-2 p-3 rounded"
                                  style={{ backgroundColor: "#2C4A23" }}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.1 }}
                                >
                                  <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3"
                                    style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                                    <span className="fw-bold">{reply.user.charAt(0).toUpperCase()}</span>
                                  </div>
                                  <div>
                                    <p className="mb-1 fw-bold">{reply.user}</p>
                                    <p className="mb-0">{reply.text}</p>
                                  </div>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;