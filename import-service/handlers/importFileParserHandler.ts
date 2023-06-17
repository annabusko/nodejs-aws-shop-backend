import { BuildErrorResponse } from "../../utility/requestHandlerUtilities";
import { S3 } from "aws-sdk";
import { S3Event } from "aws-lambda";
import csvParser = require("csv-parser");
import {
  CopyObjectCommand,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const importFileParserHandler = async (event: S3Event) => {
  try {
    console.log("S3 event consummation started");

    const s3 = new S3();
    const s3Client = new S3Client({ region: "us-east-2" });

    for (const record of event.Records) {
      const readS3ObjectPromise = new Promise((resolve, reject) => {
        const { bucket, object } = record.s3;
        const bucketName = bucket.name;
        const objectKey = object.key;
        const results: any = [];

        s3.getObject({ Bucket: bucketName, Key: objectKey })
          .createReadStream()
          .pipe(csvParser())
          .on("data", (data) => {
            console.log(data);
            results.push(data);
          })
          .on("end", async () => {
            try {
              console.log('start copying...');
              await s3Client.send(
                new CopyObjectCommand({
                  CopySource: `${bucketName}/${objectKey}`,
                  Bucket: bucketName,
                  Key: objectKey.replace("uploaded", "parsed"),
                })
              );
              
              console.log('start deleting...');
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: bucketName,
                  Key: objectKey,
                })
              );
            } catch (err) {
              console.error(err);
            }

            resolve(console.log(`${object.key} parsing completed`));
          })
          .on("error", (err: any) => reject(console.log(err)));
      });

      await readS3ObjectPromise;
    }

    console.log("S3 event consummation ended");
  } catch (err) {
    BuildErrorResponse(err);
  }
};
