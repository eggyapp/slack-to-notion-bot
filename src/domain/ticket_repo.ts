export type TicketData = {
  title: string;
  category: string;
  users: string[];
  desc: string | null;
};

export interface TicketRepo {
  // Creates a ticket and returns the ID of the created ticket
  createTicket(data: TicketData, threadUrl: string): Promise<string>;
}
