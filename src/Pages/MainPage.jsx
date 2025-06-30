import React from 'react';
import { Link } from 'react-router-dom';

export const categories = [
  { id: 'all',     name: '전체', count: 32 },
  { id: 'plants',  name: '식물', count: 8  },
  { id: 'it',      name: 'IT',   count: 8  },
  { id: 'cooking', name: '요리', count: 14 },
  { id: 'music',   name: '음악', count: 0  },
];

const MainPage = () => {

  // 링크저장수가 많은 순서로 배열하여 상위 4가지 카테고리 출력
  const getTopCategories = (cats, zeroCountLimit = 2, nonZeroLimit = 3) => {
    if (cats.every(({ count }) => count === 0)) {
      return cats.slice(0, zeroCountLimit);
    }

    const allCat = cats.find(({ id }) => id === 'all');
    const others = cats
      .filter(({ id }) => id !== 'all')
      .sort((a, b) => b.count - a.count)
      .slice(0, nonZeroLimit);

    return [allCat, ...others];
  };

const topCategories = getTopCategories(categories);


  return (
    <div className="mp-wrapper">
      <div className="mp-top-container">
        <div className="mp-top-content">
          <div className="mp-greeting-text">
            <div className="mp-user-name">User님</div>
            <div className="mp-saved-links">
              <span className="mp-highlight">저장해둔 18개의 링크</span>를
            </div>
            <div className="mp-message">잊지않고 열어보셨네요 !</div>
          </div>
          <div className="mp-icon-container">
            <img
              src="/assets/imgs/Chain-img.png"
              alt="메뉴 아이콘"
              className="mp-icon"
            />
          </div>
        </div>
        <div className="mp-input-container">
          <input type="text" className="mp-link-input" />
          <button className="mp-save-button">저장하기</button>
        </div>
      </div>

      <div className="mp-link-storage-section">
        <div className="mp-section-header">
          <h2 className="mp-section-title">링크저장소</h2>
          <Link className="mp-more" to="/CategoryPage">
            더보기
          </Link>
        </div>
        <div className="mp-link-category-container">
          {topCategories.map(cat => (
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
        <h2 className="mp-section-title">최근 열어본 링크</h2>
        <div className="mp-recent-links-boxes">
          {/* 최근 클릭한 링크를 db에 저장하고 불러오는 코드 추가 필요 */}
          {/* 추가할때 로고도 나타낼 수 있는 방법이 있는지 찾을 것 */}
          <div className="mp-recent-box"></div>
          <div className="mp-recent-box"></div>
          <div className="mp-recent-box"></div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
