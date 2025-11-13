// rotate.js
import fetch from "node-fetch";

// Hyvor Blogs API base path
const API_BASE = "https://blogs.hyvor.com/api/console/v0/blog/times-of-madeira";

const posts = [
  "17069",
  "20707",
  "21332",
  "45527",
  "40770",
  "30150",
  "29508",
  "45281",
  "20611",
  "33301",
  "16686",
  "18871",
  "31567",
  "19467",
  "20090",
  "29100",
  "29044",
  "29003",
  "17609",
  "30819",
  "21835",
  "22796",
  "23261",
  "23998",
  "23850",
  "24267",
  "24504",
  "26753",
  "16581",
  "27271",
  "27175",
  "27530",
  "27658",
  "27551",
  "17582",
  "28732",
  "28719",
  "29212",
  "31428",
  "31878",
  "31754",
  "31738",
  "32356",
  "32295",
  "32282",
  "31651"
  
];

if (posts.length % 2 !== 0) {
  console.error("posts array length should be even (pairs).");
  process.exit(1);
}

const HYVOR_API_KEY = process.env.HYVOR_API_KEY;
if (!HYVOR_API_KEY) {
  console.error("HYVOR_API_KEY env var missing");
  process.exit(1);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// PATCH /post/{id}
async function patchPost(id, body, attempt = 1) {
  const url = `${API_BASE}/post/${id}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "X-API-KEY": HYVOR_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.status === 429) {
      const wait = Math.min(60000, 2000 * attempt);
      console.warn(`429 for ${id}. Backing off ${wait}ms (attempt ${attempt})`);
      await sleep(wait);
      return patchPost(id, body, attempt + 1);
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
    }

    return await res.json();
  } catch (err) {
    if (attempt < 4) {
      const wait = 1000 * attempt;
      console.warn(`Error patching ${id}: ${err.message}. Retry in ${wait}ms`);
      await sleep(wait);
      return patchPost(id, body, attempt + 1);
    }
    throw err;
  }
}

function getCycleIndex() {
  const minutesSinceEpoch = Math.floor(Date.now() / 60000);
  const cycle = Math.floor(minutesSinceEpoch / 5);
  return cycle;
}

async function main() {
  const cycle = getCycleIndex();
  const pairCount = posts.length / 2;

  const currentPairIndex = cycle % pairCount;
  const prevPairIndex = (currentPairIndex - 1 + pairCount) % pairCount;

  const curA = posts[currentPairIndex * 2];
  const curB = posts[currentPairIndex * 2 + 1];
  const prevA = posts[prevPairIndex * 2];
  const prevB = posts[prevPairIndex * 2 + 1];

  console.log(
    "cycle:", cycle,
    "current pair index:", currentPairIndex,
    "posts on:", curA, curB,
    "posts off:", prevA, prevB
  );

  // Unfeature previous pair
  try {
    await Promise.all([
      patchPost(prevA, { is_featured: false }),
      patchPost(prevB, { is_featured: false })
    ]);
    console.log("Unfeatured previous pair:", prevA, prevB);
  } catch (err) {
    console.error("Failed to unfeature previous pair:", err);
  }

  // Feature current pair
  try {
    await Promise.all([
      patchPost(curA, { is_featured: true }),
      patchPost(curB, { is_featured: true })
    ]);
    console.log("Featured current pair:", curA, curB);
  } catch (err) {
    console.error("Failed to feature current pair:", err);
    process.exitCode = 2;
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
