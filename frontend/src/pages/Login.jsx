import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Logo from '../components/Logo';

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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

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
    setShowPassword(!showPassword);
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
        // borderRadius: '0 25px 25px 0',
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
{/*           
          <div style={{ 
            marginTop: '50px', 
            display: 'flex', 
            gap: '8px', 
            justifyContent: 'center' 
          }}>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              opacity: 1 
            }}></span>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              opacity: 0.5 
            }}></span>
            <span style={{ 
              width: '10px', 
              height: '10px', 
              borderRadius: '50%', 
              backgroundColor: 'white', 
              opacity: 0.5 
            }}></span>
          </div> */}
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
          
          {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="email" 
                style={{ 
                  display: 'block', 
                  marginBottom: '8px',
                  color: '#333',
                  fontSize: '14px'
                }}
              >
                Email Address <span style={{ color: 'red' }}>*</span>
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
                  borderRadius: '8px',
                  color: 'black',
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
              />
              {errors.email && <div style={{ color: 'red', fontSize: '14px', marginTop: '5px' }}>{errors.email}</div>}
            </div>
            
            <div style={{ marginBottom: '15px', position: 'relative' }}>
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
                    color: 'black',
                    backgroundColor: 'white',
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
            
            <div style={{ textAlign: 'left', marginBottom: '20px' }}>
              <a 
                href="#" 
                style={{ 
                  color: '#a4a4a4', 
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Forgot password?
              </a>
            </div>

            
            
            <button 
              type="submit" 
              disabled={isSubmitting}
              style={{
                width: '121px',
                padding: '8px 40px',
                backgroundColor: '#5E1DAD',
                color: 'white',
                border: 'none',
                borderRadius: '45px',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                marginBottom: '20px'
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
            Don't have an account? <Link to="/register" style={{ color: '#5E1DAD', textDecoration: 'none', fontWeight: '500' }}>Register</Link>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Login; 