// rotate.js
import fetch from "node-fetch";

// Hyvor Blogs API base path
const API_BASE = "https://blogs.hyvor.com/api/console/v0/blog/times-of-madeira";

// Remove duplicates from the array
const posts = [...new Set([
  "16846", "17069", "17425", "20707","21332","45527","40770","30150","29508","45281","16686",
  "18871","19467","20090","29100","29044","29003","17609","30819","21835",
  "22796","23261","23998","23850","24267","24504","26753","16581","27271",
  "27175","27530","27658","27551","17582","28732","28719","29212","31428",
  "31878","31754","31738","32356","32295","32282","31651","32354","32665",
  "32593","32444","32692","33301","33277","33225","33187","33491","33331",
  "33734","33706","34126","34125","33954","34380","33518","35408","35349",
  "35841","35727","35674","35992","36038","36240","36153","36388","36151",
  "36754","37149","37067","37137","37437","29134","37776","35453","35596",
  "38107","31567","38313","38918","38949","38878","39318","39434","39693",
  "39965","40682","40939","41023","43936","44260","44527","44814","43980",
  "45279","45198","45091","45097","45373","45836","45583","46184","46096",
  "46141","46025","45892","46417","46360","46241","46718","46534","47119",
  "47081","46795","47333","47262","20611","47048","47596","47451","16579",
  "47768","47818","47853","47937","47943","48006","48152","48066","48213",
  "48243","48429","48380","48438","48451","48478","48493","48559","48621",
  "48661","48713"."48718"
])];

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

// Fisher–Yates shuffle
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Returns unique random elements using Fisher–Yates shuffle
function getRandomElements(array, count) {
  const shuffled = shuffleArray(array);
  return shuffled.slice(0, count);
}

// Unfeature all posts currently featured
async function unfeatureAll() {
  console.log("Unfeaturing all currently featured posts...");
  await Promise.all(
    posts.map(id => patchPost(id, { is_featured: false }).catch(err => {
      console.error(`Failed to unfeature post ${id}:`, err.message);
    }))
  );
}

async function main() {
  // Randomly activate between 1 and 3 posts on each run
  const countToActivate = Math.floor(Math.random() * 3) + 1;

  try {
    // Step 1: Unfeature all posts currently featured
    await unfeatureAll();
    console.log("Completed unfeaturing all posts.");

    // Step 2: Select random posts to feature
    const toFeature = getRandomElements(posts, countToActivate);
    console.log(`Selected ${countToActivate} posts to feature:`, toFeature.join(", "));

    // Step 3: Feature selected posts
    await Promise.all(
      toFeature.map(id => patchPost(id, { is_featured: true }).catch(err => {
        console.error(`Failed to feature post ${id}:`, err.message);
      }))
    );

    console.log("Successfully featured posts:", toFeature.join(", "));
  } catch (err) {
    console.error("Fatal error:", err);
    process.exit(1);
  }
}

main();
