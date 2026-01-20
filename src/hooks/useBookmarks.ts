import { useBookmarkContext } from "../contexts/BookmarkContext";
export type { BookmarkedRepo } from "../contexts/BookmarkContext";

export const useBookmarks = () => {
  return useBookmarkContext();
};
