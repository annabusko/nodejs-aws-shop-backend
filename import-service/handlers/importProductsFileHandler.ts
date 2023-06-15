import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { BuildErrorResponse, BuildHttpJsonResponse, BuildHttpRawResponse, HttpStatuses, LogRequest } from '../../utility/requestHandlerUtilities';
import {S3} from 'aws-sdk';

const s3Client = new S3({region: 'us-east-2'});

export const importProductsFileHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    LogRequest(event);

    if(!event?.queryStringParameters || !event?.queryStringParameters['name']){
        return BuildHttpJsonResponse(HttpStatuses.BadRequest, {message: "File name wasn't provided"});
    }

    const url = s3Client.getSignedUrl('putObject', {
        Bucket: 'annabusko-nodejs-task-5',
        Key: `uploaded/${event.queryStringParameters['name']}`,
        ContentType: 'text/csv'
    });

    return BuildHttpRawResponse(HttpStatuses.Ok, url);
  } catch (err) {
    return BuildErrorResponse(err);
  }
};