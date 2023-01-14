import { OrderByDirection } from "../utils/firebase";
export interface IQueryListRequest {
  orderBy?: string;
  orderDir?: OrderByDirection;
  limit?: number;
  lastIndex?: number;
}
