import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Categories from './pages/Categories';
import AiTools from './pages/AiTools';
import Login from './pages/Login';

export default function App() {
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showLogin, setShowLogin] = useState(false);

  const handleLogin = (u) => {
    sessionStorage.setItem('user', JSON.stringify(u));
    setUser(u);
    setShowLogin(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">AI Tools</Link>
        <Link to="/categories">Categories</Link>
        <span className="nav-right">
          {user ? (
            <>{user.username} <button className="btn-secondary" onClick={handleLogout}>Logout</button></>
          ) : (
            <button className="btn-primary" onClick={() => setShowLogin(true)}>Login</button>
          )}
        </span>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<AiTools />} />
          <Route path="/categories" element={<Categories />} />
        </Routes>
      </div>
      {showLogin && <Login onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
    </BrowserRouter>
  );
}
