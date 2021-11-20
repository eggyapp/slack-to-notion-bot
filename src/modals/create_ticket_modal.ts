import { PlainTextOption, ViewsUpdateArguments } from "@slack/web-api";
import { Option } from "../../lib/notion/ticket/ticket_properties";
import { CallbackId } from "../common/constants";
import { CreateTicketPayload, ModalPayload } from "./payload";

export const CreateTicketModalId = (() => {
  const titleBlock = "block_ticket_title";
  const statusBlock = "block_ticket_status";
  const typeBlock = "block_ticket_type";
  const categoryBlock = "block_ticket_category";
  const projectBlock = "block_ticket_project";
  const usersBlock = "block_ticket_users";
  const usersCCBlock = "block_ticket_users_cc";
  const descriptionBlock = "block_ticket_description";

  const titleInput = "input_ticket_title";
  const statusInput = "input_ticket_status";
  const typeInput = "input_ticket_type";
  const categoryInput = "input_ticket_category";
  const projectInput = "input_ticket_project";
  const usersInput = "input_ticket_users";
  const usersCCInput = "input_ticket_users_cc";
  const descriptionInput = "input_ticket_description";

  return {
    // Blocks
    titleBlock,
    statusBlock,
    typeBlock,
    categoryBlock,
    projectBlock,
    usersBlock,
    usersCCBlock,
    descBlock: descriptionBlock,

    // Inputs
    titleInput,
    statusInput,
    typeInput,
    categoryInput,
    projectInput,
    usersInput,
    usersCCInput,
    descInput: descriptionInput,
  };
})();

const propsToSlackOption = (option: Option): PlainTextOption => {
  return {
    text: {
      type: "plain_text",
      text: option.name ?? "",
      emoji: true,
    },
    value: option.id,
  };
};

export const createTicketModal = (
  viewId: string,
  payload: CreateTicketPayload
): ViewsUpdateArguments => {
  const statusOptions: PlainTextOption[] = payload.ticketProps.status.map(propsToSlackOption);
  const projectOptions: PlainTextOption[] = payload.ticketProps.project.map(propsToSlackOption);
  const typeOptions: PlainTextOption[] = payload.ticketProps.type.map(propsToSlackOption);
  const categoryOptions: PlainTextOption[] = payload.ticketProps.categories.map(propsToSlackOption);

  return {
    view_id: viewId,

    view: {
      type: "modal",
      callback_id: CallbackId.createTicketModal,

      // Inject [channelId] and [messageTimeStamp] as the modal payload to be retrieved on submission
      private_metadata: ModalPayload.metadataToString({
        channelId: payload.channelId,
        messageTimestamp: payload.messageTimestamp,
      }),

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
            initial_value: payload.title,
            placeholder: {
              type: "plain_text",
              text: "Write a descriptive title",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "Ticket Title",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: CreateTicketModalId.statusBlock,
          element: {
            type: "static_select",
            action_id: CreateTicketModalId.statusInput,
            placeholder: {
              type: "plain_text",
              text: "Select ticket status",
              emoji: true,
            },
            options: statusOptions,
          },
          label: {
            type: "plain_text",
            text: "Status",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: CreateTicketModalId.typeBlock,
          element: {
            type: "static_select",
            action_id: CreateTicketModalId.typeInput,
            placeholder: {
              type: "plain_text",
              text: "Select ticket type",
              emoji: true,
            },
            options: typeOptions,
          },
          label: {
            type: "plain_text",
            text: "Type",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: CreateTicketModalId.categoryBlock,
          element: {
            type: "multi_static_select",
            action_id: CreateTicketModalId.categoryInput,
            placeholder: {
              type: "plain_text",
              text: "Select categories",
              emoji: true,
            },
            options: categoryOptions,
          },
          label: {
            type: "plain_text",
            text: "Categories",
            emoji: true,
          },
        },
        {
          type: "input",
          block_id: CreateTicketModalId.projectBlock,
          element: {
            type: "static_select",
            action_id: CreateTicketModalId.projectInput,
            placeholder: {
              type: "plain_text",
              text: "Select project",
              emoji: true,
            },
            options: projectOptions,
          },
          label: {
            type: "plain_text",
            text: "Project In Progress",
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
          block_id: CreateTicketModalId.usersCCBlock,
          optional: true,
          element: {
            type: "multi_users_select",
            action_id: CreateTicketModalId.usersCCInput,
            placeholder: {
              type: "plain_text",
              text: "Select users",
              emoji: true,
            },
          },
          label: {
            type: "plain_text",
            text: "CC",
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
            initial_value: payload.messageUrl,
          },
          label: {
            type: "plain_text",
            text: "Description",
            emoji: true,
          },
        },
      ],
    },
  };
};
