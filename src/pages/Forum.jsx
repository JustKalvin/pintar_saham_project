import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import { useLocation } from "react-router-dom";
// Hapus axios karena sudah tidak dipakai untuk operasi forum
// import axios from "axios"; 
import Search from "../assets/Search.png";
import { PageContext } from "../App.jsx";
import { motion, AnimatePresence } from "framer-motion";
// Impor fungsi-fungsi dari query.jsx
import { addReplyForum, getForum, postForum, toggleVoteForum } from "../../query.jsx";
import { supabase } from "../supabaseClient.js"

function Home() {
  const user = supabase.auth.getUser();
  const [currentUsername, setCurrentUsername] = useState("");
  const location = useLocation();
  const [forum, setForum] = useState([]);
  const [text, setText] = useState("");
  // isSended tidak diperlukan lagi
  // const [isSended, setIsSended] = useState(false);
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
    const fetchUserFromSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (session?.user) {
        const { id, email, user_metadata } = session.user;
        const name = user_metadata?.username || user_metadata?.full_name || email;
        setCurrentUsername(name);
        console.log("User ID:", id);
        console.log("Name:", name);
        console.log("Email:", email);
        // addUser(id, name, email); // opsional, simpan di table profiles
      }
    };
    fetchUserFromSession();
  }, []);


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

  // Fungsi terpusat untuk mengambil data forum
  const fetchForumData = async () => {
    try {
      // Tidak perlu setIsLoading(true) di sini karena akan ditangani oleh fungsi pemanggil jika perlu
      const data = await getForum(); // Gunakan fungsi dari query.jsx
      setForum(data);
      setTempForum(data); // Selalu reset tempForum dengan data terbaru
    } catch (error) {
      console.error("Error fetching forum:", error);
    } finally {
      setIsLoading(false); // Selalu set loading ke false setelah selesai
    }
  };

  // useEffect untuk pengambilan data awal
  useEffect(() => {
    setIsLoading(true);
    fetchForumData();
  }, []);

  // Hapus useEffect yang bergantung pada isSended

  const handleText = (event) => {
    setText(event.target.value);
  };

  async function classifyAndPost() {
    if (!text.trim()) return;

    setIsLoading(true);

    try {
      // Ambil user saat ini dari Supabase
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error("User belum login:", userError);
        setIsLoading(false);
        return;
      }
      const username = user.user_metadata?.username || user.email;

      // Bagian API Groq untuk klasifikasi
      const apiKey = process.env.REACT_APP_API_KEY;
      const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
      const requestBody = {
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "Anda adalah AI yang mengklasifikasikan thread/komen ke dalam kategori 'Positif' atau 'Negatif'. Jawaban hanya 'Positif' atau 'Negatif'." },
          { role: "user", content: `Classify the following review: "${text}"` }
        ],
        temperature: 0.5
      };

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

      // Post forum pakai Supabase dengan username dari auth
      await postForum(text, currentUsername, sentimentEmoji);

      await fetchForumData();
      setText("");
      setIsPost(false);

    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  }

  const handleVote = async (id, type) => {
    try {
      // type: 'up' atau 'down'
      await toggleVoteForum(id, currentUsername, type);
      await fetchForumData(); // refresh data setelah voting
    } catch (error) {
      console.error("Error toggling vote:", error);
    }
  };


  // const handleUpVote = async (username, id) => {
  //   try {
  //     // Ganti axios.post dengan fungsi upvoteForum
  //     await upvoteForum(id, username);
  //     // Panggil fetchForumData untuk refresh data
  //     await fetchForumData();
  //   } catch (error) {
  //     console.error("Error upvoting forum:", error);
  //   }
  // };

  // const handleDownVote = async (username, id) => {
  //   try {
  //     // Ganti axios.post dengan fungsi downvoteForum
  //     await downvoteForum(id, username);
  //     // Panggil fetchForumData untuk refresh data
  //     await fetchForumData();
  //   } catch (error) {
  //     console.error("Error downvoting forum:", error);
  //   }
  // };

  const handleAddReplyForum = async (id, user, theReplyText) => {
    if (!theReplyText.trim()) return;

    try {
      // Ganti axios.post dengan fungsi addReplyForum
      await addReplyForum(id, user, theReplyText);
      // Panggil fetchForumData untuk refresh data
      await fetchForumData();

      setReplyText("");
      setReplying(prev => ({ ...prev, [id]: false }));
    } catch (error) {
      console.log("Error when adding reply:", error);
    }
  };

  // ... (sisa fungsi handler seperti handleReplying, handleIsPost, handleSort, dll. tetap sama) ...
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
    const sortedForum = [...forum].sort((a, b) => b.upvote_count - a.upvote_count);
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
    const sortedForum = [...forum].sort((a, b) => b.downvote_count - a.downvote_count);
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

  // ... (sisa kode JSX tidak berubah) ...

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
          style={{ textAlign: "left", transform: "translateX(-50%)", }}
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
                transform: "translateX(200px)"
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
                {isLoading && isPost ? ( // Tampilkan spinner hanya saat memposting
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
          {isLoading && forum.length === 0 ? ( // Tampilkan spinner besar hanya saat loading awal
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
                        {/* <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3"
                          style={{ width: "40px", height: "40px" }}>


                        </div> */}
                        <span className="fw-bold me-2">
                          {item.username}
                        </span>
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
                        <div className="d-flex">
                          <motion.button
                            onClick={() => handleVote(item.id, "up")}
                            className="btn btn-sm btn-success mx-1 d-flex align-items-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="me-1">👍</span>
                            <span>{item.upvote_count}</span>
                          </motion.button>

                          <motion.button
                            onClick={() => handleVote(item.id, "down")}
                            className="btn btn-sm btn-danger mx-1 d-flex align-items-center"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <span className="me-1">👎</span>
                            <span>{item.downvote_count}</span>
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
                              onKeyPress={(e) => e.key === 'Enter' && handleAddReplyForum(item.id, currentUsername, replyText)}
                            />
                            <motion.button
                              onClick={() => handleAddReplyForum(item.id, currentUsername, replyText)}
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
                                  {/* <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-3"
                                    style={{ width: "36px", height: "36px", flexShrink: 0 }}>
                                    
                                  </div> */}
                                  <span className="fw-bold me-3">
                                    {reply.username}
                                  </span>
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