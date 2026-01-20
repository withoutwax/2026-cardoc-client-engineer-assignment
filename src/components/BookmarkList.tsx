import { useBookmarks } from "../hooks/useBookmarks";

const BookmarkList = () => {
  const { bookmarks, removeBookmark } = useBookmarks();

  if (bookmarks.length === 0) return null;

  return (
    <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-gray-800">📂 My Bookmarks</h2>
      <ul className="space-y-2">
        {bookmarks.map((repo) => (
          <li
            key={repo.id}
            className="flex justify-between items-center bg-white p-3 rounded shadow-sm border border-gray-100"
          >
            <a
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              {repo.owner} / {repo.name}
            </a>
            <button
              onClick={() => removeBookmark(repo.id)}
              className="text-red-500 text-sm hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookmarkList;
