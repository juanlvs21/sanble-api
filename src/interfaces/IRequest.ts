import { OrderByDirection } from "../utils/firebase";
export interface IQueryListRequest {
  page?: string;
  perPage?: string;
  orderBy?: string;
  orderDir?: OrderByDirection;
}
