import Redis from "ioredis";

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const QUEUE_KEY = "queue:emails";

async function sendEmail(job) {
  console.log("Processing email:", job);

  console.log(`Email sent to ${job.to}`);
}

async function worker() {
  console.log("Worker started...");

  while (true) {
    try {
      const result = await redis.brpop(QUEUE_KEY, 0); // Block until a job is available

      const rawJob = result[1];
      const job = JSON.parse(rawJob);

      await sendEmail(job);
    } catch (error) {
      console.error("Worker error:", error);
    }
  }
}

worker();