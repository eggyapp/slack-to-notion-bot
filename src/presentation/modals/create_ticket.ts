import { ViewsOpenArguments } from "@slack/web-api";
import { CallbackId } from "../../constants/constants";

export const CreateTicketModalId = (() => {
  const titleBlock = "block_ticket_title";
  const categoryBlock = "block_ticket_category";
  const usersBlock = "block_ticket_users";
  const descriptionBlock = "block_ticket_description";

  const titleInput = "input_ticket_title";
  const categoryInput = "input_ticket_category";
  const usersInput = "input_ticket_users";
  const descriptionInput = "input_ticket_description";

  return {
    titleBlock,
    categoryBlock,
    usersBlock,
    descBlock: descriptionBlock,
    titleInput,
    categoryInput,
    usersInput,
    descInput: descriptionInput,
  };
})();

export const createTicketModal = (triggerId: string): ViewsOpenArguments => {
  return {
    // Pass a valid trigger_id within 3 seconds of receiving it
    trigger_id: triggerId,

    // View payload
    view: {
      type: "modal",
      // View identifier
      callback_id: CallbackId.createTicketModal,
      title: {
        type: "plain_text",
        text: "Create a new ticket",
      },
      submit: {
        type: "plain_text",
        text: "Create ticket",
        emoji: true,
      },
      blocks: [
        {
          type: "input",
          block_id: CreateTicketModalId.titleBlock,
          element: {
            type: "plain_text_input",
            action_id: CreateTicketModalId.titleInput,
            placeholder: {
              type: "plain_text",
              text: "Write a descriptive title",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "Ticket title",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: CreateTicketModalId.categoryBlock,
          element: {
            type: "static_select",
            action_id: CreateTicketModalId.categoryInput,
            placeholder: {
              type: "plain_text",
              text: "Select category",
              emoji: true,
            },
            options: [
              {
                text: {
                  type: "plain_text",
                  text: "dev",
                  emoji: true,
                },
                value: "dev",
              },
              {
                text: {
                  type: "plain_text",
                  text: "design",
                  emoji: true,
                },
                value: "design",
              },
              {
                text: {
                  type: "plain_text",
                  text: "product",
                  emoji: true,
                },
                value: "product",
              },
            ],
          },
          label: {
            type: "plain_text",
            text: "Category",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: CreateTicketModalId.usersBlock,
          element: {
            type: "multi_users_select",
            action_id: CreateTicketModalId.usersInput,
            placeholder: {
              type: "plain_text",
              text: "Select users",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "Assign to",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: CreateTicketModalId.descBlock,
          optional: true,
          element: {
            action_id: CreateTicketModalId.descInput,
            type: "plain_text_input",
            multiline: true,
          },
          label: {
            type: "plain_text",
            text: "Description (optional)",
            emoji: true,
          },
        },
      ],
    },
  };
};
