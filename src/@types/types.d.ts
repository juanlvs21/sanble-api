// type TMongoId = import('mongoose').Schema.Types.ObjectId;

// type TStatus = 'active' | 'deleted' | 'canceled' | 'deprecated';

type TMongoDocument = import("mongoose").Document;

type TResponse = import("express").Response;

type Handler = (
  req: import("express").Request,
  res: TResponse,
  next: import("express").NextFunction
) => Promise<TResponse | void> | TResponse | void;

/************************************* DECLARATIONS *************************************/

declare namespace Express {
  export interface Request {
    user: {
      id: string;
    };
  }
}

declare module "*.json" {
  const value: any;
  export default value;
}
