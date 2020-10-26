import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as AWS from 'aws-sdk';
import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('deleteTodo');
const docClient = new AWS.DynamoDB.DocumentClient();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const user = getUserId(event)
  // TODO: Remove a TODO item by id
  const item = await deleteTodo(user, todoId);

  logger.info(`Deleted item: ${item}`);
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: item
    })
  }
}
