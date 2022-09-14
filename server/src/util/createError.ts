interface ResponseError extends Error {
  status?: number;
}

export const createError = (status: number, message: string) => {
  const error = new Error() as ResponseError;

  error.status = status || 500;
  error.message = message || "Something went wrong";

  return error;
};
