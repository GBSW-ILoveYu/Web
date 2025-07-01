import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { categories as initCats } from '../utils/categories';
import { Spinner, SaveSpinner } from '../Components';

const MainPage = () => {
  const [userName, setUserName] = useState('게스트');
  const [linkInput, setLinkInput] = useState('');
  const [recentCount, setRecentCount] = useState(0);
  const [recentLinks, setRecentLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const linksRes = await api.get('/links');
      const [meRes, recentRes] = await Promise.all([
        api.get('/auth/me'),
        api.get(`/links/recently-opened?limit=${linksRes.data.length}`),
      ]);

      setUserName(meRes.data.nickName);
      setRecentCount(recentRes.data.length);
      setRecentLinks(recentRes.data.slice(0, 3));

      // 중복 제거된 initCats 생성 (ID 기준)
      const uniqueInit = Array.from(
        new Map(initCats.map(cat => [cat.id, cat])).values()
      );

      // 카테고리별 개수 집계
      const grouped = linksRes.data.reduce((acc, link) => {
        const name = link.category || '기타';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      // 전체 카테고리 배열 구성
      const allCat = { id: 'all', name: '전체', count: linksRes.data.length };
      const otherCats = uniqueInit
        .filter(c => c.id !== 'all')
        .map(c => ({ ...c, count: grouped[c.name] || 0 }));

      // 상위 카테고리 3개
      const topCats = otherCats
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

      setCategories([allCat, ...topCats]);
    } catch (error) {
      console.error('데이터 로드 실패:', error);

      const uniqueInit = Array.from(
        new Map(initCats.map(cat => [cat.id, cat])).values()
      );
      const fallbackAll = { id: 'all', name: '전체', count: 0 };
      const fallbackOthers = uniqueInit
        .filter(c => c.id !== 'all')
        .slice(0, 3)
        .map(c => ({ ...c, count: 0 }));

      setCategories([fallbackAll, ...fallbackOthers]);
      setRecentCount(0);
      setRecentLinks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const displayCategories = [...categories]
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const handleSave = async () => {
    const url = linkInput.trim();
    if (!url) {
      setSaveError('링크를 입력해주세요.');
      setTimeout(() => inputRef.current?.focus(), 0);
      return;
    }
    setSaveError('');
    setIsSaving(true);
    try {
      await api.post('/links', { url });
      await loadData();
      setLinkInput('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 700);
    } catch (err) {
      if (err.response?.status === 401) {
        alert('로그인이 필요한 서비스입니다.');
        navigate('/login');
        return;
      }
      setSaveError(err.response?.data?.message || '저장 중 오류가 발생했습니다.');
      setTimeout(() => inputRef.current?.focus(), 0);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter') handleSave();
  };

  const handleOpen = async (id, url) => {
    try {
      await api.get(`/links/${id}`);
      window.open(`https://${url}`, '_blank', 'noopener');
    } catch (err) {
      console.error('링크 열람 기록 저장 실패', err);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <div className="mp-wrapper">
      <div className="mp-top-container">
        <div className="mp-top-content">
          <div className="mp-greeting-text">
            <div className="mp-user-name">{userName}님</div>
            <div className="mp-saved-links">
              저장해둔 <span className="mp-highlight">{recentCount}개의 링크를</span>
            </div>
            <div className="mp-message">잊지 않고 열어보셨네요 !</div>
          </div>
          <div className="mp-icon-container">
            <img src="/assets/imgs/Chain-img.png" alt="메뉴 아이콘" className="mp-icon" />
          </div>
        </div>

        <div className="mp-input-container">
          <input
            ref={inputRef}
            type="text"
            className={`mp-link-input${saveError ? ' input-error' : ''}`}
            placeholder="URL을 입력하세요"
            value={linkInput}
            onChange={e => setLinkInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSaving}
          />
          {isSaving ? (
            <SaveSpinner message={"저장중..."}/>
          ) : showSuccess ? (
            <div className="save-success">저장완료!</div>
          ) : (
            <button onClick={handleSave} className="mp-save-button">
              저장하기
            </button>
          )}
        </div>
        {saveError && (
          <p className="error-message">
            {saveError}
          </p>
        )}
      </div>

      <div className="mp-link-storage-section">
        <div className="mp-section-header">
          <h2 className="mp-section-title">링크저장소</h2>
          <Link to="/CategoryPage" className="mp-more">더보기</Link>
        </div>
        <div className="mp-link-category-container">
          {displayCategories.map(cat => (
            <Link
              key={cat.id}
              to={`/CategoryPage/${cat.id}`}
              className="mp-link-category-box"
            >
              <div className="mp-link-count">{cat.count}</div>
              <div className="mp-category-name">{cat.name}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mp-recent-links-section">
        <h2 className="mp-section-title">최근 열람한 링크</h2>
        <div className="mp-recent-links-boxes">
          {recentLinks.map(link => (
            <div key={link.id} className="mp-recent-box">
              <div onClick={handleOpen} target="_blank" rel="noopener noreferrer">
                <img src={link.thumbnail} alt={link.title} />
                <div>{link.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
