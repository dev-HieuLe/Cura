import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { loadAllFromDB } from "./services/db.service.js"; // <-- switch here

const PORT = 8080;

(async () => {
  await loadAllFromDB(); // load all data first of.
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})();
