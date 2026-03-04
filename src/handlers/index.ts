import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { CreateTicketDto } from "../dtos/create-ticket.dto";
import { Router } from "../router/router";
import { TicketService } from "../services/ticket-service";

const router = new Router();
const ticketService = new TicketService();

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    if(router.isCreateTicket(event.path, event.httpMethod))
    {
      if(event.body == null)
      {
        throw new Error("Body is null");
      }

      // Obtenemos los datos del doby
      const json: CreateTicketDto = JSON.parse(event.body);
      const ticket = await ticketService.createTicket(json);

      const response = {
        statusCode: 201,
        body: JSON.stringify(ticket),
      };
      return response;
    }

    return {
      statusCode: 400,
      body: JSON.stringify({message: "Path no found"}),
    };
  } catch (error) {
    console.error("error", error);
    const errorMsg = error instanceof Error ? error.message : "Unknow error";

    return {
      statusCode: 500,
      body: JSON.stringify({message: errorMsg}),
    };
  }
};
