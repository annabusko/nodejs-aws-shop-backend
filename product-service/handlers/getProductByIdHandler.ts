import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Database } from "./database";
import { BuildErrorResponse, BuildHttpJsonResponse, HttpStatuses, LogRequest } from "../../utility/requestHandlerUtilities";

export const getProductByIdHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    LogRequest(event);

    const id = event.pathParameters?.["productId"];

    if (!id) {
      return BuildHttpJsonResponse(HttpStatuses.BadRequest, { message: "Invalid product id" });
    }

    const product = await Database.getProductById(id);

    if (!product) {
      return BuildHttpJsonResponse(HttpStatuses.NotFound, { message: "Product not found" });
    }

    return BuildHttpJsonResponse(HttpStatuses.Ok, product);
  } catch (err) {
    return BuildErrorResponse(err);
  }
};
