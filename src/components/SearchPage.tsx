import React, { useState, Suspense } from "react";
import { useLazyLoadQuery, usePaginationFragment, graphql } from "react-relay";
import { useSearchParams } from "react-router-dom";
import RepositoryItem from "./RepositoryItem";
import type { SearchPageQuery } from "./__generated__/SearchPageQuery.graphql";
import type { SearchPagePaginationQuery } from "./__generated__/SearchPagePaginationQuery.graphql";
import type { SearchPage_query$key } from "./__generated__/SearchPage_query.graphql";

// Main Search Page Component
const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryTerm = searchParams.get("q") || "react";
  const [inputValue, setInputValue] = useState(queryTerm);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: inputValue });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        GitHub Repository Search
      </h1>

      <form onSubmit={handleSearch} className="mb-8 flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search for repositories..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <SearchResults queryTerm={queryTerm} />
      </Suspense>
    </div>
  );
};

// Fragment for Pagination
const SearchResultsFragment = graphql`
  fragment SearchPage_query on Query
  @argumentDefinitions(
    count: { type: "Int", defaultValue: 10 }
    cursor: { type: "String" }
    query: { type: "String!" }
  )
  @refetchable(queryName: "SearchPagePaginationQuery") {
    search(query: $query, type: REPOSITORY, first: $count, after: $cursor)
      @connection(key: "SearchPage_search") {
      edges {
        node {
          ... on Repository {
            id
            ...RepositoryItem_repository
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const SearchResultsQuery = graphql`
  query SearchPageQuery($query: String!) {
    ...SearchPage_query @arguments(query: $query)
  }
`;

// Component that holds the query and pagination
const SearchResults: React.FC<{ queryTerm: string }> = ({ queryTerm }) => {
  const data = useLazyLoadQuery<SearchPageQuery>(SearchResultsQuery, {
    query: queryTerm,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    data: searchData,
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<SearchPagePaginationQuery, SearchPage_query$key>(
    SearchResultsFragment,
    data,
  );

  const edges = searchData.search.edges || [];

  if (edges.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No results found for "{queryTerm}"
      </p>
    );
  }

  return (
    <div>
      {edges.map((edge) => {
        if (!edge || !edge.node) return null;
        return <RepositoryItem key={edge.node.id} repository={edge.node} />;
      })}

      {hasNext && (
        <div className="mt-8 text-center">
          <button
            onClick={() => loadNext(10)}
            disabled={isLoadingNext}
            className="bg-gray-100 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-200 transition disabled:opacity-50"
          >
            {isLoadingNext ? "Loading more..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
