import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { validateLoginForm } from "../utils/validateForm";
import { SaveSpinner } from '../Components';
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const auth = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState({ field: "", message: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error.field === name) setError({ field: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateLoginForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError({ field: "", message: "" });

    try {
      setIsSaving(true);
      const response = await api.post("/auth/signin", {
        email: form.email,
        password: form.password,
      });
      const { accessToken, refreshToken } = response.data;
      console.log("로그인 성공:", response);

      if (rememberMe) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
      } else {
        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);
      }

      const userRes = await api.get("/auth/me");
      auth.setUser(userRes.data);

      navigate("/");
    } catch (err) {
      if (err.response && err.response.data) {
        const { field, message } = err.response.data;
        if (field) {
          setError({ field, message });
        } else {
          setError({ field: "", message: message || "로그인에 실패했습니다." });
          setIsSaving(false);
        }
      } else {
        setError({ field: "", message: "서버 오류가 발생했습니다." });
        setIsSaving(false);
      }
    }
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
            <label htmlFor="email">이메일</label>
            <input
              type="text"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className={error.field === "email" ? "input-error" : ""}
            />
            {error.field === "email" && (
              <p className="error-message">{error.message}</p>
            )}
          </div>

          <div className="login-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className={error.field === "password" ? "input-error" : ""}
            />
            {error.field === "password" && (
              <p className="error-message">{error.message}</p>
            )}
          </div>

          {error.field === "" && error.message && (
            <p className="error-message">{error.message}</p>
          )}

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span>자동 로그인</span>
            </label>
          </div>
          
          {isSaving ? ( 
            <SaveSpinner message={"로그인중..."}/>
          ) : (
          <button type="submit" className="login-button">
            로그인
          </button>
          )}
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
};

export default LoginPage;
