import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 
import validateForm from '../Validation/SignUpValidation'; 

const SignUp = () => {
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'user', // Default value
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Custom validation logic
    const validationErrors = validateForm(values);
    setErrors(validationErrors);

    // If no validation errors, submit the form
    if (!validationErrors.name && !validationErrors.email && !validationErrors.password && !validationErrors.confirmPassword) {
      try {
        const response = await axios.post('https://ss-new-project-server.vercel.app/SignUp', values); // Updated URL

        if (response.status === 200) {
          const { token } = response.data; // Assume the token is returned in response.data
          
          // Store the token in localStorage (or sessionStorage)
          localStorage.setItem('token', token);
          toast.success('Signup successful!');
          
          setValues({
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            userType: 'user', // Reset to default value
          });
          navigate('/signin');
        } else {
          setErrors({ general: 'Signup failed. Please try again.' });
        }
      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.status === 400) {
          setErrors({ general: 'Invalid input data.' });
        } else if (error.response && error.response.status === 409) {
          setErrors({ general: 'Email already exists.' });
        } else {
          setErrors({ general: 'An error occurred. Please try again later.' });
        }
        toast.error('An error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="signup-page">
      <div className="container">
        <div className="login-content">
          <form onSubmit={handleSubmit} method="POST">
            <h2 className="title">Welcome</h2>

            {errors.general && <p className="error-message">{errors.general}</p>}

            <div className="input-div one">
              <div className="i">
                <i className="fas fa-user"></i>
              </div>
              <div className="div">
                <input 
                  type="text" 
                  className="input" 
                  placeholder='Name'
                  name="name"
                  value={values.name}
                  onChange={handleChange} 
                />
                {errors.name && <p className="error-message">{errors.name}</p>}
              </div>
            </div>

            <div className="input-div one">
              <div className="i">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="div">
                <input 
                  type="email" 
                  className="input" 
                  placeholder='Email'
                  name="email"
                  value={values.email}
                  onChange={handleChange} 
                />
                {errors.email && <p className="error-message">{errors.email}</p>}
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input 
                  type="password" 
                  className="input" 
                  placeholder='Password'
                  name="password"
                  value={values.password}
                  onChange={handleChange} 
                />
                {errors.password && <p className="error-message">{errors.password}</p>}
              </div>
            </div>

            <div className="input-div pass">
              <div className="i">
                <i className="fas fa-lock"></i>
              </div>
              <div className="div">
                <input 
                  type="password" 
                  className="input" 
                  placeholder='Confirm Password'
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onChange={handleChange} 
                />
                {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
              </div>
            </div>

            {/* Dropdown for user type */}
            <div className="input-div user-type">
              <div className="i">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="div">
                <select 
                  className="input" 
                  name="userType"
                  value={values.userType}
                  onChange={handleChange}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <a href="#">Forgot Password?</a>
            <input type="submit" className="btn" value="Sign Up" />
            <a href='/signin' className="abtn">SIGN IN</a>
            <p>Already Have An Account?</p>
          </form>
        </div>
      </div>
      <ToastContainer />

      <style jsx>{`
        .signup-page {
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
          text-align: center;
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
};

export default SignUp;
