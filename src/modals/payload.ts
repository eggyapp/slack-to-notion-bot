import { TicketProperties } from "../../lib/notion/ticket/ticket_properties";

export interface CreateTicketPayload {
  title: string;
  messageUrl: string;
  messageTimestamp: string;
  channelId: string;
  ticketProps: TicketProperties;
}

interface PrivateMetadata {
  messageTimestamp: string;
  channelId: string;
}

export class ModalPayload {
  private static separator = "###";

  static metadataToString = (metadata: PrivateMetadata): string => {
    return `${metadata.messageTimestamp}${ModalPayload.separator}${metadata.channelId}`;
  };

  static stringToMetadata = (metadata: string): PrivateMetadata | undefined => {
    const data = metadata.split(ModalPayload.separator);

    // GUARD
    if (data.length != 2) {
      return undefined;
    }

    return {
      messageTimestamp: data[0],
      channelId: data[1],
    };
  };
}
