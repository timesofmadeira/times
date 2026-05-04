// rotate.js
import fetch from "node-fetch";

// Hyvor Blogs API base path
const API_BASE = "https://blogs.hyvor.com/api/console/v0/blog/times-of-madeira";

// Remove duplicates from the array
const posts = [...new Set([
  "16846", // https://www.timesofmadeira.com/poncha-madeiras-liquid-legacy
  "17069", // https://www.timesofmadeira.com/carnation-revolution-in-a-nutshell
  "17425", // https://www.timesofmadeira.com/a-brief-history-of-madeira
  "20707", // https://www.timesofmadeira.com/rent-a-car-madeira-no-credit-card
  "21332", // https://www.timesofmadeira.com/bolo-do-caco
  "45527", // https://www.timesofmadeira.com/o-portinho-new-eur100-million-hotel-in-santa-cruz
  "40770", // https://www.timesofmadeira.com/base-salary-in-madeira-rises-48-reaching-eur1268
  "30150", // https://www.timesofmadeira.com/2001-a-lidl-odyssey
  "29508", // https://www.timesofmadeira.com/pastel-de-nata-a-culinary-legend
  "45281", // https://www.timesofmadeira.com/madeiras-population-set-to-drop-over-50-by-2100
  "16686", // https://www.timesofmadeira.com/corys-shearwater-sounds-like-madeira
  "18871", // https://www.timesofmadeira.com/madeira-bloom-and-china
  "19467", // https://www.timesofmadeira.com/electric-vehicle-friendly-homes-madeira
  "20090", // https://www.timesofmadeira.com/livraria-esperanca-madeira
  "29100", // https://www.timesofmadeira.com/40-year-old-madeira-buses-roaming-the-streets-of-england
  "29044", // https://www.timesofmadeira.com/whats-behind-madeiras-extremely-low-fertility-rate
  "29003", // https://www.timesofmadeira.com/madeira-wine-ultimate-guide-to-a-timeless-legend
  "17609", // https://www.timesofmadeira.com/madeira-by-bus-public-transport-in-madeira
  "30819", // https://www.timesofmadeira.com/woof-woof-tap-air-portugal-europes-top-pet-friendly-airline
  "21835", // https://www.timesofmadeira.com/mass-tourism-is-a-danger-to-madeira
  "22796", // https://www.timesofmadeira.com/why-does-madeira-have-so-many-pebble-beaches
  "23261", // https://www.timesofmadeira.com/portugal-slips-to-15th-spot-in-expat-ranking
  "23998", // https://www.timesofmadeira.com/portugals-real-estate-prices-skyrocket-80-in-5-years-leading-eu-market
  "23850", // https://www.timesofmadeira.com/traffic-on-the-rise-is-madeira-heading-towards-a-congestion-crisis
  "24267", // https://www.timesofmadeira.com/madeira-needs-mobile-app-to-manage-tourism
  "24504", // https://www.timesofmadeira.com/number-of-doctors-in-madeira-on-the-rise
  "26753", // https://www.timesofmadeira.com/eduardo-damaso-on-the-tragedy-of-madeira
  "16581", // https://www.timesofmadeira.com/is-madeira-in-danger-of-earthquakes
  "27271", // https://www.timesofmadeira.com/tiny-house-madeira-affordable-living-on-the-island
  "27175", // https://www.timesofmadeira.com/rise-in-unskilled-labor-in-madeira
  "27530", // https://www.timesofmadeira.com/festival-colombo-draws-crowds-to-porto-santo
  "27551", // https://www.timesofmadeira.com/madeiras-foreign-population-grows-by-19-2-percent
  "17582", // https://www.timesofmadeira.com/things-to-do-on-a-rainy-day-in-funchal
  "28732", // https://www.timesofmadeira.com/madeira-faces-record-migration-vanishing-youth-as-women-outnumber-men
  "28719", // https://www.timesofmadeira.com/ajuda-a-alimentar-caes-rescues-stray-animals-in-madeira
  "29212", // https://www.timesofmadeira.com/president-albuquerques-firestorm-of-denial
  "31428", // https://www.timesofmadeira.com/president-albuquerque-blames-drugs-for-rise-in-homelessness
  "31878", // https://www.timesofmadeira.com/despite-support-madeirans-find-tourism-excessive
  "31754", // https://www.timesofmadeira.com/albuquerque-speaks-of-second-airport-for-madeira
  "31738", // https://www.timesofmadeira.com/government-praises-tourism-boom
  "32356", // https://www.timesofmadeira.com/three-news-about-madeira
  "32295", // https://www.timesofmadeira.com/miguel-nr-1-on-the-importance-of-symbolism-in-politics
  "32282", // https://www.timesofmadeira.com/only-two-pestana-employees-join-strike
  "31651", // https://www.timesofmadeira.com/caram-madeiras-slaughterhouse
  "32665", // https://www.timesofmadeira.com/pingo-doce-vs-continente
  "32444", // https://www.timesofmadeira.com/hotels-accused-of-obstructing-strike-through-bonus-payments
  "32692", // https://www.timesofmadeira.com/who-was-nelio-mendonca
  "33301", // https://www.timesofmadeira.com/digital-nomads-struggle-with-rental-costs-in-madeira
  "33277", // https://www.timesofmadeira.com/bloom-is-tightening-its-grip-on-madeira
  "33225", // https://www.timesofmadeira.com/madeiran-migration-to-curacao-in-the-1940s
  "33187", // https://www.timesofmadeira.com/can-a-court-lift-president-albuquerques-immunity
  "33491", // https://www.timesofmadeira.com/is-the-mercorsur-deal-a-threat-to-madeiras-banana-industry
  "33331", // https://www.timesofmadeira.com/madeiran-pavement-cultural-heritage
  "33734", // https://www.timesofmadeira.com/madeira-tourism-hits-record-756-million-in-2024
  "33706", // https://www.timesofmadeira.com/the-erosion-of-purchasing-power-for-renters-in-madeira
  "34126", // https://www.timesofmadeira.com/can-madeira-ban-property-sales-to-non-residents
  "34125", // https://www.timesofmadeira.com/president-albuquerque-rejects-limits-on-foreign-property-sales
  "33954", // https://www.timesofmadeira.com/madeira-has-second-highest-road-death-toll-in-portugal
  "34380", // https://www.timesofmadeira.com/58-of-madeiras-adults-struggle-with-overweight-or-obesity
  "33518", // https://www.timesofmadeira.com/benjamin-begin-the-madeira-photographer
  "35408", // https://www.timesofmadeira.com/essential-grocery-prices-rise-27-within-3-years
  "35349", // https://www.timesofmadeira.com/king-of-madeira-alberto-joao-jardims-37-year-legacy-of-power
  "35841", // https://www.timesofmadeira.com/teens-in-madeira-drink-less-than-in-any-other-region-in-portugal
  "35727", // https://www.timesofmadeira.com/madeira-sees-1964-rise-in-cruise-tourists-each-spending-eur6140
  "35674", // https://www.timesofmadeira.com/madeira-seeks-to-limit-mass-tourism
  "35992", // https://www.timesofmadeira.com/pirates-nuns-and-survival-the-story-of-curral-das-freiras
  "36038", // https://www.timesofmadeira.com/madeira-named-best-european-destination-by-national-geographic
  "36240", // https://www.timesofmadeira.com/madeira-short-term-rentals-2025
  "36153", // https://www.timesofmadeira.com/insights-on-madeiras-fast-paced-real-estate-market
  "36388", // https://www.timesofmadeira.com/portugal-offers-100-loan-financing-for-young-peoples-first-home
  "36151", // https://www.timesofmadeira.com/where-to-donate-clothes-in-funchal
  "36754", // https://www.timesofmadeira.com/madeira-will-limit-access-to-popular-hiking-trails
  "37149", // https://www.timesofmadeira.com/how-the-indian-ambassador-snubbed-its-people-in-madeira
  "37067", // https://www.timesofmadeira.com/before-the-runway-how-seaplanes-brought-the-world-to-madeira
  "37137", // https://www.timesofmadeira.com/antonio-salazars-estado-novo
  "37437", // https://www.timesofmadeira.com/the-rise-of-bloom-in-madeira-understanding-its-lasting-impact
  "29134", // https://www.timesofmadeira.com/ultimate-guide-to-coffee-culture-of-madeira-from-bica-to-galao
  "37776", // https://www.timesofmadeira.com/should-private-companies-manage-madeiras-hiking-trails
  "35453", // https://www.timesofmadeira.com/porto-santo-seawater-desalination
  "35596", // https://www.timesofmadeira.com/is-it-legal-to-sleep-in-your-car-in-madeira
  "38107", // https://www.timesofmadeira.com/the-carapuca-madeiras-iconic-pigtail-cap-and-its-cultural-legacy
  "31567", // https://www.timesofmadeira.com/monte-train-madeiras-forgotten-railway
  "38313", // https://www.timesofmadeira.com/madeiras-population-reaches-highest-level-since-2014
  "38918", // https://www.timesofmadeira.com/columbus-in-madeira-the-story-of-his-years-on-the-island
  "38949", // https://www.timesofmadeira.com/7400-migrants-from-80-countries-now-living-in-funchal
  "38878", // https://www.timesofmadeira.com/tourists-face-new-charges-at-more-sites-accross-madeira
  "39318", // https://www.timesofmadeira.com/ps-wants-traffic-limits-for-rent-a-car-vehicles-in-funchal
  "39434", // https://www.timesofmadeira.com/president-wants-helicopter-tourism-for-high-income-visitors
  "39693", // https://www.timesofmadeira.com/ponta-do-pargo-golf-course-detaching-policy-from-local-reality
  "39965", // https://www.timesofmadeira.com/madeira-traffic-statistics-its-going-up
  "40682", // https://www.timesofmadeira.com/seed-balls-madeira-tests-drones-to-reforest-burned-areas
  "40939", // https://www.timesofmadeira.com/jpp-wants-at-least-one-new-supermarket-chain-in-madeira
  "41023", // https://www.timesofmadeira.com/traffic-chaos-madeiras-west-coast-choked-with-cars
  "43936", // https://www.timesofmadeira.com/young-madeirans-leave-for-mainland-facing-hardships
  "44260", // https://www.timesofmadeira.com/tourists-fined-eur750-for-trespassing-on-pr1
  "44814", // https://www.timesofmadeira.com/government-says-madeira-has-capacity-for-more-tourism
  "43980", // https://www.timesofmadeira.com/we-need-to-talk-about-mercado-dos-lavradores
  "45279", // https://www.timesofmadeira.com/madeira-tunnels-soon-have-full-5g-mobile-coverage
  "45198", // https://www.timesofmadeira.com/invasive-plants-threaten-laurissilvas-unesco-heritage-status
  "45091", // https://www.timesofmadeira.com/rethinking-travel-madeiras-vision-for-city-mobility
  "45097", // https://www.timesofmadeira.com/government-accused-of-favoring-companies-at-praia-formosa
  "45373", // https://www.timesofmadeira.com/eur5000-monthly-stall-rents-calls-for-reform-at-mercado-dos-lavradores
  "45836", // https://www.timesofmadeira.com/tourist-laughs-at-being-ripped-off-at-mercado-dos-lavradores
  "45583", // https://www.timesofmadeira.com/nearly-30-of-madeiras-youth-have-received-psychiatric-care
  "46184", // https://www.timesofmadeira.com/real-estate-prices-in-madeira-continue-to-fall-in-q2-2025
  "46096", // https://www.timesofmadeira.com/rental-cars-reach-102852-bookings-eur17m-in-revenue
  "46141", // https://www.timesofmadeira.com/parliament-orders-study-on-living-costs-in-madeira
  "46025", // https://www.timesofmadeira.com/madeira-wants-to-give-housing-to-80-of-homeless-by-2030
  "46417", // https://www.timesofmadeira.com/chega-leader-calls-for-salazar-style-rule-in-madeira
  "46360", // https://www.timesofmadeira.com/do-rental-car-companies-vandalize-each-others-cars-to-survive
  "46241", // https://www.timesofmadeira.com/why-portugals-face-veil-ban-didnt-go-far-enough
  "46718", // https://www.timesofmadeira.com/funchal-has-the-highest-rental-costs-in-portugal
  "46534", // https://www.timesofmadeira.com/the-battle-of-funchal-germanys-assault-during-world-war-i
  "46795", // https://www.timesofmadeira.com/tourism-in-madeira-rises-97-as-19-million-visitors-arrive
  "47333", // https://www.timesofmadeira.com/are-strikes-in-madeira-hard-because-everyone-knows-everyone
  "20611", // https://www.timesofmadeira.com/the-madeira-uprising-of-1931-from-flour-revolt-to-rebellion
  "47048", // https://www.timesofmadeira.com/golf-madness-is-the-archipelago-going-to-have-seven-golf-courses
  "47596", // https://www.timesofmadeira.com/why-madeira-is-a-tornado-proof-island
  "47451", // https://www.timesofmadeira.com/tap-air-portugal-ranked-2nd-cheapest-european-airline-in-2025
  "16579", // https://www.timesofmadeira.com/lidl-hesitates-to-invest-madeira
  "47853", // https://www.timesofmadeira.com/madeiras-large-white-first-european-butterfly-declared-extinct
  "47943", // https://www.timesofmadeira.com/porto-moniz-builds-public-animal-shelter
  "48006", // https://www.timesofmadeira.com/emigration-73-of-18-24-year-olds-consider-leaving-portugal
  "48152", // https://www.timesofmadeira.com/mohammed-bin-salman-kingdom-of-fear
  "48066", // https://www.timesofmadeira.com/portugal-among-top-10-english-speaking-countries-globally
  "48243", // https://www.timesofmadeira.com/quercus-calls-golf-courses-on-agricultural-land-criminal
  "48429", // https://www.timesofmadeira.com/madeira-leads-luxury-housing-supply-on-portuguese-islands
  "48380", // https://www.timesofmadeira.com/coup-of-25-november-1975-the-birth-of-modern-portugal
  "48438", // https://www.timesofmadeira.com/rhetoric-vs-reality-chegas-push-for-a-fourth-republic
  "48451", // https://www.timesofmadeira.com/albuquerque-eyes-miami-madeira-seeks-growth-in-us-travel
  "48478", // https://www.timesofmadeira.com/why-airport-growth-depends-on-factors-outside-the-terminal
  "48493", // https://www.timesofmadeira.com/portugal-faces-more-than-25000-pending-nationality-requests
  "48559", // https://www.timesofmadeira.com/how-to-buy-your-madeira-hiking-trail-ticket-with-simplifica
  "48621", // https://www.timesofmadeira.com/madeiras-development-crisis-gdp-rises-relative-income-falls
  "48661", // https://www.timesofmadeira.com/madeiras-development-crisis-gdp-rises-relative-income-falls
  "48713", // https://www.timesofmadeira.com/the-surprising-story-behind-cristiano-ronaldos-name
  "48718", // https://www.timesofmadeira.com/the-story-behind-the-flag-of-madeira
  "48873", // https://www.timesofmadeira.com/illusion-of-progress-jpp-condemns-madeiras-golf-strategy
  "48944", // https://www.timesofmadeira.com/world-travel-awards-a-commercial-ecosystem-disguised-as-prestige
  "49252", // https://www.timesofmadeira.com/madeira-prison-holds-341-inmates-including-seven-women
  "49339", // https://www.timesofmadeira.com/fajas-of-madeira-history-and-life-below-the-cliffs
  "49292", // https://www.timesofmadeira.com/airbaltic-flight-struggles-to-land-at-madeira-airport
  "49395", // https://www.timesofmadeira.com/madeira-plans-study-for-megayacht-marina
  "49456", // https://www.timesofmadeira.com/immigrants-pay-five-times-more-social-security-than-they-claim
  "49695", // https://www.timesofmadeira.com/madeiras-debt-to-gdp-ratio-now-at-612
  "49891",  // https://www.timesofmadeira.com/santana-madeiras-most-affordable-housing-market-at-eur1792m2
  "50065",  // https://www.timesofmadeira.com/colossus-the-rise-and-fall-of-madeiras-hotel-atlantis
  "50156",  // https://www.timesofmadeira.com/joao-jardim-condemns-hiking-restrictions-for-residents
  "50147",  // https://www.timesofmadeira.com/madeira-home-prices-up-146-in-2025
  "50175",  // https://www.timesofmadeira.com/black-gold-black-friday-how-venezuelans-returned-to-madeira
  "50254",  // https://www.timesofmadeira.com/madeira-rent-levels-now-reach-porto-district
  "50293",  // https://www.timesofmadeira.com/the-two-paths-of-madeira-understanding-levadas-and-veredas
  "50382",  // https://www.timesofmadeira.com/madeira-cruise-tourism-brings-in-eur62-million-in-2025
  "50369",  // https://www.timesofmadeira.com/machico-and-santana-oppose-hiking-time-slots-for-residents
  "50382",  // https://www.timesofmadeira.com/madeira-cruise-tourism-brings-in-eur62-million-in-2025
  "49345",  // https://www.timesofmadeira.com/from-jesuit-priests-to-malmsey-faja-dos-padres-400-year-legacy
  "50679",  // https://www.timesofmadeira.com/portugals-president-symbolic-figure-with-real-power
  "50382",  // https://www.timesofmadeira.com/fixed-speed-radars-coming-to-madeira-this-year
  "50643",  // https://www.timesofmadeira.com/siga-bus-network-explained-tickets-tips-and-fares-for-2026
  "50820",  // https://www.timesofmadeira.com/ponta-do-sol-announces-estrada-dos-anjos-project
  "50930"  // https://www.timesofmadeira.com/madeira-airports-see-174-rise-in-international-traffic-in-2025
  "50969"  // https://www.timesofmadeira.com/should-madeira-spread-tourism-beyond-crowded-hotspots
  "51049"  // https://www.timesofmadeira.com/ponta-do-sol-plans-to-reopen-lugar-de-baixo-marina
  "53122"  // https://www.timesofmadeira.com/power-without-expiry-psd-madeira-removes-term-limits
  "53316"  // https://www.timesofmadeira.com/madeira-housing-prices-fall-83-in-late-2025-despite-national-rise
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
