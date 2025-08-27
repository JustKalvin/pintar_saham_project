import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect, useContext } from "react";
import { PageContext } from "../App.jsx";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImage from "../assets/BackgroundBody.png";
import { insertUsers } from "../../query.jsx";

const Login = () => {
  const [session, setSession] = useState(null);
  // Tambahkan state untuk loading
  const [loading, setLoading] = useState(true);
  const { handleCurrPage } = useContext(PageContext);

  useEffect(() => {
    handleCurrPage("Login");

    // Listener perubahan auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setLoading(false);
      }
    );

    // Cek sesi aktif
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Extra: cek user (kadang lebih cepat dari session)
    supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (user) {
        setSession({ user }); // Bungkus ke bentuk mirip session
      }
    });

    return () => subscription.unsubscribe();
  }, [handleCurrPage]);

  useEffect(() => {
    if (session?.user) {
      const { id, email, user_metadata } = session.user;
      const name = user_metadata?.full_name || "No name"; // default kalau belum ada
      console.log("User ID:", id);
      console.log("Name:", name);
      console.log("Email:", email);
      addUser(id, name, email);
    }
  }, [session]);

  const addUser = async (id, username, email) => {
    const result = await insertUsers(id, username, email)
    console.log("nih, result : ", result);
  }

  // Fungsi handleGoogleLogin dan handleLogout tetap sama
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/LoginPage"
      }
    });
    if (error) {
      console.error("Error logging in with Google:", error);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    }}>
      <Navbar />

      <main className="container d-flex flex-grow-1 flex-column justify-content-center align-items-center text-center text-white">
        <div
          className="p-4 rounded"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)'
          }}
        >
          {/* Tampilkan loading spinner jika sedang memeriksa status auth */}
          {loading ? (
            <div>
              <h1>Loading...</h1>
              <p>Please wait while we check your session.</p>
            </div>
          ) : session ? (
            // Jika user SUDAH login
            <div>
              <h1>Welcome Back!</h1>
              <p>You are logged in as:</p>
              <p><strong>{session.user.email}</strong></p>
              <button onClick={handleLogout} className="btn btn-danger w-100 mt-3">
                Logout
              </button>
            </div>
          ) : (
            // Jika user BELUM login
            <div>
              <h1>Login or Sign Up</h1>
              <p>Continue with your Google account to get started.</p>
              <button onClick={handleGoogleLogin} className="btn btn-success w-100 mt-3">
                Login with Google
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;