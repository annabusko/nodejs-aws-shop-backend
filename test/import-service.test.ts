import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventPathParameters,
} from "aws-lambda";
import { HttpStatuses } from "../utility/requestHandlerUtilities";
import { importProductsFileHandler } from "../import-service/handlers/importProductsFileHandler";

const signedUrlResultMock = jest.fn();

jest.mock("aws-sdk", () => {
  return {
    S3: jest.fn().mockImplementation(() => {
      return {
        getSignedUrl: (operation: string, params: any) => signedUrlResultMock(),
      };
    }),
  };
});

describe("Get SignedUrl", () => {
  it("should return 'Ok'", async () => {
    const bucketDomain = "bucket.s3.us-east-2.amazonaws.com";
    const testFileName = "test.csv";

    signedUrlResultMock.mockImplementation(() => {
      return `https://${bucketDomain}/uploaded/${testFileName}?X-Amz-Signature=7244bb7406ddd6b258634c4085be9807e1d44e7a71c4c9b66db18c50f3ca1da9`;
    });

    const event = {
      queryStringParameters: {
        name: testFileName,
      } as APIGatewayProxyEventPathParameters,
    } as APIGatewayProxyEvent;

    const response = await importProductsFileHandler(event);
    const signedUrl = new URL(response.body);
    const params = Array.from(signedUrl.searchParams.keys());

    expect(response.statusCode).toBe(HttpStatuses.Ok);
    expect(signedUrl.host).toBe(bucketDomain);
    expect(signedUrl.pathname).toBe(`/uploaded/${testFileName}`);
    expect(params).toContain("X-Amz-Signature");
  });

  it("should return 'Bad Request'", async () => {
    const event = {} as APIGatewayProxyEvent;
    const response = await importProductsFileHandler(event);

    expect(response.statusCode).toBe(HttpStatuses.BadRequest);
    expect(JSON.parse(response.body).message).toBe("File name wasn't provided");
  });

  it("should return 'Bad Request'", async () => {
    const event = {
      queryStringParameters: {
        name: "file.xlsx",
      } as APIGatewayProxyEventPathParameters,
    } as APIGatewayProxyEvent;
    const response = await importProductsFileHandler(event);

    expect(response.statusCode).toBe(HttpStatuses.BadRequest);
    expect(JSON.parse(response.body).message).toBe(
      "File should be in .csv format"
    );
  });
});
