import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import { createLogger } from '../../utils/logger';

const logger = createLogger('generateUploadURL');

const s3Bucket = new AWS.S3({
  signatureVersion: 'v4'
})

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const item = s3Bucket.getSignedUrl('putObject',{
    Bucket: process.env.ATTACHMENT_BUCKET,
    Key: todoId
  }) 
  logger.info(`get upload URL: ${item}`);
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: item
    })
  }
}
