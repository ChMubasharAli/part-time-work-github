"use server";
import redis from "@/lib/redis";

const INDEX_NAME = "idx:users_json";

export async function saveUser(formData: any) {
  try {
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

    const id = Date.now();
    await redis.call("JSON.SET", `user:${id}`, "$", JSON.stringify(formData));
    return { success: true };
  } catch (e) {
    return { success: false };
  }
}

// Naya Function: Saara data lane ke liye
export async function getAllUsers() {
  try {
    // "*" ka matlab hai "Everything"
    // LIMIT 0 10000 ka matlab hai ke pehle 10,000 records tak le aao
    const res: any = await redis.call(
      "FT.SEARCH",
      INDEX_NAME,
      "*",
      "LIMIT",
      "0",
      "10000"
    );

    if (!res || res[0] === 0) return [];

    const allUsers = [];
    // Redis response structure: [count, key1, [data1], key2, [data2]...]
    // Isliye loop i=2 se shuru hoga aur 2 ke step se barhay ga
    for (let i = 2; i < res.length; i += 2) {
      const userData = JSON.parse(res[i][1]);
      allUsers.push(userData);
    }

    return allUsers;
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
}
