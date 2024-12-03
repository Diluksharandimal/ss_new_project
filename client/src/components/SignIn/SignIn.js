import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast } from "react-toastify";

function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("user"); // Default to "user"
  const navigate = useNavigate(); // Create a navigate function

  useEffect(() => {
    // Automatically set the user type based on the email domain
    const domain = email.split('@')[1];
    if (domain === "admin.com") { // You can change this to any domain or condition
      setUserType("admin");
    } else {
      setUserType("user");
    }
  }, [email]); // Trigger on email change

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://ss-new-project-server.vercel.app/signin", {
        email,
        password,
        userType, // Include the userType in the request
      });
      toast.success(response.data.message);
      localStorage.setItem("token", response.data.token); // Save token to localStorage

      // Redirect based on userType
      if (userType === "admin") {
        navigate("/adminhome"); // Navigate to admin dashboard
      } else {
        navigate("/dashboard"); // Navigate to user dashboard
      }
    } catch (err) {
      toast.error("Login Failed");
    }
  };

  return (
    <div className="signin-page">
      <div className="container">
        <div className="login-content">
          <h3 className="title text-center mb-4">Sign In</h3>
          <form onSubmit={handleSignin}>
            <div className="input-div one mb-3">
              <div className="i">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="div">
                <input
                  type="email"
                  className="input"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <div className="input-div pass mb-3">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input
                  type="password"
                  className="input"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            {/* Dropdown for user type */}
            <div className="input-div user-type mb-3">
              <div className="i">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="div">
                <select 
                  className="input"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Sign In
            </button>
          </form>

          <p className="text-center mt-3">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
      <style jsx>{`
        .signin-page {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f4f4f9;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .login-content {
          width: 400px;
          background-color: #fff;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .title {
          font-size: 24px;
          margin-bottom: 20px;
        }

        .input-div {
          margin-bottom: 20px;
          position: relative;
        }

        .input-div .i {
          position: absolute;
          top: 10px;
          left: 10px;
          font-size: 18px;
          color: #777;
        }

        .input-div .div {
          position: relative;
        }

        .input {
          width: 100%;
          padding: 10px 40px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          outline: none;
          transition: all 0.3s ease;
        }

        .input:focus {
          border-color: #6c63ff;
        }

        .btn {
          width: 100%;
          padding: 12px;
          background-color: #6c63ff;
          border: none;
          border-radius: 4px;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .btn:hover {
          background-color: #5a54e1;
        }

        .abtn {
          display: block;
          text-align: center;
          color: #6c63ff;
          font-size: 14px;
          margin-top: 15px;
        }

        .abtn:hover {
          text-decoration: underline;
        }

        .error-message {
          color: red;
          font-size: 14px;
          margin-top: 5px;
        }

        a {
          display: block;
          text-align: center;
          font-size: 14px;
          margin-top: 15px;
          text-decoration: none;
        }

        a:hover {
          text-decoration: underline;
        }

        .user-type select {
          padding: 10px;
          width: 100%;
          border-radius: 4px;
          border: 1px solid #ddd;
        }
      `}</style>
    </div>
  );
}

export default Signin;
