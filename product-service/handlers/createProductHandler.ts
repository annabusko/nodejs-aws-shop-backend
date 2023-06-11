import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Database } from "./database";
import {
  BuildErrorResponse,
  BuildHttpJsonResponse,
  HttpStatuses,
  LogRequest,
} from "../../utility/requestHandlerUtilities";
import { isValidProduct } from "./validators";


export const createProductHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    LogRequest(event);

    if (!event.body) {
      return BuildHttpJsonResponse(HttpStatuses.BadRequest, {
        message: "Request body is empty",
      });
    }

    const product = JSON.parse(event.body);
    if (!isValidProduct(product)) {
      return BuildHttpJsonResponse(HttpStatuses.BadRequest, {
        message: "Product is invalid",
      });
    }

    console.log(JSON.stringify(product));

    await Database.createProduct(product);

    return BuildHttpJsonResponse(HttpStatuses.Ok, {
      message: "Product created",
    });
  } catch (err) {
    return BuildErrorResponse(err);
  }
};
