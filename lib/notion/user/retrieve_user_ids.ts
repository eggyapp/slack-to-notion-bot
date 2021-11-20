import { NotionDb } from "../db/db";
import { NotionClient } from "../notion";

/// Retrieve a map of Notion User IDs by their Slack User ID
export const notionUserIdBySlackId = async (): Promise<Map<string, string>> => {
  const userDb = await NotionClient.databases.query({
    database_id: NotionDb.userDatabaseId(),
  });

  const notionIds: string[] = [];
  const slackIds: string[] = [];

  // Retrieve a list of Notion ID and Slack ID
  userDb.results.forEach((page) => {
    const props = page.properties;

    // @ts-ignore
    if (props.User.type == "people") {
      props.User.people.forEach((user) => notionIds.push(user.id));
    }

    if (props.SlackID.type == "rich_text") {
      props.SlackID.rich_text.forEach((slackId) => slackIds.push(slackId.plain_text));
    }
  });

  // Combine the two lists into a single map (SlackID:NotionID)
  const result = new Map();
  for (let i = 0; i < slackIds.length; i++) {
    result.set(slackIds[i], notionIds[i]);
  }

  return result;
};
