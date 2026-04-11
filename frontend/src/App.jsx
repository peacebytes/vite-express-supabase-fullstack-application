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

  const handleLogin = (u) => {
    sessionStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Categories</Link>
        <Link to="/ai-tools">AI Tools</Link>
        <span className="nav-right">
          {user.username} <button className="btn-secondary" onClick={handleLogout}>Logout</button>
        </span>
      </nav>
      <div className="container">
        <Routes>
          <Route path="/" element={<Categories />} />
          <Route path="/ai-tools" element={<AiTools />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
