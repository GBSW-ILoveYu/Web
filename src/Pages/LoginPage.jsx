import React, { useState } from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ field: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError({ field: "username", message: "아이디를 입력해주세요." });
      return;
    }
    if (!password.trim()) {
      setError({ field: "password", message: "비밀번호를 입력해주세요." });
      return;
    }
    setError({ field: "", message: "" });
    // 로그인 로직
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <div className="login-title">로그인</div>
          <img
            className="login-logo"
            src="/assets/imgs/Symbol_Logo_blue.png"
            alt="로고"
          />
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-group">
            <label htmlFor="username">아이디</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (error.field === "username") setError({ field: "", message: "" });
              }}
              className={error.field === "username" ? "input-error" : ""}
            />
            {error.field === "username" && (
              <p className="error-message">{error.message}</p>
            )}
          </div>

          <div className="login-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error.field === "password") setError({ field: "", message: "" });
              }}
              className={error.field === "password" ? "input-error" : ""}
            />
            {error.field === "password" && (
              <p className="error-message">{error.message}</p>
            )}
          </div>

          <div className="login-options">
            <label>
              <input type="checkbox" />
              <span>로그인 유지</span>
            </label>
          </div>

          <button type="submit" className="login-button">
            로그인
          </button>
        </form>

        <div className="register-link">
          <span>아직 계정이 없으신가요? </span>
          <Link to="/signup" className="signup-button">
            회원가입하기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
