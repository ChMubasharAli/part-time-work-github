// worker.ts
import amqp from "amqplib";
import prisma from "./lib/prisma";// Ensure this path is correct
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function startWorker() {
  console.log(
    "Checking DB URL...",
    process.env.DATABASE_URL ? "URL Found" : "URL MISSING!"
  );
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost:5672");
    const channel = await connection.createChannel();

    // 1. Setup Dead Letter Exchange for Fatal Errors (Requirement #7)
    const DLX = "fatal_error_exchange";
    await channel.assertExchange(DLX, "direct", { durable: true });
    await channel.assertQueue("fatal_errors_log", { durable: true });
    await channel.bindQueue("fatal_errors_log", DLX, "failed");

    // 2. Main Queue - MATCHING ACTIONS.TS EXACTLY
    const queue = "user_data_queue_v2";
    await channel.assertQueue(queue, {
      durable: true,
      deadLetterExchange: DLX,
      deadLetterRoutingKey: "failed",
      arguments: {
        "x-message-ttl": 518400000, // Added to match actions.ts
      },
    });

    console.log("🚀 Worker is running. Waiting for messages...");

    // 3. Process Data from RabbitMQ to PSQL
    channel.consume(queue, async (msg) => {
      if (!msg) return;
      const data = JSON.parse(msg.content.toString());

      try {
        // Attempting to save to PostgreSQL
        await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            address: data.address,
            age: parseInt(data.age),
          },
        });

        console.log(`✅ Success: ${data.name} saved to PostgreSQL`);
        channel.ack(msg); // 4 & 5. Success Confirmation
      } catch (error) {
        console.log(
          "Checking DB URL...",
          process.env.DATABASE_URL ? "URL Found" : "URL MISSING!"
        );
        // Add this line to see WHY it is failing:
        console.error("DEBUG ERROR:", error);

        console.error("⚠️ PSQL Error. Message will stay in queue for retry...");

        setTimeout(() => {
          channel.nack(msg, false, true);
        }, 3000);

        channel.nack(msg, false, true);
      }
    });

    // 7. Fatal Error Notification (Requirement #7)
    channel.consume("fatal_errors_log", (msg) => {
      if (msg) {
        console.error(
          "🔥 FATAL ERROR: Record failed after time limit expired:",
          msg.content.toString()
        );
        channel.ack(msg);
      }
    });
  } catch (err) {
    console.error("Worker failed to start:", err);
  }
}

startWorker();
