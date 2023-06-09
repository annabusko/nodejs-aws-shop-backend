import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Database } from './database';
import { BuildHttpJsonResponse, HttpStatuses } from '../../utility/response-builder';

export const getProductListHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    return BuildHttpJsonResponse(HttpStatuses.Ok, Database.getAllProducts());
  } catch (err) {
    console.log(err);
    return {
      statusCode: HttpStatuses.InternalError,
      body: JSON.stringify({
        message: 'Internal error',
      }),
    };
  }
};