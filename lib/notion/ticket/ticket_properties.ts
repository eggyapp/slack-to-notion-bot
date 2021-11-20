import { NotionDb } from "../db/db";
import { NotionClient } from "../notion";

export interface TicketProperties {
  status: Option[];
  project: Option[];
  categories: Option[];
  type: Option[];
}

export interface Option {
  id?: string;
  name?: string;
}

/// Retrieves all the properties of the ticket in the Notion database
export const notionTicketProperties = async (): Promise<TicketProperties> => {
  const ticketDb = await NotionClient.databases.retrieve({
    database_id: NotionDb.ticketDatabaseId(),
  });

  const projectDb = await NotionClient.databases.query({
    database_id: NotionDb.projectDatabaseId(),
  });

  const status: Option[] = [];
  const project: Option[] = [];
  const categories: Option[] = [];
  const type: Option[] = [];

  // @ts-ignore
  if (ticketDb.properties.Status.type == "select") {
    ticketDb.properties.Status.select.options.forEach((option) => {
      //   console.log(`Status: ${option.name}`);
      status.push({ id: option.id, name: option.name });
    });
  }

  if (ticketDb.properties.Type.type == "select") {
    ticketDb.properties.Type.select.options.forEach((option) => {
      //   console.log(`Type: ${option.name}`);
      type.push({ id: option.id, name: option.name });
    });
  }

  if (ticketDb.properties.Categories.type == "multi_select") {
    ticketDb.properties.Categories.multi_select.options.forEach((option) => {
      //   console.log(`Category: ${option.name}`);
      categories.push({ id: option.id, name: option.name });
    });
  }

  projectDb.results
    .filter((page) => {
      if (
        page.properties.Status.type == "select" &&
        page.properties.Status.select?.name == "In Progress"
      ) {
        return true;
      }
      return false;
    })
    .forEach((page) => {
      if (page.properties.Name.type == "title") {
        //   console.log(`Project: ${page.properties.Name.title.map((e) => e.plain_text)[0]}`);
        project.push({
          id: page.id,
          name: page.properties.Name.title.map((e) => e.plain_text)[0],
        });
      }
    });

  return {
    status: status,
    project: project,
    categories: categories,
    type: type,
  };
};
