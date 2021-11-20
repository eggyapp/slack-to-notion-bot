import { PersonUser, SelectOption } from "@notionhq/client/build/src/api-types";
import { NotionDb } from "../db/db";

import { NotionClient } from "../notion";
import { TicketData } from "../types/ticket";
import { notionUserIdBySlackId } from "../user/retrieve_user_ids";

/// Creates a ticket in Notion and returns the URL of the ticket
export const createNotionTicket = async (data: TicketData): Promise<string> => {
  const userIdBySlackId = await notionUserIdBySlackId();

  const result = await NotionClient.pages.create({
    parent: { database_id: NotionDb.ticketDatabaseId() },
    properties: {
      // @ts-ignore
      Title: {
        title: [
          {
            type: "text",
            text: {
              content: data.title,
            },
          },
        ],
      },
      // @ts-ignore
      Status: {
        select: { id: data.status },
      },
      // @ts-ignore
      Type: {
        select: { id: data.type },
      },
      // @ts-ignore
      Categories: {
        multi_select: data.categories.map<SelectOption>((category) => {
          return { id: category };
        }),
      },
      // @ts-ignore
      Project: {
        // @ts-ignore
        relation: [
          {
            id: data.project,
            database_id: data.project,
          },
        ],
      },
      // @ts-ignore
      // TODO: Map the Slack user ID to Notion user (maybe hardcode them?)
      "Assigned to": {
        people: data.users.map<PersonUser>((userId) => {
          return { id: userIdBySlackId.get(userId) } as PersonUser;
        }),
      },
      // @ts-ignore
      CC: {
        people: data.users.map<PersonUser>((userId) => {
          return { id: userIdBySlackId.get(userId) } as PersonUser;
        }),
      },
    },
    children: [
      {
        type: "paragraph",
        paragraph: {
          text: [
            // @ts-ignore
            {
              type: "text",
              text: {
                content: data.desc ?? "",
              },
            },
          ],
        },
      },
    ],
  });

  return result.url;
};
