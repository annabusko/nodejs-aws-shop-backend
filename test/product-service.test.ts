import { APIGatewayProxyEvent, APIGatewayProxyEventPathParameters } from "aws-lambda";
import { Database } from "../product-service/handlers/database";
import { getProductByIdHandler } from "../product-service/handlers/getProductByIdHandler";
import { HttpStatuses } from "../utility/requestHandlerUtilities";
import { createProductHandler } from "../product-service/handlers/createProductHandler";
import { randomUUID } from "crypto";
import { getListHandler } from "../product-service/handlers/getListHandler";

describe("Lambda GetProductListHandler", () => {
  it("should return 'Ok'", async () => {
    const event = {} as APIGatewayProxyEvent;
    const response = await getListHandler(event);

    expect(response.statusCode).toBe(HttpStatuses.Ok);
    expect(JSON.parse(response.body).length).toEqual(
      (await Database.getAllProducts())?.length
    );
  });
});

describe("Product Service Basic", () => {
  it("should return proper Product object", async () => {

    const assertionProduct = await Database.getProductById("3367ec4b-b10c-48c5-9345-fc73c48a80a0");

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

  it("should return 'Ok'", async () => {

    const event = {body: JSON.stringify({
      id: randomUUID(),
      title: "Test Book",
      description: 'Test',
      price: 123
    })} as APIGatewayProxyEvent;
    const response = await createProductHandler(event);

    expect(response.statusCode).toBe(HttpStatuses.Ok);
  });

  it("should return 'Bad Request'", async () => {

    const event = {body: JSON.stringify({
      id: 4654654,
      title: 54654546,
      description: 4654654,
      price: "asdasdasd"
    })} as APIGatewayProxyEvent;
    const response = await createProductHandler(event);

    expect(response.statusCode).toBe(HttpStatuses.BadRequest);
  });
});