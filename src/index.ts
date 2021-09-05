import { App } from "@slack/bolt";
import { CallbackId } from "./constants/constants";
import { createTicketModal, CreateTicketModalId } from "./presentation/modals/create_ticket";
import {notionTicketRepo} from "./data/notion_ticket_repo";
import {TicketData} from "./domain/ticket_repo";

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_SOCKET_TOKEN,
});

app.shortcut(CallbackId.createTicket, async ({ body, ack, client }) => {
  // Acknowledge the action
  await ack();

  // TODO: Include the thread URL somehow
  await client.views.open(createTicketModal(body.trigger_id));
});

app.view(CallbackId.createTicketModal, async ({ ack, body, view, client }) => {
  await ack();
  console.log("Modal submitted");

  const user = body.user.id;

  const title = view.state.values[CreateTicketModalId.titleBlock][CreateTicketModalId.titleInput];
  const category =
    view.state.values[CreateTicketModalId.categoryBlock][CreateTicketModalId.categoryInput];
  const users = view.state.values[CreateTicketModalId.usersBlock][CreateTicketModalId.usersInput];
  const desc = view.state.values[CreateTicketModalId.descBlock][CreateTicketModalId.descInput];

  try {
    const ticketData = {
      title: title.value,
      category: category.selected_option?.value,
      users: users.selected_users,
      desc: desc.value
    } as TicketData;

    // For testing: Sending the payload data through a private message
    // await client.chat.postMessage({
    //   channel: user,
    //   text: `title= ${title.value}\ncategory=${category.selected_option?.value}\nusers=${users.selected_users}\ndesc=${desc.value}`,
    // });

    // TODO: Include the thread URL somehow
    const ticketId = await notionTicketRepo().createTicket(ticketData, 'https://google.com')

    // TODO: Construct the notion ticket url from the returned ID
  } catch (e) {
    console.error(e);
  }
});

(async () => {
  // Start your app
  await app.start(3000);

  console.log("⚡️ Bolt app is running!");
})();
