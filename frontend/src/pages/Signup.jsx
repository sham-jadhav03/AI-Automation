import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";
import { useState } from "react";
import axios from "../config/axios";


export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('users/register', {
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
  };

  return (
    <div className="page">
      <div className="form-container">
        <h1>Create Account</h1>
        <h2>Start your journey with us</h2>
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
            Sign Up
          </button>
        </form>
        <p>
          Already have an account?
          <Link to="/login" className="link-text">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
