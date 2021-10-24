type TMongoDocument = import("mongoose").Document;

type TResponse = import("express").Response;

type Handler = (
  req: import("express").Request,
  res: TResponse,
  next: import("express").NextFunction
) => Promise<TResponse | void> | TResponse | void;
