import cron from "node-cron";
import {userModel} from "../../database/index.js";


cron.schedule("0 0 * * *", async () => {
  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000)
  try {
    const result = await userModel.deleteMany({
      isVerified: false,
      createdAt: { $lt: cutoff }
    });

    console.log(`Deleted ${result.deletedCount} unverified users older than 24h`);
  } catch (err) {
    console.error("Error deleting unverified users:", err);
  }
});