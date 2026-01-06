import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { useState } from "react";
import axios from "../config/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submitted");
    axios.post('users/login', {
      email,
      password
    }).then((res) => {
      console.log(res.data);
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
    <div className="page">
      <div className="form-container">
        <h1>Login</h1>
        <h2>Welcome back to Medilloon</h2>
        <form onSubmit={(e) => {
          handleSubmit(e);
        }}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email" />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type="password" />
          <button>
            Login
          </button>
        </form>
        <p>
          Don’t have an account?
          <Link to="/signup" className="link-text">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}