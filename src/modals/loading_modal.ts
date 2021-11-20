import { ViewsOpenArguments } from "@slack/web-api";

export const loadingModal = (triggerId: string): ViewsOpenArguments => {
  return {
    trigger_id: triggerId,
    view: {
      type: "modal",
      title: {
        type: "plain_text",
        text: "Create a new ticket",
      },
      close: {
        type: "plain_text",
        text: "Cancel",
      },
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: ":party_parrot: Loading",
            emoji: true,
          },
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Please ignore any errors, the bot is just slow... :turtle:",
            emoji: true,
          },
        },
        {
          type: "context",
          elements: [
            {
              type: "plain_text",
              text: "Slack just can't cut this bot some slack :unamused:",
              emoji: true,
            },
          ],
        },
      ],
    },
  };
};
