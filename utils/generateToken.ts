import { v1 as uuidv1 } from "uuid";

const generateToken = () =>
  Math.random().toString(36).substr(2) +
  uuidv1().replace(/[^\w\s]/gi, "") +
  Math.random().toString(36).substr(2);

export default generateToken;
