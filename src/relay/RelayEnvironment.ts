import {
  Environment,
  Network,
  RecordSource,
  Store,
  type FetchFunction,
} from "relay-runtime";

const fetchQuery: FetchFunction = async (operation, variables) => {
  const token = import.meta.env.VITE_GITHUB_TOKEN;

  if (!token) {
    throw new Error(
      "VITE_GITHUB_TOKEN is missing. Please check your .env file.",
    );
  }

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: operation.text,
      variables,
    }),
  });

  return await response.json();
};

const environment = new Environment({
  network: Network.create(fetchQuery),
  store: new Store(new RecordSource()),
});

export default environment;
