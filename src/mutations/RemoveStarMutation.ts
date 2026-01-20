import { graphql, commitMutation } from "react-relay";
import type { Environment, RecordSourceSelectorProxy } from "relay-runtime";

const mutation = graphql`
  mutation RemoveStarMutation($input: RemoveStarInput!) {
    removeStar(input: $input) {
      starrable {
        id
        viewerHasStarred
        stargazerCount
      }
    }
  }
`;

export function commitRemoveStar(
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
        node.setValue(false, "viewerHasStarred");
        node.setValue(currentStargazerCount - 1, "stargazerCount");
      }
    },
    onCompleted: (response, errors) => {
      if (errors) {
        console.error("RemoveStarMutation errors:", errors);
      } else {
        console.log("RemoveStarMutation success:", response);
      }
    },
    onError: (err) => {
      console.error("RemoveStarMutation failed:", err);
    },
  });
}
