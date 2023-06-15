import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  BuildErrorResponse,
  BuildHttpJsonResponse,
  BuildHttpRawResponse,
  HttpStatuses,
  LogRequest,
} from "../../utility/requestHandlerUtilities";
import { S3 } from "aws-sdk";
import { S3Event } from "aws-lambda";
const csv = require('csv-parser')

const s3Client = new S3({ region: "us-east-2" });

export const fileParserHandler = async (
  event: S3Event
) => {
  try {
    console.log('S3 event consumation started');

    const s3 = new S3();

    for (const record of event.Records) {

      console.log('Record size is: ' + JSON.stringify(record.s3.object.size))

      const { bucket, object } = record.s3;
      const bucketName = bucket.name;
      const objectKey = object.key;

      const s3Stream = s3
        .getObject({ Bucket: bucketName, Key: objectKey })
        .createReadStream()
        .pipe(csv());

      s3Stream.on("data", (chunk: any) => {
        console.log("Received data chunk:", chunk);
      });

      s3Stream.on("error", (error: any) => {
        console.error("Error occurred while streaming:", error);
      });

      s3Stream.on("end", (result: any) => {
        console.log("Streaming finished");
        console.log("Received data chunk:", JSON.stringify(result))
      });
    }

    console.log('S3 event consumation ended');
  } catch (err) {
    BuildErrorResponse(err);
  }
};
