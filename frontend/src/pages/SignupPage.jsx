import React, { useState } from "react";
import { signup } from "../api";
import { Link, useNavigate } from "react-router-dom"; // Ensure Link is imported here too

export default function SignupPage({ onSignup }){
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    setErr("");
    try{
      const d = await signup({ name,email,password });
      onSignup(d.token, d.user);
    }catch(e){
      setErr(e.response?.data?.error||e.message);
    }
  }

  return (
    <div className="login-signup-container">
      <div className="card">
        <h3>Sign up</h3>
        <form onSubmit={submit} style={{display:"grid",gap:15}}>
          <div>
            <label htmlFor="name">Name</label>
            <input id="name" placeholder="Your Name" value={name} onChange={e=>setName(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="email">Email</label>
            <input id="email" placeholder="your@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input id="password" placeholder="********" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={{backgroundColor:"#2563eb",color:"white"}}>Create account</button>
          {err && <div className="error-message">{err}</div>}
        </form>
      </div>
      <div className="card">
        <h3>Have an account?</h3>
        <p className="small">If you already have an account, login.</p>
        <Link to="/login" className="link">Login</Link> {/* This is the Link component */}
      </div>
    </div>
  );
}
