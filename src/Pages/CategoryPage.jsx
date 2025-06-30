import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { categories as initCats } from '../utils/categories';
import api from '../utils/api';
import { Spinner } from '../Components';

const CategoryPage = () => {
  const { category: paramCat } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAndCount = async () => {
      try {
        const res = await api.get('/links');
        const allLinks = res.data;

        // 링크별 카테고리 개수 계산
        const counts = allLinks.reduce((acc, { category }) => {
          const key = category || 'etc';
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});

        const updatedCats = [
          { id: 'all', name: '전체', count: allLinks.length },
          ...initCats.map(cat => ({
            ...cat,
            count: counts[cat.name] || 0,
          })),
        ];

        const dedupedCats = [];
        const seenIds = new Set();
        updatedCats.forEach(cat => {
          if (!seenIds.has(cat.id)) {
            seenIds.add(cat.id);
            dedupedCats.push(cat);
          }
        });

        // 최종 상태 업데이트
        setCategories(dedupedCats);
        console.log('CategoryPage 링크 개수 로드 성공', dedupedCats);
      } catch (err) {
        console.error('CategoryPage 링크 개수 로드 실패', err);
        const fallback = [
          { id: 'all', name: '전체', count: 0 },
          ...initCats.map(cat => ({ ...cat, count: 0 })),
        ];
        const dedupedFallback = [];
        const seenIds = new Set();
        fallback.forEach(cat => {
          if (!seenIds.has(cat.id)) {
            seenIds.add(cat.id);
            dedupedFallback.push(cat);
          }
        });
        setCategories(dedupedFallback);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndCount();
  }, []);

  const filtered = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <Spinner />;

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
        {filtered.map(cat => (
          <Link
            key={cat.id}
            to={`/CategoryPage/${cat.id}`}
            className={`lsp-category-box ${
              paramCat === cat.id ? 'active' : ''
            }`}
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
