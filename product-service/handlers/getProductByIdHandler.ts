import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Database } from "./database";
import { BuildHttpJsonResponse, HttpStatuses } from "../../utility/response-builder";

export const getProductByIdHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.["productId"];

    if (!id) {
      return BuildHttpJsonResponse(HttpStatuses.BadRequest, { message: "Invalid product id" });
    }

    const product = Database.getProductById(id);

    if (!product) {
      return BuildHttpJsonResponse(HttpStatuses.NotFound, { message: "Product not found" });
    }

    return BuildHttpJsonResponse(HttpStatuses.Ok, product);
  } catch (err) {
    console.log(err);
    return {
      statusCode: HttpStatuses.InternalError,
      body: JSON.stringify({
        message: "Internal error",
      }),
    };
  }
};
