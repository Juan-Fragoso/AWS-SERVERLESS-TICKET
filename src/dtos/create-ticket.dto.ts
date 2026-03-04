import { TicketPriority, TicketStatus, TicketType } from "../domain/enums";

export type CreateTicketDto = {
  title: string;
  description: string;
  status: TicketStatus;
  reporterId: string;
  assignedToId?: string;
  priority: TicketPriority;
  type: TicketType;
};