const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, 'dist');
const destination = path.join(root, '.retiehe');
fs.mkdirSync(destination, { recursive: true });

// Standard accounts accept the text files used by this site. The portrait
// remains hosted at its original public Tieba URL instead of requiring JPG hosting.
for (const filename of fs.readdirSync(source)) {
  if (/\.(?:html|css|js|md)$/i.test(filename)) {
    fs.copyFileSync(path.join(source, filename), path.join(destination, filename));
  }
}
const homepage = path.join(destination, 'index.html');
const favicon = fs.readFileSync(path.join(source, 'assets', 'favicon.svg'), 'utf8');
let html = fs.readFileSync(homepage, 'utf8');
html = html.replace('href="assets/favicon.svg"', `href="data:image/svg+xml,${encodeURIComponent(favicon)}"`);
html = html.replaceAll('src="assets/ding-song.jpg"', 'referrerpolicy="no-referrer" src="https://imgsrc.baidu.com/forum/pic/item/baa1cd11728b4710f83db7c9cbcec3fdfc0323a0.jpg"');
fs.writeFileSync(homepage, html, 'utf8');
console.log(`Prepared ${destination}`);
