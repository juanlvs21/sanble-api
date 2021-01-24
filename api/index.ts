import { NowRequest, NowResponse } from "@vercel/node";

export default (req: NowRequest, res: NowResponse) => {
  const { name = "World" } = req.query;
  res.status(200).send(`Hello ${name}!`);
};
