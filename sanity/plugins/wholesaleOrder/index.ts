import { definePlugin } from "sanity";

import { SendQuoteAction } from "./sendQuoteAction";

export const wholesaleOrderPlugin = definePlugin({
  name: "wholesale-order-tools",
  document: {
    actions: (previousActions, context) => {
      if (context.schemaType !== "wholesaleOrder") {
        return previousActions;
      }

      return [...previousActions, SendQuoteAction];
    },
  },
});
