"use server";
import Redis from "ioredis";
import amqp from "amqplib";

const redis = new Redis("redis://localhost:6379");

export async function saveUser(formData: {
  name: string;
  email: string;
  address: string;
  age: string;
}) {
  let connection;
  try {
    // 1. Data is saved in Redis
    await redis.set(`user_cache:${formData.email}`, JSON.stringify(formData));

    // 2. Send this data to RabbitMQ
    connection = await amqp.connect("amqp://guest:guest@localhost:5672");
    const channel = await connection.createChannel();

    const queue = "user_data_queue_v2";
    const DLX = "fatal_error_exchange";

    // We must declare the queue with IDENTICAL arguments to the worker
    await channel.assertQueue(queue, {
      durable: true,
      deadLetterExchange: DLX,
      deadLetterRoutingKey: "failed",
      arguments: {
        "x-message-ttl": 518400000, // 6 days
      },
    });

    channel.sendToQueue(queue, Buffer.from(JSON.stringify(formData)), {
      persistent: true,
    });

    console.log("🚀 Data queued successfully");

    // Close channel and connection
    await channel.close();
    return { success: true };
  } catch (error) {
    console.error("Queue Error:", error);
    return { success: false };
  } finally {
    if (connection) await connection.close();
  }
}
