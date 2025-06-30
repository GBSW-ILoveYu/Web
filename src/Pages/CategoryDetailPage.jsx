import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { Spinner } from "../Components";
import { categories as initCats } from "../utils/categories";

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [popupFor, setPopupFor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);

  const categoryObj =
    categoryId === 'all'
      ? { id: 'all', name: '전체' }
      : initCats.find(cat => cat.id === categoryId) || { id: categoryId, name: categoryId };

  // 외부 클릭 시 팝업 닫기
  useEffect(() => {
    const handleClickOutside = ({ target }) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        !target.closest('.cdp-ellipsis')
      ) {
        setPopupFor(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 카테고리 조회 
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        let response;
        if (categoryId === 'all') {
          response = await api.get('/links');
        } else if (categoryId === 'etc') {
          response = await api.get('/links');
        } else {
          response = await api.get('/links', { params: { category: categoryObj.name } });
        }
        const data = response.data;
        const filtered =
          categoryId === 'etc'
            ? data.filter(link => !link.category || link.category === '기타')
            : data;
        setLinks(filtered);
      } catch (err) {
        console.error('CategoryDetailPage 링크 로드 실패', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLinks();
  }, [categoryId, categoryObj.name]);

  const handleOpen = async (id, url) => {
    try {
      await api.get(`/links/${id}`);
      window.open(`https://${url}`, '_blank', 'noopener');
    } catch (err) {
      console.error('링크 열람 기록 저장 실패', err);
    }
  };

  const handleDelete = async id => {
    try {
      await api.delete(`/links/${id}`);
      // 로컬에 즉시 반영
      setLinks(prev => prev.filter(l => l.id !== id));
      setPopupFor(null);
    } catch (err) {
      console.error('링크 삭제 실패', err);
    }
  };

  const handleGoBack = () => navigate(-1);

  if (isLoading) return <Spinner />;

  // 검색어 필터링
  const displayedLinks = links.filter(({ title, url }) =>
    title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="cdp-wrapper">
      <div className="cdp-header">
        <div className="cdp-header-title" onClick={handleGoBack}>
          {categoryObj.name}
          <img
            src="/assets/imgs/Arrow.png"
            alt="뒤로가기"
            className="cdp-header-arrow"
          />
        </div>
      </div>

      <div className="cdp-search-area">
        <div className="cdp-search-input-container">
          <img
            src="/assets/imgs/Search.png"
            alt="검색 아이콘"
            className="cdp-search-icon"
          />
          <input
            type="text"
            className="cdp-search-input"
            placeholder="검색어를 입력하세요."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="cdp-linkbox-container">
        {displayedLinks.length > 0 ? (
          displayedLinks.map(({ id, url, thumbnail, title, description }) => (
            <div
              key={id}
              className="cdp-linkbox"
              onClick={() => handleOpen(id, url)}
            >
              {thumbnail && (
                <img
                  src={thumbnail}
                  alt={title}
                  className="cdp-link-img"
                />
              )}
              <div className="cdp-link-desc">{description || '설명이 없습니다.'}</div>

              <div
                className="cdp-ellipsis-container"
                onClick={e => e.stopPropagation()}
              >
                <div
                  className="cdp-ellipsis"
                  onClick={() => setPopupFor(prev => (prev === id ? null : id))}
                >
                  ⋮
                </div>
                {popupFor === id && (
                  <div className="cdp-popup" ref={popupRef}>
                    <button
                      className="cdp-delete-btn"
                      onClick={e => { e.stopPropagation(); handleDelete(id); }}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="cdp-no-links">저장된 링크가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
