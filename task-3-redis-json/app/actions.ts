"use server";

import redis from "@/lib/redis";

const INDEX_NAME = "idx:users";

export async function setupRediSearchHashes() {
  try {
    // 1. Purana Index aur Data clear karna
    await redis.call("FT.DROPINDEX", INDEX_NAME).catch(() => {});
    
    // 2. Index create karna (Hashes ke liye)
    // Hum keh rahe hain ke "user:*" keys ko index karo jisme name TEXT hai aur email TAG hai
    await redis.call(
      "FT.CREATE", INDEX_NAME,
      "ON", "HASH",
      "PREFIX", "1", "user:",
      "SCHEMA", 
      "name", "TEXT", 
      "email", "TAG"
    );

    // 3. Data Seed karna (HSET)
    const users = [
      { name: "Alice Johnson", email: "alice@example.com" },
      { name: "Bob Smith", email: "bob@example.com" },
      { name: "Charlie Brown", email: "charlie@example.com" },
      { name: "Diana Prince", email: "diana@example.com" },
    ];

    for (let i = 0; i < users.length; i++) {
      await redis.hset(`user:${i}`, users[i]);
    }
    
    return { success: true };
  } catch (e) {
    console.error(e);
    return { success: false };
  }
}

export async function searchUserByIndex(index: number) {
  // RediSearch Query: Saare users mangwao aur index ke mutabiq 1 return karo
  // LIMIT <offset> <count>
  const result: any = await redis.call("FT.SEARCH", INDEX_NAME, "*", "LIMIT", index, "1");
  
  // result[0] total count hota hai, result[1] key name, result[2] data fields
  if (!result || result[0] === 0) return null;

  // Data ko transform karna (HGETALL ki tarah format banana)
  const fields = result[2];
  const user: any = {};
  for (let i = 0; i < fields.length; i += 2) {
    user[fields[i]] = fields[i + 1];
  }
  return user as { name: string; email: string };
}












// "use server";

// import redis from "@/lib/redis";

// export async function seedUsersWithJSON() {
//   const users = [
//     { name: "Alice Johnson", email: "alice@example.com" },
//     { name: "Bob Smith", email: "bob@example.com" },
//     { name: "Charlie Brown", email: "charlie@example.com" },
//     { name: "Diana Prince", email: "diana@example.com" },
//   ];

//   // CLEAR OLD DATA
//   for (let i = 0; i < 4; i++) {
//     await redis.del(`user_json:${i}`);
//   }

//   // set data using  JSON.SET
//   for (let i = 0; i < users.length; i++) {
//     await redis.call(
//       "JSON.SET",
//       `user_json:${i}`,
//       "$",
//       JSON.stringify(users[i])
//     );
//   }

//   return { success: true };
// }

// export async function getUserByJSONIndex(index: number) {
//   // get data using JSON.GET
//   const data = await redis.call("JSON.GET", `user_json:${index}`);

//   if (!data) return null;

//   return JSON.parse(data as string);
// }
