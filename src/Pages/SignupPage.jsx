import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validateSignupForm } from "../utils/validateForm";
import { SaveSpinner } from '../Components';
import api from "../utils/api";

const SignupPage = () => {
  const [form, setForm] = useState({
    nickName: "",
    userId: "",
    password1: "",
    password2: "",
    email: ""
  });
  const [error, setError] = useState({ field: "", message: "" });
    const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (error.field === name) setError({ field: "", message: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateSignupForm(form);
    if (validationError) {
      setError(validationError);
      return;
    }
    setIsSaving(true);
    try {
      await api.post('/auth/signup', {
        email: form.email,
        password: form.password1,
        nickName: form.nickName,
        userId: form.userId
      });
      navigate('/login');
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError({ field: 'email', message: err.response.data.message });
        setIsSaving(false);
      } else {
        setError({ field: '', message: '서버 오류가 발생했습니다.' });
        setIsSaving(false);
      }
    }
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
        <form className="join-form" onSubmit={handleSubmit}>
          {[
            { label: '닉네임', id: 'nickName', type: 'text', name: 'nickName' },
            { label: '아이디', id: 'userId', type: 'text', name: 'userId' },
            { label: '비밀번호', id: 'password1', type: 'password', name: 'password1' },
            { label: '비밀번호 확인', id: 'password2', type: 'password', name: 'password2' },
            { label: '이메일', id: 'email', type: 'text', name: 'email' }
          ].map(({ label, id, type, name }) => (
            <div className="join-group" key={id}>
              <label htmlFor={id}>{label}</label>
              <input
                type={type}
                id={id}
                name={name}
                value={form[name]}
                onChange={handleChange}
                className={error.field === name ? 'input-error' : ''}
              />
              {error.field === name && <p className="error-message">{error.message}</p>}
            </div>
          ))}

          {isSaving ? ( 
            <SaveSpinner message={"회원가입중..."}/>
          ) : (
            <button type="submit" className="join-button">
              회원가입
            </button>
          )}
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
