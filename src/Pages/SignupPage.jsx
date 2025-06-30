import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [form, setForm] = useState({
    name: "",
    userid: "",
    password1: "",
    password2: "",
    email: ""
  });
  const [error, setError] = useState({ field: "", message: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error.field === name) setError({ field: "", message: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError({ field: "name", message: "이름을 입력해주세요." });
      return;
    }
    if (!form.userid.trim()) {
      setError({ field: "userid", message: "아이디를 입력해주세요." });
      return;
    }
    if (!form.password1.trim()) {
      setError({ field: "password1", message: "비밀번호를 입력해주세요." });
      return;
    }
    if (form.password1 !== form.password2) {
      setError({ field: "password2", message: "비밀번호가 일치하지 않습니다." });
      return;
    }
    if (!form.email.trim()) {
      setError({ field: "email", message: "이메일을 입력해주세요." });
      return;
    }
    setError({ field: "", message: "" });
    // 회원가입 성공 로직
    navigate("/login");
  };

  return (
    <div className="join-container">
      <div className="join-box">
        <div className="join-header">
          <div className="join-title">회원가입</div>
          <img
            className="join-logo"
            src="/assets/imgs/Symbol_Logo_blue.png"
            alt="로고"
          />
        </div>
        {/* 회원가입 입력폼 */}
        <form className="join-form" onSubmit={handleSubmit}>
          <div className="join-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className={error.field === "name" ? "input-error" : ""}
            />
            {error.field === "name" && <p className="error-message">{error.message}</p>}
          </div>

          <div className="join-group">
            <label htmlFor="userid">아이디</label>
            <input
              type="text"
              id="userid"
              name="userid"
              value={form.userid}
              onChange={handleChange}
              className={error.field === "userid" ? "input-error" : ""}
            />
            {error.field === "userid" && <p className="error-message">{error.message}</p>}
          </div>

          <div className="join-group">
            <label htmlFor="password1">비밀번호</label>
            <input
              type="password"
              id="password1"
              name="password1"
              value={form.password1}
              onChange={handleChange}
              className={error.field === "password1" ? "input-error" : ""}
            />
            {error.field === "password1" && <p className="error-message">{error.message}</p>}
          </div>

          <div className="join-group">
            <label htmlFor="password2">비밀번호 확인</label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={form.password2}
              onChange={handleChange}
              className={error.field === "password2" ? "input-error" : ""}
            />
            {error.field === "password2" && <p className="error-message">{error.message}</p>}
          </div>

          <div className="join-group">
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={error.field === "email" ? "input-error" : ""}
            />
            {error.field === "email" && <p className="error-message">{error.message}</p>}
          </div>

          <button type="submit" className="join-button">
            회원가입
          </button>
        </form>

        <div className="login-link">
          <span>이미 계정이 있으신가요? </span>
          <Link to="/login" className="login-link-button">
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;