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

const HYVOR_API_KEY = process.env.HYVOR_API_KEY;
if (!HYVOR_API_KEY) {
  console.error("HYVOR_API_KEY env var missing. Set it before running.");
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

// Returns array of unique random elements from the given array
function getRandomElements(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// In this script, active posts are tracked outside the API, so store in file or environment if needed.
// For simplicity assume we check all posts for featured and then unfeature them to maintain state consistency.

async function unfeatureAll() {
  console.log("Unfeaturing all currently featured posts...");
  await Promise.all(
    posts.map(id => patchPost(id, { is_featured: false }).catch(err => {
      console.error(`Failed to unfeature post ${id}:`, err.message);
    }))
  );
}

async function main() {
  // Activate 1 to 3 random post IDs every run (every 10 minutes ideally via cron)
  const countToActivate = Math.floor(Math.random() * 3) + 1; // 1,2 or 3
  
  try {
    // Step 1: Unfeature all posts currently featured
    await unfeatureAll();
    
    // Step 2: Pick random posts to feature
    const toFeature = getRandomElements(posts, countToActivate);
    
    // Step 3: Feature selected posts
    await Promise.all(
      toFeature.map(id => patchPost(id, { is_featured: true }))
    );
    
    console.log(`Featured posts (${countToActivate}):`, toFeature.join(", "));
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
}

main();
