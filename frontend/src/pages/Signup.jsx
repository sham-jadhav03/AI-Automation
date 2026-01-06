import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { useContext, useState } from "react";
import axios from "../config/axios";
import { UserContext } from "../context/UserContext";

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext)

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('users/register', {
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
  };

  return (
    <div className="auth-container">
      <div className="auth-visual">
        <div className="visual-content">
          <h1>Mediloon</h1>
          <p>Join thousands of medical professionals managing their workflow efficiently.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Get started with your free account today.</p>
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
              Sign Up
            </button>
          </form>

          <p className="auth-footer">
            Already have an account?
            <Link to="/login" className="auth-link">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
