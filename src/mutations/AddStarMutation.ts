import { graphql, commitMutation } from "react-relay";
import type { Environment, RecordSourceSelectorProxy } from "relay-runtime";

const mutation = graphql`
  mutation AddStarMutation($input: AddStarInput!) {
    addStar(input: $input) {
      starrable {
        id
        viewerHasStarred
        stargazerCount
      }
    }
  }
`;

export function commitAddStar(
  environment: Environment,
  starrableId: string,
  currentStargazerCount: number,
) {
  return commitMutation(environment, {
    mutation,
    variables: {
      input: { starrableId },
    },
    optimisticUpdater: (store: RecordSourceSelectorProxy) => {
      const node = store.get(starrableId);
      if (node) {
        node.setValue(true, "viewerHasStarred");
        node.setValue(currentStargazerCount + 1, "stargazerCount");
      }
    },
    onCompleted: (response, errors) => {
      if (errors) {
        console.error("AddStarMutation errors:", errors);
      } else {
        console.log("AddStarMutation success:", response);
      }
    },
    onError: (err) => {
      console.error("AddStarMutation failed:", err);
    },
  });
}
