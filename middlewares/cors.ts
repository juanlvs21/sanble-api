import Cors from "cors";

// Run Middleware
import run from "./run";

// Initializing the cors middleware
const cors = Cors({
  origin: "*",
});

export default function (req, res) {
  run(req, res, cors);
}
