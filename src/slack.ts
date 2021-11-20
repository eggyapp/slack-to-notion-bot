/// Configure the project to load .env file
import * as dotenv from "dotenv";
dotenv.config();

import { App, AwsLambdaReceiver } from "@slack/bolt";
import { Callback, Context } from "aws-lambda/handler";
import { Notion } from "../lib/notion/notion";
import { CallbackId, Command } from "./common/constants";
import { createTicketModal, CreateTicketModalId } from "./modals/create_ticket_modal";
import { ModalPayload } from "./modals/payload";
import { loadingModal } from "./modals/loading_modal";

export const awsLambdaReceiver = new AwsLambdaReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET ?? "",
});

const notion = Notion();
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  clientId: process.env.SLACK_CLIENT_ID,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  receiver: awsLambdaReceiver,
  // The `processBeforeResponse` option is required for all FaaS environments.
  // It allows Bolt methods (e.g. `app.message`) to handle a Slack request
  // before the Bolt framework responds to the request (e.g. `ack()`). This is
  // important because FaaS immediately terminate handlers after the response.
  processBeforeResponse: true,

  // Socket mode with the App token is useful for testing locally without any tools.
  // socketMode: true,
  // appToken: process.env.SLACK_SOCKET_TOKEN,
});

app.command(Command.userIds, async ({ ack, say, client, context }) => {
  await ack();

  const users = await client.users.list({ token: context.botToken });

  const msg = users.members
    ?.filter((user) => !user.is_bot && !user.deleted && user.id != "USLACKBOT")
    .map((user) => `*${user.real_name}* - ${user.profile?.email} - _${user.id}_`)
    .join("\n");

  await say(msg ?? "Unable to retrieve users");
});

app.shortcut(CallbackId.createTicket, async ({ body, ack, client }) => {
  await ack();

  if (body.type == "message_action") {
    const modal1 = await client.views.open(loadingModal(body.trigger_id));

    const viewId = modal1.view?.id;

    const permalink = await app.client.chat.getPermalink({
      channel: body.channel.id,
      message_ts: body.message.ts,
    });

    const ticketProps = await notion.ticketProperties();

    await client.views.update(
      createTicketModal(viewId ?? "", {
        title: body.message.text ?? "",
        messageUrl: permalink.permalink ?? "",
        messageTimestamp: body.message_ts,
        channelId: body.channel.id,
        ticketProps: ticketProps,
      })
    );
  }
});

app.view(CallbackId.createTicketModal, async ({ ack, view, client, context }) => {
  await ack();
  console.log("Modal submitted");

  const title = view.state.values[CreateTicketModalId.titleBlock][CreateTicketModalId.titleInput];
  const status =
    view.state.values[CreateTicketModalId.statusBlock][CreateTicketModalId.statusInput];
  const type = view.state.values[CreateTicketModalId.typeBlock][CreateTicketModalId.typeInput];
  const category =
    view.state.values[CreateTicketModalId.categoryBlock][CreateTicketModalId.categoryInput];
  const project =
    view.state.values[CreateTicketModalId.projectBlock][CreateTicketModalId.projectInput];
  const users = view.state.values[CreateTicketModalId.usersBlock][CreateTicketModalId.usersInput];
  const cc = view.state.values[CreateTicketModalId.usersCCBlock][CreateTicketModalId.usersCCBlock];
  const desc = view.state.values[CreateTicketModalId.descBlock][CreateTicketModalId.descInput];

  const metadata = ModalPayload.stringToMetadata(view.private_metadata);

  try {
    const ticketBotId = context.botId ?? "";
    const reaction = "white_check_mark";

    const reactions = await client.reactions.get({
      token: context.botToken,
      channel: metadata?.channelId,
      timestamp: metadata?.messageTimestamp,
      full: true,
    });

    const hasReacted = reactions.message?.reactions?.filter(
      (r) => r.name == reaction && r.users?.includes(ticketBotId)
    );

    // GUARD
    if (hasReacted) {
      return;
    }

    const ticketURL = await notion.createTicket({
      title: title.value ?? "",
      status: status.selected_option?.value ?? "",
      type: type.selected_option?.value ?? "",
      categories: category.selected_options?.map((option) => option.value) ?? [],
      project: project.selected_option?.value ?? "",
      users: users?.selected_users ?? [],
      cc: cc?.selected_users ?? [],
      desc: desc.value ?? "",
      designs: "",
    });

    await client.reactions.add({
      token: context.botToken,
      name: reaction,
      channel: metadata?.channelId,
      timestamp: metadata?.messageTimestamp,
    });

    await client.chat.postMessage({
      token: context.botToken,
      channel: metadata?.channelId ?? "",
      thread_ts: metadata?.messageTimestamp,
      text: ticketURL,
    });
  } catch (e) {
    console.error(e);
  }
});

export const handler = async (event: any, context: Context, callback: Callback): Promise<any> => {
  const handler = await awsLambdaReceiver.start();

  return handler(event, context, callback);
};
