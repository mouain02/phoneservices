import "dotenv/config";
import { connectDb } from "../config/db.js";
import { ensureAdminUser } from "../config/ensureAdminUser.js";

const run = async () => {
  await connectDb();
  const result = await ensureAdminUser({ resetPassword: true });
  const verb = result.action === "created" ? "Created" : "Updated";
  console.log(`${verb} admin user ${result.email} (${result.role})`);

  process.exit(0);
};

run().catch((err) => {
  console.error("Failed to create admin user", err);
  process.exit(1);
});
