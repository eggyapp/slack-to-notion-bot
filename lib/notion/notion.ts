import { Client } from "@notionhq/client/build/src";
import { NotionDb } from "./db/db";
import { createNotionTicket } from "./ticket/create_ticket";
import { notionTicketProperties, TicketProperties } from "./ticket/ticket_properties";
import { TicketData } from "./types/ticket";
import { notionUserIdBySlackId } from "./user/retrieve_user_ids";

export const NotionClient = new Client({ auth: NotionDb.token() });

interface NotionInterface {
  createTicket(data: TicketData): Promise<string>;

  ticketProperties(): Promise<TicketProperties>;

  userIdsBySlackIds(): Promise<Map<string, string>>;
}

export const Notion: () => NotionInterface = () => {
  return {
    createTicket: createNotionTicket,
    ticketProperties: notionTicketProperties,
    userIdsBySlackIds: notionUserIdBySlackId,
  };
};
