import { TicketData, TicketRepo } from "../domain/ticket_repo";
import { Client } from "@notionhq/client/build/src";
import { PersonUser } from "@notionhq/client/build/src/api-types";

export const notionTicketRepo: () => TicketRepo = () => {
  const client = new Client({ auth: process.env.NOTION_TOKEN });

  return {
    async createTicket(data: TicketData, threadUrl: string): Promise<string> {
      const result = await client.pages.create({
        parent: { database_id: "6779293174084fd2938ff359aeabed15" },
        properties: {
          // @ts-ignore
          Name: {
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
          Name: {
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
          Category: {
            multi_select: [{ name: data.category }],
          },
          // @ts-ignore
          // TODO: Map the Slack user ID to Notion user (maybe hardcode them?)
          "Assigned to": {
            people: data.users.map<PersonUser>((userId) => {
              return { id: userId } as PersonUser;
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
                  plain_text: threadUrl,
                  text: {
                    content: threadUrl,
                    link: { type: "url", url: threadUrl },
                  },
                },
                // @ts-ignore
                {
                  type: "text",
                  text: {
                    content: data.desc ?? 'No description provided',
                  },
                },
              ],
            },
          },
        ],
      });
      return result.id;
    },
  };
};
