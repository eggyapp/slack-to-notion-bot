export class NotionDb {
  static token(): string {
    return process.env.NOTION_TOKEN ?? "";
  }

  static ticketDatabaseId(): string {
    return process.env.NOTION_TICKET_DATABASE_ID ?? "";
  }

  static userDatabaseId(): string {
    return process.env.NOTION_USER_DATABASE_ID ?? "";
  }

  static projectDatabaseId(): string {
    return process.env.NOTION_PROJECT_DATABASE_ID ?? "";
  }
}
