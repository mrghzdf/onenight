const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const audioDir = path.join(root, 'assets', 'audio');
const outFile = path.join(root, 'src', 'audioTracks.js');

const supported = new Set(['.mp3', '.m4a', '.wav']);

const files = fs
  .readdirSync(audioDir)
  .filter((file) => {
    const ext = path.extname(file).toLowerCase();
    return file.toLowerCase().startsWith('trilha') && supported.has(ext);
  })
  .sort((a, b) => a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' }));

const entries = files.map((file, index) => {
  const key = `track${index + 1}`;
  const label = path.basename(file, path.extname(file));
  const normalizedLabel = label
    .replace(/[_-]+/g, ' ')
    .replace(/([a-zA-Z])(\d)/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    key,
    file,
    label: normalizedLabel.charAt(0).toUpperCase() + normalizedLabel.slice(1),
  };
});

let defaultTrackKey = entries[0]?.key || '';
const preferred = entries.find((entry) => entry.file.toLowerCase() === 'trilha2.mp3');
if (preferred) {
  defaultTrackKey = preferred.key;
}

const lines = [];
lines.push('// AUTO-GENERATED FILE. DO NOT EDIT MANUALLY.');
lines.push('// Run: node scripts/generate-audio-tracks.js');
lines.push('');
lines.push('export const AUDIO_TRACKS = [');
for (const entry of entries) {
  lines.push('  {');
  lines.push(`    key: '${entry.key}',`);
  lines.push(`    fileName: '${entry.file}',`);
  lines.push(`    label: '${entry.label}',`);
  lines.push(`    source: require('../assets/audio/${entry.file}'),`);
  lines.push('  },');
}
lines.push('];');
lines.push('');
lines.push(`export const DEFAULT_TRACK_KEY = '${defaultTrackKey}';`);
lines.push('');

fs.writeFileSync(outFile, `${lines.join('\n')}\n`, 'utf8');
console.log(`Generated ${path.relative(root, outFile)} with ${entries.length} track(s).`);
