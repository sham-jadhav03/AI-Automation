import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { useContext, useState } from "react";
import axios from "../config/axios";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { setUser } = useContext(UserContext)

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('users/login', {
      email,
      password
    }).then((res) => {
      console.log(res.data);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      if (res.data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/')
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <div className="visual-content">
          <h1>Mediloon</h1>
          <p>Experience the future of medical management with our state-of-the-art platform.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                type="email"
              />
            </div>
            <div className="form-group">
              <input
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
              />
            </div>
            <button className="submit-btn" type="submit">
              Login
            </button>
          </form>

          <p className="auth-footer">
            Don’t have an account?
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}