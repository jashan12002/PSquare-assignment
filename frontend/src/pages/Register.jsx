import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, error } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    if (!formData.name) {
      formErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email) {
      formErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      formErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = 'Passwords do not match';
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
        const { confirmPassword, ...registerData } = formData;
        await register(registerData);
        navigate('/candidates');
      } catch (error) {
        console.error('Registration error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', display: 'flex', justifyContent: 'center', alignItems: 'center',flexDirection: 'column', height: '100vh', width: '100vw', padding: '2rem', gap: '2rem' }}>

      <Logo color="#4d007d" size={30} />
      <div style={{ 
        display: 'flex', 
        boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.1)',
        width: '75rem',
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
          <div style={{ maxWidth: '400px', textAlign: 'center', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', height: '50%', borderRadius: '10px' }}>
              <img 
                src="/loginBAnner.png" 
                alt="Dashboard Preview" 
                style={{ 
                  width: '100%', 
                  borderRadius: '10px',
                  marginBottom: '20px'
                }} 
              />
            </div>
            
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: '200',
              marginBottom: '15px',
              marginTop: '15px'
            }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            </h1>
            
            <p style={{ 
              fontSize: '14px',
              opacity: 0.9,
              lineHeight: '1.6'
            }}>
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
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
              marginBottom: '12px',
              fontWeight: '600',
              
              color: '#333'
            }}>
              Welcome to Dashboard
            </h2>
            
            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label 
                  htmlFor="name" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#333',
                    fontSize: '14px'
                  }}
                >
                  Full Name  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    borderRadius: '8px',
                    color: 'black',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.name && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.name}</div>}
              </div>
              
              <div style={{ marginBottom: '12px' }}>
                <label 
                  htmlFor="email" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#333',
                    fontSize: '14px'
                  }}
                >
                  Email Address  <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  style={{ 
                    width: '100%',
                    padding: '12px 15px',
                    color: 'black',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
                {errors.email && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.email}</div>}
              </div>
              
              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <label 
                  htmlFor="password" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    color: '#333',
                    fontSize: '14px'
                  }}
                >
                  Password <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                    style={{ 
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      paddingRight: '40px'
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
                      color: '#5E1DAD'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                {errors.password && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.password}</div>}
              </div>
              
              <div style={{ marginBottom: '12px', position: 'relative' }}>
                <label 
                  htmlFor="confirmPassword" 
                  style={{ 
                    display: 'block', 
                    marginBottom: '3px',
                    color: '#333',
                    fontSize: '14px'
                  }}
                >
                  Confirm Password  <span style={{ color: 'red' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    style={{ 
                      width: '100%',
                      padding: '12px 15px',
                      borderRadius: '6px',
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #ddd',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      paddingRight: '40px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      textAlign: 'center',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                      color: '#5E1DAD'
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {showConfirmPassword ? (
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
                {errors.confirmPassword && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.confirmPassword}</div>}
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  width: '121px',
                  padding: '8px 40px',
                  backgroundColor: '#5E1DAD',
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: 'none',
                  borderRadius: '45px',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                {isSubmitting ? 'Registering...' : 'Register'}
              </button>
            </form>
            
            <div style={{ 
              textAlign: 'left',
              fontSize: '14px',
              color: '#666'

            }}>
              Already have an account? <Link to="/login" style={{ color: '#5E1DAD', textDecoration: 'none', fontWeight: '500' }}>Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register; 