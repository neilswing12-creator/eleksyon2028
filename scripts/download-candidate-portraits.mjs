import fs from 'fs';
import path from 'path';

const CANDIDATES = [
  { slug: 'cielo-magno', wiki: 'Cielo Magno' },
  { slug: 'heidi-mendoza', wiki: 'Heidi Mendoza' },
  { slug: 'jinggoy-estrada', wiki: 'Jinggoy Estrada' },
  { slug: 'abby-binay', wiki: 'Abby Binay' },
  { slug: 'nancy-binay', wiki: 'Nancy Binay' },
  { slug: 'salvador-panelo', wiki: 'Salvador Panelo' },
  { slug: 'jimmy-bondoc', wiki: 'Jimmy Bondoc' },
  { slug: 'ben-tulfo', wiki: 'Ben Tulfo' },
  { slug: 'mark-lapid', wiki: 'Mark Lapid' },
  { slug: 'bing-guanzon', wiki: 'Rowena Guanzon' },
  { slug: 'benhur-abalos', wiki: 'Benjamin Abalos Jr.' },
  { slug: 'nicolas-torre-iii', wiki: 'Nicolas Torre III' },
  { slug: 'baste-duterte', wiki: 'Baste Duterte' },
  { slug: 'sonny-angara', wiki: 'Sonny Angara' },
  { slug: 'koko-pimentel', wiki: 'Koko Pimentel' },
  { slug: 'mark-villar', wiki: 'Mark Villar' },
  { slug: 'gringo-honasan', wiki: 'Gregorio Honasan' },
  { slug: 'francis-tolentino', wiki: 'Francis Tolentino' },
  { slug: 'willie-revillame', wiki: 'Willie Revillame' },
  { slug: 'bonifacio-bosita', wiki: 'Bonifacio Bosita' },
];

async function fetchWikiImage(wikiTitle) {
  try {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=600`;
    const res = await fetch(url, { headers: { 'User-Agent': 'ElectionSurveyBot/1.0 (contact@survey2028.ph)' } });
    const data = await res.json();
    const pages = data.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    return pages[pageId]?.thumbnail?.source || null;
  } catch (e) {
    console.error(`Error querying ${wikiTitle}:`, e.message);
    return null;
  }
}

async function downloadImage(imgUrl, destPath) {
  const res = await fetch(imgUrl, { headers: { 'User-Agent': 'ElectionSurveyBot/1.0 (contact@survey2028.ph)' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(destPath, Buffer.from(buffer));
}

async function main() {
  const targetDir = path.join(process.cwd(), 'public', 'uploads', 'candidates');
  console.log(`Checking portraits for ${CANDIDATES.length} candidates in ${targetDir}...`);

  for (const c of CANDIDATES) {
    console.log(`Searching portrait for ${c.wiki}...`);
    let imgUrl = await fetchWikiImage(c.wiki);
    
    // Fallback search if title mismatch
    if (!imgUrl) {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(c.wiki)}&gsrlimit=1&prop=pageimages&format=json&pithumbsize=600`;
      const sRes = await fetch(searchUrl, { headers: { 'User-Agent': 'ElectionSurveyBot/1.0 (contact@survey2028.ph)' } });
      const sData = await sRes.json();
      const sPages = sData.query?.pages || {};
      const firstPage = Object.values(sPages)[0];
      imgUrl = firstPage?.thumbnail?.source || null;
    }

    const destFile = path.join(targetDir, `${c.slug}-portrait.jpg`);

    if (imgUrl) {
      console.log(`  -> Downloading: ${imgUrl}`);
      try {
        await downloadImage(imgUrl, destFile);
        const stats = fs.statSync(destFile);
        console.log(`  -> Saved ${c.slug}-portrait.jpg (${(stats.size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error(`  -> Failed downloading ${imgUrl}: ${err.message}`);
      }
    } else {
      console.warn(`  -> No Wikipedia thumbnail found for ${c.wiki}`);
    }
  }

  console.log('Finished downloading portraits.');
}

main().catch(console.error);
