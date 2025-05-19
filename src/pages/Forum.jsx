import React, { useState, useEffect, useContext } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Search from "../assets/Search.png"
import {PageContext} from "../App.jsx"

function Home() {
  const location = useLocation();
  const [forum, setForum] = useState([])
  const [text, setText] = useState("")
  const [isSended, setIsSended] = useState(false)
  const [replying, setReplying] = useState({})
  const [isFocused, setIsFocused] = useState(false);
  const [isPost, setIsPost] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [showReply, setShowReply] = useState(false)
  const [tempForum, setTempForum] = useState([])
  const [mostLikedButton, setMostLikedButton] = useState(false)
  const [mostDislikedButton, setMostDislikedButton] = useState(false)
  const [searchFilter, setSearchFilter] = useState("")
  const [showingReply, setShowingReply] = useState({})
  const {currPage, handleCurrPage} = useContext(PageContext)

  useEffect(() =>{
    handleCurrPage("Forum")
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

  useEffect(() => {
    const fetchingAPI = async () => {
      const response = await axios.get("http://127.0.0.1:8000/get-forum")
      console.log(response.data.forum)
      setForum(forum => (response.data.forum))
      setTempForum(tempForum => (response.data.forum))
    }
    fetchingAPI()
  }, [])

  useEffect(() => {
    if(isSended) {
      const fetchingAPI = async () => {
        const response = await axios.get("http://127.0.0.1:8000/get-forum")
        console.log(response.data.forum)
        setForum(forum => (response.data.forum))
        setTempForum(tempForum => (response.data.forum))
        setIsSended(false)
      }
      fetchingAPI()
    }
  }, [isSended])


  const handleText = (event) => {
    setText(text => (event.target.value))
  }
  
  const handleSend = async () => {
    try{
      const response = await axios.post("http://127.0.0.1:8000/post-forum", {
        text : text,
        user : localStorage.getItem("username")
      })
      setIsSended(isSended => (true))
      setText("")
    }
    catch(error) {
      console.log("Error when posting forum")
    }
  }

  async function classifyAndPost() {
    const apiKey = "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";
    const apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    
    const requestBody = {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Anda adalah AI yang mengklasifikasikan thread/komen ke dalam kategori 'Positif' atau 'Negatif'. Jawaban hanya 'Positif' atau 'Negatif'." },
        { role: "user", content: `Classify the following review: "${text}"` }
      ],
      temperature: 0.5
    };
  
    try {
      // Mengirim permintaan ke API Groq
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
  
      // Mengirim data ke backend lokal
      await axios.post("http://127.0.0.1:8000/post-forum", {
        text: text,
        user: localStorage.getItem("username"),
        sentiment: sentimentEmoji
      });
  
      setIsSended(true);
      setText("");
    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  }
  

  const handleUpVote = async (username, id) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/add-user-liked-forums/${username}/${id}`,
        { forum_id : id } // Sesuaikan dengan struktur `LikedForums`
      );
      console.log(response.data);
      setIsSended(true);
    } catch (error) {
      console.error("Error upvoting forum:", error);
    }
  };
  
  const handleDownVote = async (username, id) => {
    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/add-user-disliked-forums/${username}/${id}`,
        { forum_id : id } // Sesuaikan dengan struktur `LikedForums`
      );
      console.log(response.data);
      setIsSended(true);
    } catch (error) {
      console.error("Error downvoting forum:", error);
    }
  };

  const handleReplying = (id) => {
    setReplying(replying => ({
      ...replying, // Copy state sebelumnya
      [id]: (!replying[id]) // Toggle nilai (true/false)
    }));
  };

  const handleShowingReply = (id) => {
    setShowingReply(showingReply => ({
      ...showingReply, // Copy state sebelumnya
      [id]: (!showingReply[id]) // Toggle nilai (true/false)
    }));
  };
  
  const handleIsPost = () => {
    setIsPost(isPost => (!isPost))
  }

  const handleReplyText = (event) => {
    if (!event || !event.target) return;
    setReplyText(event.target.value);
  };
  

  const handleAddReplyForum = async (id, user, theReplyText) => {
    try {
      const response = await axios.post(`http://127.0.0.1:8000/add-reply-forum/${id}`, {
        user: user,
        text: theReplyText
      });
      console.log(response);
      setIsSended(true); // Tambahkan ini agar forum diperbarui
      setReplyText(replyText => (""))
    } catch (error) {
      console.log("Error when adding reply:", error);
    }
  };
  
  const handleShowReply = () => {
    setShowReply(showReply => (!showReply))
  }

  const handleSortMostLiked = () => {
    setSearchFilter(searchFilter => (""))
    if(mostLikedButton === true) {
      setTempForum(tempForum => (forum))
      setMostLikedButton(mostLikedButton => (false))
      setMostDislikedButton(mostDislikedButton => (false))
      return
    }
    setMostLikedButton(mostLikedButton => (!mostLikedButton))
    setMostDislikedButton(mostDislikedButton => (false))
    const sortedForum = [...forum].sort((a, b) => b.upVoteCount - a.upVoteCount);
    setTempForum(tempForum => (sortedForum));
  }

  const handleSortMostDisliked = () => {
    if(mostDislikedButton === true) {
      setTempForum(tempForum => (forum))
      setMostLikedButton(mostLikedButton => (false))
      setMostDislikedButton(mostDislikedButton => (false))
      return
    }
    setMostDislikedButton(mostDislikedButton => (!mostDislikedButton))
    setMostLikedButton(mostLikedButton => (false))
    const sortedForum = [...forum].sort((a, b) => b.downVoteCount - a.downVoteCount);
    setTempForum(tempForum => (sortedForum));
  }

  const handleSearchFilter = (event) => {
    setSearchFilter(searchFilter => (event.target.value))
  }

  const handleSortBySearchFilter = () => {
    setMostLikedButton(mostLikedButton => (false))
    setMostDislikedButton(mostDislikedButton => (false))
    const filtered_forum = forum.filter((item, index) => {
      return( 
        item.text.toLowerCase().includes(searchFilter.toLowerCase())
      )
    })
    setTempForum(tempForum => (filtered_forum))
  }

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
      <p className="h1 text-white ms-5 my-5 py-5">Buat Utas Dan Diskusikan <br />Dengan Pengguna Lain</p>
        
      <div className="d-flex flex-row align-items-center">
        <button onClick={() => handleIsPost()} className="text-white ms-5" style={{backgroundColor : "transparent", borderRadius : "20px", borderColor : "#527942", borderStyle : "solid", borderWidth : "3px"}}>+ Buat Utas</button>
        <div className="d-flex justify-content-end flex-grow-1 me-5">
          <div className="d-flex flex-column">
            <div>
              <input onChange={handleSearchFilter} style={{width : "30vw", borderRadius : "10px"}} type="text"/>
              <button onClick={() => handleSortBySearchFilter()} className="btn btn-outline-success border-0 ms-2">
                <img src={Search} alt="Search" style={{ width: "20px", height: "20px" }} />
              </button>
            </div>
            {/* here */}
            <div className="d-flex gap-2">
              <button
                onClick={() => handleSortMostLiked()}
                className={`btn ${mostLikedButton ? "btn-success" : "btn-outline-success"}`}
              >
                Most Liked
              </button>
              <button
                onClick={() => handleSortMostDisliked()}
                className={`btn ${mostDislikedButton ? "btn-success" : "btn-outline-success"}`}
              >
                Most Disliked
              </button>
            </div>
            {/* here */}
          </div>
        </div>
      </div>
      
      {isPost ? (
        <div className="d-flex align-items-center ms-5 mt-3">
          <input
            onChange={handleText}
            type="text"
            className="form-control me-2"
            placeholder="Tulis sesuatu..."
            style={{
              maxWidth: "400px",
              borderRadius: "10px",
              outline: "none",
              boxShadow: isFocused ? "0 0 8px 2px rgba(0, 128, 0, 0.7)" : "none", // Hijau saat focus
              border: isFocused ? "1px solid #28a745" : "1px solid #ced4da"
            }}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
          <button onClick={() => classifyAndPost()} className="btn btn-success px-4">
            Kirim
          </button>
        </div>
      ) : (<p></p>)}

      {/* Konten Utama */}
      <div className="container py-5">
        <div className="row justify-content-center d-flex flex-column">
          {tempForum.map((item) => (
            <div key={item.id} className="col-md-6 mb-3 my-5">
              <div className="card text-white shadow-lg" style={{backgroundColor : "#395F2E", borderRadius : "15px", width : "68vw"}}>
                <div className="card-body">
                  <h5 className="card-title">{item.user}</h5>
                  <div className="d-flex justify-content-between">
                  <span>Diunggah pada {item.id} {new Date(item.created_at).toLocaleDateString('id-ID', { 
                    weekday: 'long', 
                    day: '2-digit', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                  </span>
                  </div>
                </div>
                <div className="mx-3" style={{height : "200px"}}>
                  <p className="card-text">{item.text}</p>
                  <p className="card-text">{item.sentiment}</p>
                </div>
                <div className="d-flex flex-row align-items-center" style={{backgroundColor : "#2C4A23", borderRadius : "13px", height : "70px"}}>
                  <button onClick={() => handleReplying(item.id)} className="d-inline mx-2" style={{height : "40px", width : "40px", borderRadius : "50%", color : "#2C4A23"}}>+</button>
                  <p className="mx-2 my-auto">Tanggapi thread ini...</p>
                  <div className="d-flex align-items-end ms-auto">
                    <button onClick={() => handleUpVote(localStorage.getItem("username"), item.id)} className="badge bg-success mx-2">👍 {item.upVoteCount}</button>
                    <button onClick={() => handleDownVote(localStorage.getItem("username"), item.id)} className="badge bg-danger mx-2">👎 {item.downVoteCount}</button>
                  </div>  
                </div>
              </div>
              {replying[item.id] ? (
                <div className="mt-3 p-3" style={{ backgroundColor: "#2C4A23", borderRadius: "10px" }}>
                  <input
                    onChange={handleReplyText}
                    type="text"
                    className="form-control mb-2"
                    placeholder="Balas thread..."
                    style={{
                      maxWidth: "400px",
                      borderRadius: "10px",
                      outline: "none",
                      boxShadow: isFocused ? "0 0 8px 2px rgba(0, 128, 0, 0.7)" : "none", // Hijau saat focus
                      border: isFocused ? "1px solid #28a745" : "1px solid #ced4da"
                    }}
                    value={replyText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                  />
                  <button onClick={() => handleAddReplyForum(item.id, localStorage.getItem("username"), replyText)} className="btn btn-light">Kirim</button>
                </div>
              ) : null}
              {/* here */}
              <div>
                <button onClick={() => handleShowingReply(item.id)} className="bg-transparent text-white mt-3 p-2" style={{border : "2px solid #2C4A23", borderRadius : "10px"}}>Tampilkan Utasan</button>
              </div>
              {showingReply[item.id] ? (
                <div className="mt-3 p-3 rounded" style={{ backgroundColor: "#2C4A23", borderRadius: "10px", transition: "all 0.3s ease-in-out" }}>
                  <h6 className="text-white">Balasan:</h6>
                  {item.replies.map((x, index) => (
                    <div key={index} className="d-flex align-items-start my-2 p-2 rounded" style={{ backgroundColor: "#395F2E", borderRadius: "8px" }}>
                      <div className="me-2">
                        <div className="rounded-circle d-flex align-items-center justify-content-center" 
                            style={{ width: "40px", height: "40px", backgroundColor: "#527942", color: "#fff", fontSize: "16px", fontWeight: "bold" }}>
                          {x.user.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      <div>
                        <p className="mb-1 text-white" style={{ fontWeight: "bold" }}>{x.user}</p>
                        <p className="mb-0 text-white">{x.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>  
          ))}
          </div>
      </div>

      {/* Footer (Selalu di Bawah) */}
      <Footer />
    </div>
  );
}

export default Home;
