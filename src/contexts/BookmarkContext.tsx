import React, { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";

export interface BookmarkedRepo {
  id: string;
  name: string;
  owner: string;
  description?: string | null;
  url: string;
}

interface BookmarkContextType {
  bookmarks: BookmarkedRepo[];
  addBookmark: (repo: BookmarkedRepo) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
  toggleBookmark: (repo: BookmarkedRepo) => void;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "cardoc_bookmarks";

export const BookmarkProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedRepo[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse bookmarks from local storage", e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    } catch (e) {
      console.error("Failed to save bookmarks to local storage", e);
    }
  }, [bookmarks]);

  const addBookmark = (repo: BookmarkedRepo) => {
    setBookmarks((prev) => {
      if (prev.some((item) => item.id === repo.id)) return prev;
      return [...prev, repo];
    });
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((item) => item.id !== id));
  };

  const isBookmarked = (id: string) => {
    return bookmarks.some((item) => item.id === id);
  };

  const toggleBookmark = (repo: BookmarkedRepo) => {
    if (isBookmarked(repo.id)) {
      removeBookmark(repo.id);
    } else {
      addBookmark(repo);
    }
  };

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        addBookmark,
        removeBookmark,
        isBookmarked,
        toggleBookmark,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarkContext = () => {
  const context = useContext(BookmarkContext);
  if (context === undefined) {
    throw new Error(
      "useBookmarkContext must be used within a BookmarkProvider",
    );
  }
  return context;
};
