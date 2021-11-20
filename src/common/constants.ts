const Command = (() => {
  const notionToken = "/notion-token";
  const notionTicketDb = "/notion-ticket-database";
  const notionUserDb = "/notion-user-database";
  const userIds = "/user-ids";

  return {
    notionToken,
    notionTicketDb,
    notionUserDb,
    userIds,
  };
})();

const CallbackId = (() => {
  const createTicket = "shortcut_ticket";
  const createTicketModal = "modal_ticket";

  return {
    createTicket,
    createTicketModal,
  };
})();

const ActionId = (() => {
  const createTicket = "shortcut_ticket";

  return {
    createTicket,
  };
})();

export { Command, CallbackId, ActionId };
