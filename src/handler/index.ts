import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  try {
    if(event.path === "/v1/tickets" && event.httpMethod === "POST")
    {
      if(event.body == null)
      {
        throw new Error("Body is null");
      }

      // Obtenemos los datos del doby
      const json = JSON.parse(event.body);

      const ticket = {
        id: crypto.randomUUID(),
        ...json,
      }

      const command = new PutCommand({
        TableName: "dev-tsb-ddb-tickets",
        Item: ticket,
      });

      const responseDB = await docClient.send(command);
      console.log(responseDB);

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
