import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { categories } from './MainPage';

const CategoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="lsp-wrapper">
      <h1 className="lsp-header">링크저장소</h1>

      <div className="lsp-search-area">
        <div className="lsp-search-input-container">
          <img
            src="/assets/imgs/Search.png"
            alt="검색 아이콘"
            className="lsp-search-icon"
          />
          <input
            type="text"
            className="lsp-search-input"
            placeholder="검색어를 입력하세요."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="lsp-category-container">
        {filteredCategories.map(cat => (
          <Link
            key={cat.id}
            to={`/CategoryPage/${cat.id}`}
            className="lsp-category-box"
          >
            <div className="lsp-category-count">{cat.count}</div>
            <div className="lsp-category-name">{cat.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
