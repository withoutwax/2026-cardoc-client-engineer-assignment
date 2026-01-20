import { useFragment, graphql } from "react-relay";
import type { RepositoryItem_repository$key } from "./__generated__/RepositoryItem_repository.graphql";
import { useBookmarks } from "../hooks/useBookmarks";

interface Props {
  repository: RepositoryItem_repository$key;
}

const RepositoryItemFragment = graphql`
  fragment RepositoryItem_repository on Repository {
    id
    name
    description
    stargazerCount
    forkCount
    url
    owner {
      login
    }
    primaryLanguage {
      name
      color
    }
  }
`;

const RepositoryItem: React.FC<Props> = ({ repository }) => {
  const data = useFragment(RepositoryItemFragment, repository);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(data.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleBookmark({
      id: data.id,
      name: data.name,
      owner: data.owner.login,
      description: data.description,
      url: data.url,
    });
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg transition-shadow mb-4">
      <div className="flex justify-between items-start">
        <a
          href={data.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xl font-semibold text-blue-600 hover:underline"
        >
          {data.name}
        </a>
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <button
            onClick={handleBookmarkClick}
            className={`flex items-center gap-1 p-2 rounded-full transition-colors cursor-pointer ${
              bookmarked
                ? "text-yellow-500 hover:bg-yellow-50"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            }`}
            aria-label={bookmarked ? "Unbookmark" : "Bookmark"}
          >
            {bookmarked ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-6"
              >
                <path
                  fillRule="evenodd"
                  d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"
                />
              </svg>
            )}
            <span>북마크</span>
          </button>
          <span className="flex items-center">⭐ {data.stargazerCount}</span>
          <span className="flex items-center">🍴 {data.forkCount}</span>
        </div>
      </div>
      <p className="mt-2 text-gray-700">{data.description}</p>

      <div className="mt-3 flex items-center justify-between">
        {data.primaryLanguage && (
          <div className="flex items-center">
            <span
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: data.primaryLanguage.color || "#ccc" }}
            ></span>
            <span className="text-sm text-gray-500">
              {data.primaryLanguage.name}
            </span>
          </div>
        )}
        <span className="text-sm text-gray-400">Owner: {data.owner.login}</span>
      </div>
    </div>
  );
};

export default RepositoryItem;
