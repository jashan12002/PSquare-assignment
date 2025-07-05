import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';
import Loader from '../components/Loader';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));


    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.email.trim()) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await login(formData);
        navigate('/candidates');
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
      
    console.log('Forgot password clicked');
  };

  return (
    <>
      {isSubmitting && <Loader />}
      <div style={{
        backgroundColor: '#ffffff',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        padding: '2rem',
        gap: '2rem',
        boxSizing: 'border-box'
      }}>
        <Logo color="#4d007d" size={30} />

        <div style={{
          display: 'flex',
          boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
          width: '100%',
          maxWidth: '75rem',
          borderRadius: '12px',
          overflow: 'hidden',
          height: '32rem',
          backgroundColor: '#f5f5f5',
          fontFamily: 'system-ui, sans-serif'
        }}>

          <div style={{
            flex: 1,
            backgroundColor: '#5E1DAD',
            padding: '40px',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative'
          }}>
            <div style={{
              maxWidth: '400px',
              textAlign: 'center',
              paddingTop: '2rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                height: '50%',
                borderRadius: '10px'
              }}>
                <img
                  src="/loginBAnner.png"
                  alt="Dashboard Preview"
                  style={{
                    width: '100%',
                    borderRadius: '10px',
                    marginBottom: '20px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>

              <h1 style={{
                fontSize: '24px',
                fontWeight: '200',
                marginBottom: '15px',
                marginTop: '15px'
              }}>
                Welcome to Our Platform
              </h1>

              <p style={{
                fontSize: '14px',
                opacity: 0.9,
                lineHeight: '1.6'
              }}>
                Access your dashboard and manage your candidates with ease.
                Our platform provides comprehensive tools for efficient management.
              </p>
            </div>
          </div>


          <div style={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '40px'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '400px'
            }}>
              <h2 style={{
                fontSize: '20px',
                marginBottom: '30px',
                fontWeight: '600',
                color: '#333'
              }}>
                Welcome to Dashboard
              </h2>

              {error && (
                <div style={{
                  color: '#dc3545',
                  backgroundColor: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '20px',
                  fontSize: '14px'
                }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label
                    htmlFor="email"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#333',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Email Address <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                    style={{
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '8px',
                      color: '#333',
                      backgroundColor: 'white',
                      border: errors.email ? '1px solid #dc3545' : '1px solid #ddd',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      outline: 'none',
                      transition: 'border-color 0.3s ease'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = '#5E1DAD';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = errors.email ? '#dc3545' : '#ddd';
                    }}
                  />
                  {errors.email && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '5px'
                    }}>
                      {errors.email}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '15px', position: 'relative' }}>
                  <label
                    htmlFor="password"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      color: '#333',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    Password <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        borderRadius: '8px',
                        color: '#333',
                        backgroundColor: 'white',
                        border: errors.password ? '1px solid #dc3545' : '1px solid #ddd',
                        fontSize: '14px',
                        boxSizing: 'border-box',
                        paddingRight: '40px',
                        outline: 'none',
                        transition: 'border-color 0.3s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#5E1DAD';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.password ? '#dc3545' : '#ddd';
                      }}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '5px',
                        color: '#5E1DAD',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {showPassword ? (
                          <>
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </>
                        ) : (
                          <>
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </>
                        )}
                      </svg>
                    </button>
                  </div>
                  {errors.password && (
                    <div style={{
                      color: '#dc3545',
                      fontSize: '12px',
                      marginTop: '5px'
                    }}>
                      {errors.password}
                    </div>
                  )}
                </div>

                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    style={{
                      color: '#a4a4a4',
                      textDecoration: 'none',
                      fontSize: '14px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0'
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    width: '121px',
                    padding: '12px 40px',
                    backgroundColor: isSubmitting ? '#ccc' : '#5E1DAD',
                    color: 'white',
                    border: 'none',
                    borderRadius: '45px',
                    fontSize: '16px',
                    fontWeight: '500',
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    marginBottom: '20px',
                    transition: 'background-color 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.backgroundColor = '#4a1589';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.backgroundColor = '#5E1DAD';
                    }
                  }}
                >
                  Login
                </button>
              </form>

              <div style={{
                textAlign: 'left',
                fontSize: '14px',
                color: '#666'
              }}>
                Don't have an account? <Link
                  to="/register"
                  style={{
                    color: '#5E1DAD',
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;