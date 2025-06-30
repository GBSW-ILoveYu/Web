import React, { useEffect, useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAuthPage = ["/login", "/signup"].includes(pathname);

  const {user, setUser} = useAuth();;
  const [popupOpen, setPopupOpen] = useState(false);
  const popupRef = useRef();

  // 사용자 정보 가져오기
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken") || localStorage.getItem("accessToken");
    if (!token) {
      setUser(null);
      return;
    }
    api
      .get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => {
        sessionStorage.removeItem("accessToken");
        setUser(null);
      }); 
  }, [setUser]);

  // 외부 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = e => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setPopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (err) {
      console.log(err)
    }
    sessionStorage.clear();
    localStorage.clear();
    setUser(null);
    setPopupOpen(false);
    navigate("/login");
  };

  return (
    <header className={`header${isAuthPage ? " login-bg" : ""}`}>
      <div className="header-left">
        <NavLink to="/">
          <img
            src="/assets/imgs/Font_Logo_blue.png"
            alt="로고"
            className="logo"
          />
        </NavLink>
      </div>
      <div className="header-right">
        <NavLink
          to="/CategoryPage"
          className={({ isActive }) =>
            `header-btn ${isActive ? "active" : ""}`
          }
        >
          링크저장소
        </NavLink>

        {user ? (
          <div className="header-user-container" ref={popupRef}>
            <button
              className="header-user-btn"
              onClick={() => setPopupOpen(open => !open)}
            >
              {user.nickName || user.userId} ▾
            </button>
            {popupOpen && (
              <div className="header-popup">
                <button
                  className="header-popup-btn"
                  onClick={handleLogout}
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `header-btn ${isActive ? "active" : ""}`
            }
          >
            로그인
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              `header-btn ${isActive ? "active" : ""}`
            }
          >
            회원가입
          </NavLink>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
