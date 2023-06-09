export const HttpStatuses = {
    Ok: 200,
    BadRequest: 400,
    NotFound: 404,
    InternalError: 500
}

export const BuildHttpJsonResponse = (status: number, data: any) => {
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
