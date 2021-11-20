export type TicketData = {
  title: string;
  status: string;
  type: string;
  project: string;
  categories: string[];
  users: string[];
  cc: string[];
  designs: string;
  desc: string | null;
};
