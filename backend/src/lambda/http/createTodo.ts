import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { getUserId } from '../utils'
import { createTodo } from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('createTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const item = JSON.parse(event.body);
  const user = getUserId(event)
  // TODO: Implement creating a new TODO item
  const newItem = await createTodo(user, item);

  logger.info(`Created a new todo: ${newItem}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item: newItem
    })
  }
}
