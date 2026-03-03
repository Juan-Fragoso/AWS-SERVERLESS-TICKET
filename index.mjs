import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {

  console.log("deploy from local: ", event);
  
  if(event.path === "/v1/tickets" && event.httpMethod === "POST")
  {
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
    statusCode: 500,
    body: JSON.stringify({error: "Error"}),
  };
};
