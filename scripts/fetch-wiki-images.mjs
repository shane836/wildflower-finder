// One-off script: for each entry in public/wildflowers.json, look up the
// species on Wikipedia and replace imageUrl with the article's lead image.
// Uses Wikipedia REST summary endpoint — no auth, no deps.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const JSON_PATH = resolve(__dirname, '..', 'public', 'wildflowers.json')

// Map display name → Wikipedia article title. Prefer Latin binomial for
// species-accurate photos; fall back to common name where the genus page
// is the better-known target.
const TITLE_MAP = {
  'Black-eyed Susan': 'Rudbeckia hirta',
  'Trillium': 'Trillium',
  'Ramps (Wild Leeks)': 'Allium tricoccum',
  'Bloodroot': 'Sanguinaria',
  'Mayapple': 'Podophyllum peltatum',
  'Coneflower (Purple)': 'Echinacea purpurea',
  'Wild Bergamot': 'Monarda fistulosa',
  'Bee Balm': 'Monarda didyma',
  'Black Cohosh': 'Actaea racemosa',
  'Columbine': 'Aquilegia canadensis',
  'Wild Geranium': 'Geranium maculatum',
  'Asters': 'Symphyotrichum',
  'Blazing Star (Liatris)': 'Liatris',
  'Ironweed': 'Vernonia',
  'Tickseed (Coreopsis)': 'Coreopsis',
  'Black Snake Root': 'Sanicula',
  'Phlox (Wild)': 'Phlox divaricata',
  'Fire Pink': 'Silene virginica',
  'Bellflower': 'Campanula',
  'Sunflower (Wild)': 'Helianthus',
  'New York Ironweed': 'Vernonia noveboracensis',
  'Spiderwort': 'Tradescantia',
  'Blue Flag Iris': 'Iris versicolor',
  "Jacob's Ladder": 'Polemonium reptans',
  'Foamflower': 'Tiarella',
  'Bee Balm (Red)': 'Monarda didyma',
  'Angelica': 'Angelica atropurpurea',
  "Lady's Slipper Orchid": 'Cypripedium',
  'Wood Betony': 'Pedicularis canadensis',
  "Solomon's Seal": 'Polygonatum',
  'Virginia Bluebells': 'Mertensia virginica',
  "Turk's Cap Lily": 'Lilium superbum',
  'Wild Indigo': 'Baptisia',
  "Dutchman's Breeches": 'Dicentra cucullaria',
  'Nodding Onion': 'Allium cernuum',
}

async function fetchLeadImage(title) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  let attempt = 0
  while (true) {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'wildflower-finder/1.0 (hobby project; contact: shane@masonequitypartners.com)' },
    })
    if (res.status === 429 && attempt < 5) {
      const wait = 1000 * Math.pow(2, attempt)
      await new Promise(r => setTimeout(r, wait))
      attempt++
      continue
    }
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${title}`)
    const data = await res.json()
    return data.originalimage?.source || data.thumbnail?.source || null
  }
}

const flowers = JSON.parse(await readFile(JSON_PATH, 'utf8'))
const results = []

for (const flower of flowers) {
  const title = TITLE_MAP[flower.name]
  if (!title) {
    results.push({ name: flower.name, status: 'no-mapping' })
    continue
  }
  if (flower.imageUrl && flower.imageUrl.includes('upload.wikimedia.org')) {
    results.push({ name: flower.name, status: 'skip-cached', title })
    continue
  }
  try {
    const img = await fetchLeadImage(title)
    if (img) {
      flower.imageUrl = img
      results.push({ name: flower.name, status: 'ok', title })
    } else {
      results.push({ name: flower.name, status: 'no-image', title })
    }
  } catch (err) {
    results.push({ name: flower.name, status: 'error', title, error: err.message })
  }
  // gentle pacing — Wikipedia REST is fine but be polite
  await new Promise(r => setTimeout(r, 500))
}

await writeFile(JSON_PATH, JSON.stringify(flowers, null, 2) + '\n')

console.log('Results:')
for (const r of results) {
  const tag = r.status === 'ok' ? 'OK ' : r.status.toUpperCase().padEnd(3)
  console.log(`  ${tag}  ${r.name}${r.title ? `  →  ${r.title}` : ''}${r.error ? `  (${r.error})` : ''}`)
}
const okCount = results.filter(r => r.status === 'ok').length
console.log(`\n${okCount}/${results.length} images updated.`)
