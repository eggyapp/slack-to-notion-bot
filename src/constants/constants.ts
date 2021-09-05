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

export { CallbackId, ActionId };
