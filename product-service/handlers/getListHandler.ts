import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Database } from './database';
import { BuildErrorResponse, BuildHttpJsonResponse, HttpStatuses, LogRequest } from '../../utility/requestHandlerUtilities';

export const getListHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    LogRequest(event);
    return BuildHttpJsonResponse(HttpStatuses.Ok, await Database.getAllProducts());
  } catch (err) {
    return BuildErrorResponse(err);
  }
};