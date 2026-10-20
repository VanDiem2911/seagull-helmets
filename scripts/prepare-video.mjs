// Turns the newest clip in assets-src/video/ into a web-friendly public/videos/reel.mp4 (+ poster).
// Needs ffmpeg on PATH.  Run with: npm run video
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const srcDir = path.join(root, 'assets-src', 'video');
const outDir = path.join(root, 'public', 'videos');

const clips = fs.existsSync(srcDir)
  ? fs.readdirSync(srcDir).filter((f) => /\.(mp4|mov|m4v|webm|mkv)$/i.test(f)).map((f) => ({ f, t: fs.statSync(path.join(srcDir, f)).mtimeMs })).sort((a, b) => b.t - a.t)
  : [];
if (!clips.length) {
  console.log('No video found in assets-src/video – drop an .mp4/.mov there and run again.');
  process.exit(0);
}
fs.mkdirSync(outDir, { recursive: true });
const input = path.join(srcDir, clips[0].f);
const mp4 = path.join(outDir, 'reel.mp4');
const poster = path.join(outDir, 'reel-poster.jpg');

// H.264, max 1280px on the long side, no audio (it autoplays muted), fast start for streaming
execFileSync('ffmpeg', ['-y', '-i', input, '-an', '-vf', "scale='if(gt(iw,ih),min(1280,iw),-2)':'if(gt(iw,ih),-2,min(1280,ih))'", '-c:v', 'libx264', '-preset', 'slow', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', mp4], { stdio: 'inherit' });
execFileSync('ffmpeg', ['-y', '-ss', '1', '-i', mp4, '-frames:v', '1', '-q:v', '3', poster], { stdio: 'inherit' });
console.log(`Video ready: ${path.relative(root, mp4)} (from ${clips[0].f})`);
