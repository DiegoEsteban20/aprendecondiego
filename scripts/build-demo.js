import { spawnSync } from 'node:child_process';
import { mkdtemp, writeFile, copyFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const executable = process.argv[2] || 'ffmpeg';
const font = process.argv[3] || (process.platform === 'win32' ? 'C:/Windows/Fonts/segoeui.ttf' : '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf');
const fontFilter = font.replaceAll('\\', '/').replaceAll(':', '\\:');
const root = new URL('../public/', import.meta.url);
const temporary = await mkdtemp(join(tmpdir(), 'aprendecondiego-demo-'));
const scenes = [
  ['demo-lab.jpg', '01 / INVESTIGA', 'Casos sintéticos. Las pistas no certifican seguridad.'],
  ['demo-academy.jpg', '02 / ESTUDIA', 'Veinte lecciones de redes y ciberseguridad.'],
  ['demo-visuals.jpg', '03 / OBSERVA', 'TCP, NAT/PAT y segmentación. Diagramas educativos.'],
  ['demo-workshop.jpg', '04 / PRACTICA', 'Trazas, políticas y casos guiados. Progreso local.']
];
const clips = [];
for (const [index, [filename, title, subtitle]] of scenes.entries()) {
  const output = join(temporary, `scene-${index}.mp4`);
  const filter = `scale=1280:610:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:0:color=0x0b1016,drawbox=x=0:y=610:w=iw:h=110:color=0x111923:t=fill,drawtext=fontfile='${fontFilter}':text='${title}':fontcolor=0xb8f479:fontsize=27:x=35:y=625,drawtext=fontfile='${fontFilter}':text='${subtitle}':fontcolor=white:fontsize=22:x=35:y=667`;
  const result = spawnSync(executable, ['-y', '-loop', '1', '-framerate', '12', '-i', fileURLToPath(new URL(filename, root)), '-t', '6', '-vf', filter, '-c:v', 'libx264', '-preset', 'fast', '-crf', '22', '-pix_fmt', 'yuv420p', '-an', output], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'No se pudo crear el video.');
  clips.push(`file '${output.replaceAll('\\', '/')}'`);
}
const manifest = join(temporary, 'clips.txt');
await writeFile(manifest, clips.join('\n'));
const result = spawnSync(executable, ['-y', '-f', 'concat', '-safe', '0', '-i', manifest, '-c', 'copy', '-movflags', '+faststart', fileURLToPath(new URL('demo.mp4', root))], { encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'No se pudo unir el video.');
await copyFile(new URL('demo-workshop.jpg', root), new URL('demo-poster.jpg', root));
console.log('Demo: public/demo.mp4 · 24 s · 1280×720 · sin audio · capturas reales con rótulos.');
