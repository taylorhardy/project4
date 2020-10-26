import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest';
import {getUserId} from '../utils';
import {updateTodo} from '../../businessLogic/todos';
import { createLogger } from '../../utils/logger';

const logger = createLogger('updateTodo');;

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId;
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
  const user = getUserId(event);

  const item = await updateTodo(user, todoId, updatedTodo);
  logger.info(`update todo: ${item}`)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: ''
  }
}
