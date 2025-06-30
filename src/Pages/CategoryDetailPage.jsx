import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { categories } from './MainPage';

const CategoryDetailPage = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const category = categories.find(c => c.id === categoryId);

  const handleGoBack = () => {
    navigate(-1);
  }

  if (!category) {
    return (
      <div className="cdp-no-category-wrapper">
        <div className='cdp-no-category'>존재하지 않는 카테고리입니다.</div>
        <button className='cdp-no-category-button' onClick={handleGoBack}>돌아가기</button>
      </div>
    );
  }

  const { name: categoryName, count: boxCount } = category;

  return (
    <div className="cdp-wrapper">
      <div className="cdp-header">
        <div className="cdp-header-title" onClick={handleGoBack}>
          {categoryName} &gt;
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
          />
        </div>
      </div>
      <div className="cdp-linkbox-container">
        {boxCount > 0 ? (
          Array.from({ length: boxCount }).map((_, idx) => (
            <div key={idx} className="cdp-linkbox">{/* 링크 프리뷰 추가및 각각 다른 링크 배열로 추가 */}</div>
          ))
        ) : (
          <div className="cdp-no-links">저장된 링크가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default CategoryDetailPage;
