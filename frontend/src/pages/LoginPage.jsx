import React, { useState } from "react";
import { login } from "../api";
import { Link, useNavigate } from "react-router-dom"; // Import Link here

export default function LoginPage({ onLogin }){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr("");
    try{
      const d = await login({ email, password });
      onLogin(d.token, d.user);
    }catch(e){
      setErr(e.response?.data?.error||e.message);
    }
  }

  return (
    <div className="login-signup-container">
      <div className="card">
        <h3>Login</h3>
        <form onSubmit={submit} style={{display:"grid",gap:15}}>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" placeholder="your@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" placeholder="********" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={{backgroundColor:"#2563eb",color:"white"}}>Login</button>
          {err && <div className="error-message">{err}</div>}
        </form>
      </div>
      <div className="card">
        <h3>New here?</h3>
        <p className="small">Create an account to save trips.</p>
        <Link to="/signup" className="link">Sign up</Link> {/* This is the Link component that was undefined */}
      </div>
    </div>
  );
}
