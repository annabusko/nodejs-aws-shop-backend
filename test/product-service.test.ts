import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { getProductListHandler } from "../product-service/handlers/getProductListHandler";
import { Database } from "../product-service/handlers/database";
import { getProductByIdHandler } from "../product-service/handlers/getProductByIdHandler";
import { HttpStatuses } from "../utility/response-builder";

describe("Lambda GetProductListHandler", () => {
  it("should return 'Ok'", async () => {
    const event = {} as APIGatewayProxyEvent;
    const response = await getProductListHandler(event);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body).length).toEqual(
      Database.getAllProducts().length
    );
  });
});

describe("Lambda GetProductByIdHandler", () => {
  it("should return proper Product object", async () => {

    const assertionProduct = Database.getProductById("2");

    const event = { pathParameters: {productId: assertionProduct?.id} as APIGatewayProxyEventPathParameters} as APIGatewayProxyEvent;
    const response = await getProductByIdHandler(event);
    const product = JSON.parse(response.body);
    
    expect(response.statusCode).toBe(HttpStatuses.Ok);
    expect(product.id).toEqual(assertionProduct?.id);
    expect(product.description).toEqual(assertionProduct?.description);
    expect(product.price).toEqual(assertionProduct?.price);
    expect(product.title).toEqual(assertionProduct?.title);
  });

  it("should return 'NotFound'", async () => {

    const event = { pathParameters: {productId: "invalid_id"} as APIGatewayProxyEventPathParameters} as APIGatewayProxyEvent;
    const response = await getProductByIdHandler(event);

    expect(response.statusCode).toBe(HttpStatuses.NotFound);
  });

  it("should return 'BadRequest'", async () => {

    const event = {} as APIGatewayProxyEvent;
    const response = await getProductByIdHandler(event);

    expect(response.statusCode).toBe(HttpStatuses.BadRequest);
  });
});