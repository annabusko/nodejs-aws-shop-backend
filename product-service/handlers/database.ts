import * as sdk from "aws-sdk";

const dynamoDbClient = new sdk.DynamoDB({ region: "eu-north-1" });

export const Database = {
  ProductsTable: process.env.PRODUCTS_TABLE ?? "Products",
  StocksTable: process.env.STOCKS_TABLE ?? "Stocks",

  getAllProducts: async () => {
    const response = await Promise.all([
      dynamoDbClient.scan({ TableName: Database.StocksTable }).promise(),
      dynamoDbClient.scan({ TableName: Database.ProductsTable }).promise(),
    ]);

    const stocksHashmap: any = {};
    response[0].Items?.forEach((s) => {
      const stock = sdk.DynamoDB.Converter.unmarshall(s);
      stocksHashmap[stock.product_id] = stock;
    });

    const products = response[1].Items?.map((p) => {
      const obj = sdk.DynamoDB.Converter.unmarshall(p);
      return { ...obj, count: stocksHashmap[obj.id]?.count };
    });

    return products;
  },

  getProductById: async (id: string) => {
    const productParams = {
      TableName: Database.ProductsTable,
      Key: {
        id: { S: id },
      },
    };

    const stockParams = {
      TableName: Database.StocksTable,
      Key: {
        product_id: { S: id },
      },
    };

    const result = await Promise.all([
      dynamoDbClient.getItem(productParams).promise(),
      dynamoDbClient.getItem(stockParams).promise()
    ]);

    const product = result[0].Item ? sdk.DynamoDB.Converter.unmarshall(result[0].Item) : null;
    
    if(product){
      const stock = result[1].Item ? sdk.DynamoDB.Converter.unmarshall(result[1].Item) : null;
      product.count = stock?.count;
    }

    return product;
  },

  createProduct: (product: any) => {
    const params = {
      TableName: Database.ProductsTable,
      Item: sdk.DynamoDB.Converter.marshall(product),
    };

    return dynamoDbClient.putItem(params).promise();
  },
};
