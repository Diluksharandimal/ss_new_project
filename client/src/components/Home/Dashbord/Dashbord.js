import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

function Dashbord() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    profilePicture: null,
  });

  const [userInfo, setUserInfo] = useState({
    id: '',
    email: '',
    name: '',
  });

  const navigate = useNavigate(); 
  const BACKEND_URL = 'https://ss-new-project-server.vercel.app'; // Add your backend URL here

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
          const token = localStorage.getItem('token'); // Get the JWT from local storage
  
          if (!token) {
              console.error('No token found, user is not authenticated.');
              navigate('/signin'); 
              return; 
          }
  
          const response = await fetch(`${BACKEND_URL}/users`, { // Use the backend URL
              method: 'GET',
              headers: {
                  Authorization: `Bearer ${token}`, // Include the token in the request headers
                  'Content-Type': 'application/json', 
              },
          });
  
          if (response.status === 403) {
              // Token is invalid or expired
              alert("Your session has expired, please log in again.");
              localStorage.removeItem('token'); // Optionally clear token from local storage
              navigate('/signin'); // Redirect to sign-in
              return; 
          }
  
          if (!response.ok) {
              console.error(`HTTP error! status: ${response.status}, statusText: ${response.statusText}`);
              throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
          }
  
          const data = await response.json();
  
          setUserInfo({
              id: data.id, 
              email: data.email,
              name: data.name,
          });
  
          setFormData({
              fullName: data.name || '', 
              email: data.email || '', 
              profilePicture: null, 
          });
      } catch (error) {
          console.error('Error fetching user data:', error.message); 
      }
    };
  
    fetchUserData();
  }, [navigate, BACKEND_URL]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
  };

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    
    if (confirmLogout) {
        const token = localStorage.getItem('token');
        try {
            await fetch(`${BACKEND_URL}/logout`, { // Use the backend URL
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });
            localStorage.removeItem('token');  // Remove token from local storage
            console.log('User logged out');     // Logs logout action in console
            navigate('/');                      // Navigate to home page
        } catch (error) {
            console.error("Logout failed:", error); // Log error if logout fails
        }
    } else {
        console.log('Logout canceled');          // Logs cancel action in console
    }
  };

  return (
    <div className='home'>
      <p className="admin-welcome">{userInfo.name}, Welcome to Home!</p>
      <div className="app-container">
        <div className="profile-card">
          <div className="profile-image">
            <img
              src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : "https://via.placeholder.com/150"}
              alt="Profile"
            />
          </div>
          <h2>{formData.fullName}</h2>
          <div className="user-info">
            <p className='user_data'>User ID: {userInfo.id}</p>
            <p className='user_data'>Name: {userInfo.name}</p>
            <p className='user_data'>Email: {userInfo.email}</p>
          </div>
          <div className="buttons">
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        <div className="edit-profile-form">
          <h2 className='home_h1'>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
            <label>Full Name</label>
            <input 
              type="text" 
              name="fullName"
              className='home_input' 
              value={formData.fullName} 
              onChange={handleChange} 
            />
            
            <label>Email</label>
            <input 
              type="text"
              name="email"
              className='home_input' 
              value={formData.email} 
              onChange={handleChange} 
            />
            
            <label>Profile Picture</label>
            <input 
              type="file" 
              name="profilePicture" 
              className='home_input' 
              onChange={handleFileChange} 
            />
            
            <button type="submit" className="update-btn">Update</button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .home {
          font-family: Arial, sans-serif;
          padding: 20px;
        }

        .admin-welcome {
          font-size: 24px;
          color: #333;
          text-align: center;
        }

        .app-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 20px;
        }

        .profile-card {
          background-color: #f9f9f9;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          padding: 20px;
          width: 100%;
          max-width: 400px;
          text-align: center;
        }

        .profile-image img {
          border-radius: 50%;
          width: 150px;
          height: 150px;
          object-fit: cover;
        }

        .user-info p {
          font-size: 16px;
          color: #555;
          margin: 5px 0;
        }

        .buttons {
          margin-top: 20px;
        }

        .logout-btn {
          background-color: #f44336;
          color: white;
          border: none;
          padding: 10px 20px;
          cursor: pointer;
          font-size: 16px;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }

        .logout-btn:hover {
          background-color: #d32f2f;
        }

        .edit-profile-form {
          background-color: #fff;
          padding: 20px;
          width: 100%;
          max-width: 400px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          margin-top: 40px;
        }

        .edit-profile-form h2 {
          font-size: 22px;
          color: #333;
          margin-bottom: 15px;
        }

        .home_input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
        }

        .update-btn {
          background-color: #4CAF50;
          color: white;
          padding: 10px 20px;
          font-size: 16px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .update-btn:hover {
          background-color: #45a049;
        }
      `}</style>
    </div>
  );
}

export default Dashbord;
