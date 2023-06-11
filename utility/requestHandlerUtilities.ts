export const HttpStatuses = {
    Ok: 200,
    BadRequest: 400,
    NotFound: 404,
    InternalError: 500
}

export const BuildHttpJsonResponse = (status: number, data?: any) => {
  return {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
    },
    body: JSON.stringify(data),
  };
};

export const BuildErrorResponse = (error: any) => {
  console.log(error);
  return BuildHttpJsonResponse(HttpStatuses.InternalError, `Internal error ${JSON.stringify(error)}`);
}

export const LogRequest = (event: any) =>{
  console.log(`Request: ${event.httpMethod} ${event.path}; Query params: ${event.queryStringParameters}; Body: ${event.body}`);
}
