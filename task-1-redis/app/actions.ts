"use server";
import redis from "@/lib/redis";

const INDEX_NAME = "idx:users_json";

// Logic to save user data
export async function saveUser(formData: any) {
  try {
    // Check karein agar index pehle se bana hai ya nahi
    await redis.call("FT.INFO", INDEX_NAME).catch(async () => {
      await redis.call(
        "FT.CREATE",
        INDEX_NAME,
        "ON",
        "JSON",
        "PREFIX",
        "1",
        "user:",
        "SCHEMA",
        "$.name",
        "AS",
        "name",
        "TEXT",
        "$.email",
        "AS",
        "email",
        "TAG"
      );
    });

    // Store user data as JSON with unique ID
    const id = Date.now();
    await redis.call("JSON.SET", `user:${id}`, "$", JSON.stringify(formData));

    return { success: true };
  } catch (e) {
    console.error("Save Error:", e);
    return { success: false };
  }
}

// Logic to search user data
export async function searchUser(query: string) {
  if (!query) return null;

  try {
    // RediSearch query: Name field par search (prefix matching ke saath)
    const res: any = await redis.call(
      "FT.SEARCH",
      INDEX_NAME,
      `@name:${query}*`
    );

    // if no results found
    if (!res || res[0] === 0) {
      return null;
    }

    // Redis FT.SEARCH ka response array format mein hota hai
    // res[0] = total count
    // res[1] = key (document ID)
    // res[2] = fields (index 1 par JSON string hoti hai)
    const jsonString = res[2][1];
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Search Error:", error);
    return null;
  }
}
