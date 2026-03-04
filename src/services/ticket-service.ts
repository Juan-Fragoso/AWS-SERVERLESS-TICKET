import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { TicketPriority, TicketStatus, TicketType } from "../domain/enums";
import { CreateTicketDto } from "../dtos/create-ticket.dto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Ticket } from "../domain/ticket";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export class TicketService {
    async createTicket(createTicket: CreateTicketDto): Promise<Ticket>
    {
        const ticket: Ticket = {
            id: crypto.randomUUID(),
            title: createTicket.title,
            description: createTicket.description,
            status: createTicket.status ?? TicketStatus.NEW,
            reporterId: createTicket.reporterId,
            assignedToId: createTicket.assignedToId,
            priority: createTicket.priority ?? TicketPriority.MEDIUM,
            type: createTicket.type ?? TicketType.INCIDENT,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const command = new PutCommand({
            TableName:
                process.env.DYN_TICKET_TABLE_NAME ?? "DYN_TICKET_TABLE_NAME",
            Item: ticket,
        });

        const responseDB = await docClient.send(command);
        console.log(responseDB);
        
        return ticket;
    }
}