// rotate.js
import fetch from "node-fetch";

// Hyvor Blogs API base (NO /{POST_ID} at end!)
const API_BASE = "https://blogs.hyvor.com/api/console/v0/blog/timesofmadeira/post";

// Numeric post IDs (Times of Madeira)
const posts = [
  "17069",
  "29508",
  "20707",
  "21332"
];

// Must be even number of posts (pairs)
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

async function patchPost(id, body, attempt = 1) {
  const url = `${API_BASE}/${id}`;
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${HYVOR_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    if (res.status === 429) {
      // Rate limited — exponential backoff
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
  // number of 5-minute intervals since epoch
  const minutesSinceEpoch = Math.floor(Date.now() / 60000);
  const cycle = Math.floor(minutesSinceEpoch / 5);
  return cycle;
}

async function main() {
  const cycle = getCycleIndex();
  const pairCount = posts.length / 2;

  // Determine which pair is current and which is previous
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
