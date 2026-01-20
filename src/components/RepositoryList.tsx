import React from "react";
import RepositoryItem from "./RepositoryItem";

const RepositoryList: React.FC<{ repositories: any[] }> = ({
  repositories,
}) => {
  if (repositories.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-8">
        No repositories found.
      </div>
    );
  }

  return (
    <div className="mt-6">
      {repositories.map((repo) => (
        <RepositoryItem key={repo.id} repository={repo} />
      ))}
    </div>
  );
};

export default RepositoryList;
