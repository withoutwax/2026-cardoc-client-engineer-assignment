import { useFragment, graphql } from "react-relay";
import type { RepositoryItem_repository$key } from "./__generated__/RepositoryItem_repository.graphql";

interface Props {
  repository: RepositoryItem_repository$key;
}

const RepositoryItemFragment = graphql`
  fragment RepositoryItem_repository on Repository {
    name
    description
    stargazerCount
    forkCount
    url
    primaryLanguage {
      name
      color
    }
  }
`;

const RepositoryItem: React.FC<Props> = ({ repository }) => {
  const data = useFragment(RepositoryItemFragment, repository);

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow mb-4">
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
          <span className="flex items-center">⭐ {data.stargazerCount}</span>
          <span className="flex items-center">🍴 {data.forkCount}</span>
        </div>
      </div>
      <p className="mt-2 text-gray-700">{data.description}</p>

      {data.primaryLanguage && (
        <div className="mt-3 flex items-center">
          <span
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: data.primaryLanguage.color || "#ccc" }}
          ></span>
          <span className="text-sm text-gray-500">
            {data.primaryLanguage.name}
          </span>
        </div>
      )}
    </div>
  );
};

export default RepositoryItem;
