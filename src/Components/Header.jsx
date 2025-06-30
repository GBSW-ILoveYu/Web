import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const { pathname } = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(pathname);

  return (
    <header className={`header${isAuthPage ? ' login-bg' : ''}`}>
      <div className="header-left">
        <NavLink to="/">
          <img src="/assets/imgs/Font_Logo_blue.png" alt="로고" className="logo" />
        </NavLink>
      </div>
      <div className="header-right">
        <NavLink 
          to="/CategoryPage" 
          className={({ isActive }) => `header-btn ${isActive ? 'active' : ''}`}
        >
          링크저장소
        </NavLink>
        <NavLink 
          to="/login" 
          className={({ isActive }) => `header-btn ${isActive ? 'active' : ''}`}
        >
          로그인
        </NavLink>
      </div>
    </header>
  );
};

export default Header;