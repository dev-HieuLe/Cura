import dotenv from "dotenv";
dotenv.config(); // MUST be first line

import app from "./app.js";
import { loadAllCSVs } from "./services/csv.service.js";

const PORT = 8080;

(async () => {
  await loadAllCSVs();
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
