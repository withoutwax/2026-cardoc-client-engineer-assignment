import { useState, useEffect } from "react";

// 북마크에 저장할 데이터 타입 정의
export interface BookmarkedRepo {
  id: string;
  name: string;
  owner: string;
  description?: string | null;
  url: string;
}

const STORAGE_KEY = "cardoc_bookmarks";

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<BookmarkedRepo[]>(() => {
    // 초기화 시 Local Storage에서 데이터 읽기 (Lazy Initialization)
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse bookmarks from local storage", e);
      return [];
    }
  });

  // bookmarks 상태가 변경될 때마다 Local Storage에 동기화
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error("Failed to save bookmarks to local storage", e);
    }
  }, [bookmarks]);

  // 북마크 추가
  const addBookmark = (repo: BookmarkedRepo) => {
    setBookmarks((prev) => {
      if (prev.some((item) => item.id === repo.id)) return prev;
      return [...prev, repo];
    });
  };

  // 북마크 삭제
  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
  };

  // 북마크 여부 확인
  const isBookmarked = (id: string) => {
    return bookmarks.some((item) => item.id === id);
  };

  // 북마크 토글
  const toggleBookmark = (repo: BookmarkedRepo) => {
    if (isBookmarked(repo.id)) {
      removeBookmark(repo.id);
    } else {
      addBookmark(repo);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
};
