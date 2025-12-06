import React, { useEffect, useState } from 'react'
import { Navbar } from './components/Navbar/Navbar'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Route, Routes, useSearchParams, useNavigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import { List } from './pages/List/List'
import Order from './pages/Orders/Order'
import { ToastContainer, toast } from 'react-toastify';
import Home from './pages/Home/Home'

const App = () => {
  const url = "https://foodapp-backend-rouge.vercel.app"
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for token in URL params first
   const tokenFromUrl = new URLSearchParams(window.location.search).get("token");
    
    if (tokenFromUrl) {
      // Store the token and remove from URL
      localStorage.setItem('adminToken', tokenFromUrl);
      
      // Clean the URL (remove token parameter)
      window.history.replaceState({}, '', window.location.pathname);
      
      // Validate the token with your backend
      validateToken(tokenFromUrl);
    } else {
      // Check for existing token in localStorage
      const existingToken = localStorage.getItem('adminToken');
      
      if (existingToken) {
        validateToken(existingToken);
      } else {
        // No token found, redirect to login or show login page
        setLoading(false);
        setIsAuthenticated(false);
        toast.error("Please login to access admin panel");
        // Optionally redirect to your main app's login
        // window.location.href = "https://your-main-app.vercel.app?showLogin=true";
      }
    }
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await fetch(`${url}/api/admin/validate`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setIsAuthenticated(true);
        toast.success("Admin authenticated successfully");
      } else {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        toast.error("Session expired. Please login again.");
      }
    } catch (error) {
      console.error("Token validation error:", error);
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
      toast.error("Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    toast.success("Logged out successfully");
    // Redirect to main app or show login
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <h2>Loading Admin Panel...</h2>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column' 
      }}>
        <h2>Admin Access Required</h2>
        <p>Please login through the main application</p>
        <button 
          onClick={() => window.location.href = "https://foodapp-frontend-phi.vercel.app"}
          style={{
            padding: '10px 20px',
            marginTop: '20px',
            background: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Go to Main App
        </button>
      </div>
    );
  }

  return (
    <div>
      <ToastContainer />
      <Navbar onLogout={handleLogout} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path='/' element={<Home url={url} />} />
          <Route path='/add' element={<Add url={url} />} />
          <Route path='/list' element={<List url={url} />} />
          <Route path='/orders' element={<Order url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App