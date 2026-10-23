import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const TOP_FILES = ['index.html', 'app.js', 'styles.css', 'sw.js', 'manifest.json'];
const DIRS = ['icons', 'src', 'data'];

function walk(root, rel) {
  const dir = path.join(root, rel);
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const child = path.posix.join(rel.split(path.sep).join('/'), e.name);
    return e.isDirectory() ? walk(root, child) : [child];
  });
}

export function listSiteFiles(root) {
  const files = TOP_FILES.filter((f) => fs.existsSync(path.join(root, f)));
  for (const d of DIRS) if (fs.existsSync(path.join(root, d))) files.push(...walk(root, d));
  return files.sort();
}

export function buildSite({ root, out, dataDir, build = 'dev' }) {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });
  let files = listSiteFiles(root);
  if (dataDir) files = files.filter((f) => !f.startsWith('data/'));
  for (const f of files) {
    fs.mkdirSync(path.dirname(path.join(out, f)), { recursive: true });
    fs.copyFileSync(path.join(root, f), path.join(out, f));
  }
  if (dataDir) {
    for (const f of walk(path.dirname(path.resolve(dataDir)), path.basename(path.resolve(dataDir)))) {
      const target = path.join(out, 'data', f.split('/').slice(1).join('/'));
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.copyFileSync(path.join(path.dirname(path.resolve(dataDir)), f), target);
      files.push(`data/${f.split('/').slice(1).join('/')}`);
    }
  }
  const shell = files.filter((f) => !f.startsWith('data/'));
  fs.writeFileSync(path.join(out, 'precache.json'), JSON.stringify(['./', ...shell], null, 2) + '\n');
  const sw = path.join(out, 'sw.js');
  if (fs.existsSync(sw)) fs.writeFileSync(sw, fs.readFileSync(sw, 'utf8').split('__BUILD__').join(build));
  return { files: files.sort() };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const opt = (name, fallback) => (args.includes(name) ? args[args.indexOf(name) + 1] : fallback);
  const { files } = buildSite({ root: '.', out: opt('--out', '_site'), dataDir: opt('--data'), build: opt('--build', 'dev') });
  console.log(`built ${files.length} files into ${opt('--out', '_site')}`);
}
