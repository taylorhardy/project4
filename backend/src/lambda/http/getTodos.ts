import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';
import {getUserId} from '../utils';
import {getAllTodos} from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  const user = getUserId(event)
  const items = await getAllTodos(user)
  logger.info(`get all todos for logged in user ${user}`)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: items
    })
  }
}