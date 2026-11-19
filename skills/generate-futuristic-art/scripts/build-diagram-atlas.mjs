#!/usr/bin/env node
/** Build a portable, offline viewer and reproducible examples. Node built-ins only. */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { STUDIES, renderStudy } from './world-diagrams.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SOURCE = 'https://github.com/mankidev/antialgorithm/tree/766e30411195a9198afad38f3d76e08701ed4516';
const STORY = {
  'vascular-drive': {
    number: '01', category: 'VESSEL SYSTEMS', title: 'A drive with a circulation system',
    question: 'What if propulsion, cooling and repair evolved as one anatomy?',
    departure: 'A sectional anatomy replaces the familiar exhaust-and-hull silhouette. Branching vessels meet the manufactured engine at a functional transition.',
    panel: 'Tune the vascular drive', accent: '#a53c2d',
    controls: {
      load: 'Changes the illustrative energy field. The values are normalized artistic signals, not measured temperatures.',
      branches: 'Changes the number of primary channels around the drive. Count is a structural choice, not a surface texture.',
      fusion: 'Moves the material language between separated systems and a continuous organic–engineered assembly.'
    }
  },
  'grafted-span': {
    number: '02', category: 'CIVIL STRUCTURES', title: 'A crossing that grows its supports',
    question: 'Where does cultivated structure become manufactured infrastructure?',
    departure: 'A long engineering section exposes the joining logic. Rooted supports, repeated bays and the occupied deck provide different scales of evidence.',
    panel: 'Grow the structural span', accent: '#47705d',
    controls: {
      growth: 'Changes the extent of the cultivated support system and its transition into the span.',
      bays: 'Changes the repeated structural rhythm. More bays create a visibly different support topology.',
      load: 'Changes the conceptual load annotation. This drawing does not predict deflection or structural safety.'
    }
  },
  'climate-shell': {
    number: '03', category: 'PLANETARY INFRASTRUCTURE', title: 'A world inside a breathing shell',
    question: 'What would planetary architecture look like if it exchanged climate like an organ?',
    departure: 'An orbital cutaway reveals an incomplete, operating shell. Apertures, plate segmentation and circulation carry the composition.',
    panel: 'Open the planetary shell', accent: '#386e93',
    controls: {
      aperture: 'Opens or closes the conceptual ventilation apertures across the shell.',
      plates: 'Changes the number of major shell segments, rather than recoloring a fixed world.',
      circulation: 'Changes the illustrative circulation field. It is not a weather or fluid-dynamics calculation.'
    }
  }
};

const htmlEscape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const scriptSafe = value => value.replace(/<\/script/gi, '<\\/script').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const jsonForScript = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

/** The renderer is included verbatim as an inline ES module; it has no imports. */
export function renderAtlasHtml(rendererSource, seed = 731) {
  if (/^\s*import\s/m.test(rendererSource)) throw new Error('The offline renderer must not import external modules.');
  const initial = renderStudy(STUDIES[0].id, { seed });
  const nav = STUDIES.map((study, index) => {
    const story = STORY[study.id];
    if (!story) throw new Error(`No atlas narrative for study: ${study.id}`);
    return `<button class="study-choice" type="button" data-study="${htmlEscape(study.id)}" aria-pressed="${index === 0}"><span class="study-number">${story.number}</span><span><span class="study-category">${story.category}</span><strong>${htmlEscape(study.title)}</strong></span></button>`;
  }).join('\n');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="description" content="Three original, editable fictional engineering studies: a vascular drive, a grown structural span, and a planetary climate shell.">
<title>Engineered worlds — diagram atlas</title>
<style>
:root{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#262a29;background:#ebeae3;--paper:#f7f5ed;--line:#c9ccc3;--ink:#262a29;--muted:#5d655f;--accent:#a53c2d;font-synthesis:none}
*{box-sizing:border-box}body{margin:0}button,input{font:inherit}button,a,input{touch-action:manipulation}button{cursor:pointer}button:focus-visible,a:focus-visible,input:focus-visible{outline:3px solid #2373a2;outline-offset:4px}button:disabled{cursor:wait;opacity:.65}a{color:inherit;text-underline-offset:3px}button{color:inherit}.skip-link{position:fixed;left:16px;top:-70px;padding:12px 18px;background:white;z-index:20}.skip-link:focus{top:12px}.page{max-width:1744px;margin:auto;padding:32px 40px 24px}.masthead{display:flex;justify-content:space-between;gap:30px;align-items:flex-start;border-top:3px solid var(--ink);padding-top:17px}.kicker,.study-category,.eyebrow{font-size:11px;letter-spacing:.13em;font-weight:750}.kicker{display:flex;align-items:center;gap:9px}.dot{width:7px;height:7px;border-radius:50%;background:var(--accent)}h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(36px,4vw,57px);font-weight:400;letter-spacing:-.04em;line-height:1.05;margin:13px 0 12px}.intro{font-size:15px;line-height:1.5;max-width:650px;margin:0;color:var(--muted)}.edition{text-align:right;font-size:12px;line-height:1.6;min-width:190px}.edition strong{font-weight:700;color:var(--ink)}.edition p{margin:0;color:var(--muted)}.study-nav{display:grid;grid-template-columns:repeat(3,1fr);margin-top:27px;border-bottom:1px solid var(--line);border-top:1px solid var(--line)}.study-choice{display:flex;gap:12px;align-items:center;text-align:left;min-height:80px;background:transparent;border:0;border-right:1px solid var(--line);padding:16px 20px}.study-choice:first-child{padding-left:0}.study-choice:last-child{border-right:0;padding-right:0}.study-choice[aria-pressed="true"]{box-shadow:inset 0 -3px var(--accent)}.study-choice[aria-pressed="true"] .study-number{background:var(--ink);color:var(--paper)}.study-number{width:30px;height:30px;border:1px solid var(--line);display:grid;place-items:center;font-size:12px;font-variant-numeric:tabular-nums;flex:none}.study-category{display:block;font-size:9px;line-height:1.5;color:var(--muted);margin-bottom:5px}.study-choice strong{font-size:14px;font-weight:650;line-height:1.25;display:block}.choice-arrow{margin-left:auto;color:var(--muted);font-size:20px}.workspace{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:30px;margin-top:24px}.drawing-section{min-width:0}.drawing-head{display:flex;justify-content:space-between;align-items:end;gap:20px;margin-bottom:13px}.drawing-head h2{font-family:Georgia,"Times New Roman",serif;font-size:27px;font-weight:400;letter-spacing:-.02em;margin:7px 0 0}.drawing-head .eyebrow{color:var(--accent);font-size:10px}.text-button{background:none;border:0;border-bottom:1px solid currentColor;padding:3px 0;font-size:12px;white-space:nowrap}.viewer{background:#111a20;line-height:0;border:1px solid #b9bcb3;overflow:hidden}.viewer svg{width:100%;height:auto;display:block}.drawing-foot{display:flex;justify-content:space-between;gap:22px;font-size:11px;line-height:1.55;color:var(--muted);padding-top:9px}.drawing-foot p{margin:0;max-width:680px}.drawing-foot .revision{font-variant-numeric:tabular-nums;white-space:nowrap}.question{font-family:Georgia,"Times New Roman",serif;font-weight:400;font-size:23px;line-height:1.25;margin:21px 0 9px}.departure{font-size:14px;line-height:1.6;margin:0;max-width:890px;color:var(--muted)}.control-panel{border-top:3px solid var(--accent);padding-top:13px}.panel-heading{font-size:17px;line-height:1.3;margin:0 0 8px;font-weight:650}.panel-intro{font-size:12px;line-height:1.55;color:var(--muted);margin:0 0 18px}.control{padding:13px 0 15px;border-top:1px solid var(--line)}.control-label{display:flex;justify-content:space-between;align-items:baseline;gap:12px;font-size:13px;font-weight:650}.control-value{font-variant-numeric:tabular-nums;font-weight:500;color:var(--accent)}input[type="range"]{width:100%;margin:13px 0 7px;height:22px;accent-color:var(--accent)}.control-help{font-size:11px;line-height:1.5;color:var(--muted);margin:0}.range-limits{display:flex;justify-content:space-between;color:var(--muted);font-size:10px;font-variant-numeric:tabular-nums;margin-bottom:8px}.replay{margin-top:6px;padding-top:16px;border-top:1px solid var(--line)}.seed-label{font-size:12px;font-weight:650;display:block;margin-bottom:8px}.seed-row{display:flex;gap:7px}input[type="number"]{min-width:0;width:100%;border:1px solid #a5ada3;border-radius:0;background:var(--paper);padding:8px 9px;font-size:14px;font-variant-numeric:tabular-nums}.small-button,.primary-button,.secondary-button{border:1px solid var(--ink);background:transparent;padding:9px 12px;font-size:12px;font-weight:650;line-height:1.3}.small-button{white-space:nowrap}.seed-help{font-size:10px;line-height:1.55;margin:8px 0 11px;color:var(--muted)}.text-actions{display:flex;gap:17px;flex-wrap:wrap}.text-actions .text-button{font-size:11px}.export-actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:20px}.primary-button{background:var(--ink);color:var(--paper)}.import-line{margin-top:12px;display:flex;justify-content:space-between;align-items:center;gap:15px}.import-note{font-size:10px;color:var(--muted)}#status{font-size:11px;line-height:1.55;color:var(--muted);min-height:35px;margin:14px 0 0}#error{font-size:12px;line-height:1.5;margin:14px 0 0;padding:10px;border-left:3px solid #a63024;background:#f7ded7;color:#7a2118}footer{border-top:1px solid var(--line);margin-top:30px;padding-top:13px;display:flex;justify-content:space-between;gap:30px;font-size:10px;line-height:1.6;color:var(--muted)}footer p{margin:0;max-width:820px}noscript{display:block;background:#fff1bb;padding:12px;font-size:14px}.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap}dialog{border:1px solid #686e69;padding:0;width:calc(100% - 32px);max-width:1500px;height:calc(100% - 32px);background:var(--paper);color:var(--ink)}dialog::backdrop{background:#101716cc}.dialog-head{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:12px 16px;border-bottom:1px solid var(--line)}.dialog-head h2{font-size:14px;margin:0}.dialog-head p{font-size:11px;margin:4px 0 0;color:var(--muted)}.dialog-drawing{overflow:auto;height:calc(100% - 73px);padding:0;background:#c6c7c1}.dialog-drawing svg{display:block;width:1440px;height:1000px;max-width:none;margin:0 auto}.dialog-drawing:focus-visible{outline:3px solid #2373a2;outline-offset:-3px}[hidden]{display:none!important}
@media(min-width:1600px){.workspace{grid-template-columns:minmax(0,1fr) 320px;gap:36px}.page{padding-left:40px;padding-right:40px}}
@media(max-width:1100px){.page{padding:24px}.workspace{grid-template-columns:minmax(0,1fr) 265px;gap:22px}.drawing-head h2{font-size:23px}.study-choice{padding:14px 12px}.study-choice strong{font-size:12px}.choice-arrow{display:none}}
@media(max-width:800px){.workspace{grid-template-columns:1fr}.control-panel{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 25px}.panel-heading,.panel-intro,#controls{grid-column:1 / -1}#controls{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:17px}.replay{margin:0}.export-block{border-top:1px solid var(--line)}.export-actions{margin-top:16px}.drawing-foot .revision{display:none}.drawing-head h2{font-size:26px}.edition{min-width:150px}.study-nav{margin-top:22px}.study-category{font-size:8px}.study-choice{gap:8px}.study-number{width:24px;height:24px;font-size:10px}}
@media(max-width:560px){.page{padding:19px 16px 20px}.masthead{display:block;padding-top:13px}.edition{display:none}.kicker{font-size:9px}h1{font-size:42px;line-height:1.02;margin-top:14px}.intro{font-size:13px;line-height:1.5}.study-nav{grid-template-columns:1fr;margin-top:20px}.study-choice,.study-choice:first-child,.study-choice:last-child{padding:12px 0;border-right:0;border-bottom:1px solid var(--line);min-height:57px;gap:11px}.study-choice:last-child{border-bottom:0}.study-choice[aria-pressed="true"]{box-shadow:none}.study-choice[aria-pressed="true"] strong{color:var(--accent)}.study-category{font-size:8px;margin-bottom:2px}.study-choice strong{font-size:13px}.choice-arrow{display:block}.workspace{margin-top:20px;gap:24px}.drawing-head{align-items:start;gap:12px}.drawing-head h2{font-size:24px}.drawing-head .text-button{margin-top:23px;font-size:10px}.drawing-foot{font-size:10px}.question{font-size:23px}.departure{font-size:13px}.control-panel{display:block}#controls{display:block}.control{padding-top:15px;padding-bottom:16px}.control-label{font-size:14px}.control-help{font-size:12px}.range-limits{font-size:11px}.replay{padding-top:18px}.export-block{margin-top:18px;padding-top:0;border:0}.export-actions{margin-top:0}.small-button,.primary-button,.secondary-button{padding:11px 13px}.seed-help,.import-note{font-size:11px}.text-actions .text-button,.import-line .text-button{font-size:12px}#status{font-size:12px;min-height:22px}footer{display:block;margin-top:22px;font-size:10px}footer p+p{margin-top:9px}dialog{width:calc(100% - 12px);height:calc(100% - 12px)}.dialog-head{padding:11px}.dialog-head h2{font-size:12px}.dialog-head p{font-size:10px}.dialog-drawing{height:calc(100% - 73px)}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
</style>
</head>
<body>
<a class="skip-link" href="#drawing-title">Skip to the drawing</a>
<div class="page">
  <header class="masthead">
    <div><div class="kicker"><span class="dot" aria-hidden="true"></span>FUTURISTIC WORLDS / FIELD STUDIES</div><h1>Engineered worlds.</h1><p class="intro">Three ways organic growth and advanced technology could converge. Change the mechanism, inspect the structure, keep the recipe.</p></div>
    <div class="edition"><strong>Diagram atlas / 01–03</strong><p>Original speculative studies<br>Editable SVG · deterministic seeds<br>Offline · no external assets</p></div>
  </header>
  <nav class="study-nav" aria-label="Choose a diagram study">${nav}</nav>
  <noscript>The first study is available below. Enable JavaScript to change parameters and export from this viewer, or open the three SVG and recipe files included alongside it.</noscript>
  <main class="workspace">
    <section class="drawing-section" aria-labelledby="drawing-title">
      <div class="drawing-head"><div><div class="eyebrow" id="drawing-category">01 / VESSEL SYSTEMS</div><h2 id="drawing-title" tabindex="-1">A drive with a circulation system</h2></div><button id="full-size" class="text-button" type="button" aria-haspopup="dialog">Inspect full size</button></div>
      <div class="viewer" id="viewer">${initial.svg}</div>
      <div class="drawing-foot"><p>Fictional engineering study. Fields and values are synthetic and normalized; they do not report a physical simulation.</p><span class="revision" id="revision">SEED ${seed} / SVG 1440 × 1000</span></div>
      <h3 class="question" id="question">${STORY['vascular-drive'].question}</h3><p class="departure" id="departure">${STORY['vascular-drive'].departure}</p>
    </section>
    <aside class="control-panel" aria-labelledby="panel-title">
      <h2 class="panel-heading" id="panel-title">Tune the vascular drive</h2><p class="panel-intro">Each control changes the drawing. Save the recipe to replay the same geometry and settings.</p>
      <div id="controls"></div>
      <form class="replay" id="seed-form"><label class="seed-label" for="seed">Geometry seed</label><div class="seed-row"><input id="seed" name="seed" type="number" min="0" max="4294967295" step="1" value="${seed}" required aria-describedby="seed-help"><button type="submit" class="small-button">Apply</button></div><p class="seed-help" id="seed-help">Integer from 0 to 4,294,967,295. The same recipe and renderer version reproduce the same SVG.</p><div class="text-actions"><button class="text-button" type="button" id="next-seed">Next seed</button><button class="text-button" type="button" id="reset">Reset this study</button></div></form>
      <div class="export-block"><div class="export-actions"><button type="button" class="primary-button" id="export-svg">Export SVG</button><button type="button" class="secondary-button" id="export-recipe">Save recipe</button></div><div class="import-line"><button type="button" class="text-button" id="import-recipe">Load recipe</button><span class="import-note">JSON / version 1</span><input id="recipe-file" type="file" accept=".json,application/json" hidden></div><p id="error" role="alert" hidden></p><p id="status" role="status" aria-live="polite">Ready. Select a study or change a parameter.</p></div>
    </aside>
  </main>
  <footer><p>Creative method adapted from <a href="${SOURCE}" target="_blank" rel="noreferrer">Antialgorithm</a> at commit 766e304. Geometry, controls and the three speculative systems are original to this skill. Antialgorithm does not supply these renderers.</p><p>Static by default. No telemetry or network dependency.<br>Use SVG export for vector editing and print.</p></footer>
</div>
<dialog id="drawing-dialog" aria-labelledby="dialog-title"><div class="dialog-head"><div><h2 id="dialog-title">Original-size drawing</h2><p>1440 × 1000 pixels. Scroll to inspect detail; press Escape to close.</p></div><button type="button" id="close-dialog" class="small-button">Close</button></div><div id="dialog-drawing" class="dialog-drawing" tabindex="0" role="region" aria-label="Scrollable full-size diagram"></div></dialog>
<script type="module">
${scriptSafe(rendererSource)}
const atlasStory = ${jsonForScript(STORY)};
const initialSeed = ${seed};
const byId = id => document.getElementById(id);
const viewer = byId('viewer');
const status = byId('status');
const errorBox = byId('error');
const seedInput = byId('seed');
let selected = STUDIES[0].id;
let current;
let drawFrame;
const saved = Object.fromEntries(STUDIES.map(study => [study.id, { ...study.defaults, seed: initialSeed }]));
const studyFor = id => STUDIES.find(study => study.id === id);
const showError = message => { errorBox.textContent = message; errorBox.hidden = false; status.textContent = 'The last valid drawing is still available.'; };
const clearError = () => { errorBox.hidden = true; errorBox.textContent = ''; seedInput.removeAttribute('aria-invalid'); };
const formatValue = (control, value) => control.step >= 1 ? String(value) : Math.round(value * 100) + '%';
function draw(message = '') {
  clearError();
  try {
    current = renderStudy(selected, saved[selected]);
    if (byId('drawing-dialog').open) byId('dialog-drawing').innerHTML = current.svg;
    else viewer.innerHTML = current.svg;
    byId('revision').textContent = 'SEED ' + current.manifest.seed + ' / SVG 1440 × 1000';
    if (message) status.textContent = message;
  } catch (error) { showError(error.message); }
}
function createControls(study) {
  const container = byId('controls');
  container.replaceChildren();
  for (const control of study.controls) {
    const block = document.createElement('div'); block.className = 'control';
    const line = document.createElement('div'); line.className = 'control-label';
    const label = document.createElement('label'); label.htmlFor = 'control-' + control.key; label.textContent = control.label;
    const output = document.createElement('output'); output.className = 'control-value'; output.htmlFor = 'control-' + control.key;
    const slider = document.createElement('input'); slider.id = 'control-' + control.key; slider.type = 'range'; slider.min = control.min; slider.max = control.max; slider.step = control.step; slider.value = saved[selected][control.key]; slider.setAttribute('aria-describedby', 'help-' + control.key);
    output.textContent = formatValue(control, Number(slider.value));
    const limits = document.createElement('div'); limits.className = 'range-limits';
    const low = document.createElement('span'); low.textContent = formatValue(control, control.min);
    const high = document.createElement('span'); high.textContent = formatValue(control, control.max); limits.append(low, high);
    const help = document.createElement('p'); help.className = 'control-help'; help.id = 'help-' + control.key; help.textContent = atlasStory[selected].controls[control.key];
    slider.addEventListener('input', () => {
      saved[selected][control.key] = Number(slider.value); output.textContent = formatValue(control, Number(slider.value));
      cancelAnimationFrame(drawFrame); drawFrame = requestAnimationFrame(() => draw(control.label + ' updated to ' + output.textContent + '.'));
    });
    line.append(label, output); block.append(line, slider, limits, help); container.append(block);
  }
}
function selectStudy(id, announce = true) {
  const study = studyFor(id); if (!study) throw new Error('Unknown study.');
  cancelAnimationFrame(drawFrame);
  selected = id;
  const story = atlasStory[id];
  document.documentElement.style.setProperty('--accent', story.accent);
  document.querySelectorAll('[data-study]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.study === id)));
  byId('drawing-category').textContent = story.number + ' / ' + story.category;
  byId('drawing-title').textContent = story.title; byId('panel-title').textContent = story.panel;
  byId('question').textContent = story.question; byId('departure').textContent = story.departure;
  byId('dialog-title').textContent = study.title + ' / original size';
  seedInput.value = saved[id].seed;
  createControls(study);
  draw(announce ? study.title + ' selected. Settings for each study are retained during this visit.' : 'Ready. Select a study or change a parameter.');
}
function applySeed(value) {
  try {
    const candidate = { ...saved[selected], seed: value };
    renderStudy(selected, candidate);
    saved[selected] = candidate; seedInput.value = value; draw('Seed ' + value + ' applied.');
  } catch (error) { showError(error.message); seedInput.setAttribute('aria-invalid', 'true'); }
}
document.querySelectorAll('[data-study]').forEach(button => button.addEventListener('click', () => selectStudy(button.dataset.study)));
byId('seed-form').addEventListener('submit', event => { event.preventDefault(); const value = seedInput.value.trim(); if (!value) { showError('Enter a whole-number seed.'); seedInput.setAttribute('aria-invalid', 'true'); return; } applySeed(Number(value)); });
byId('next-seed').addEventListener('click', () => applySeed((saved[selected].seed + 1) >>> 0));
byId('reset').addEventListener('click', () => { saved[selected] = { ...studyFor(selected).defaults, seed: initialSeed }; selectStudy(selected, false); status.textContent = 'This study has been reset to its original recipe.'; });
function download(text, type, extension) {
  const blob = new Blob([text], { type }); const url = URL.createObjectURL(blob);
  const link = document.createElement('a'); link.href = url; link.download = selected + '-seed-' + current.manifest.seed + extension; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}
byId('export-svg').addEventListener('click', () => { draw(); download(current.svg, 'image/svg+xml;charset=utf-8', '.svg'); status.textContent = 'SVG export prepared. All visible labels remain editable vector text.'; });
byId('export-recipe').addEventListener('click', () => { draw(); download(JSON.stringify(current.manifest, null, 2) + '\\n', 'application/json', '.recipe.json'); status.textContent = 'Recipe export prepared. Keep the renderer version with it for exact replay.'; });
byId('import-recipe').addEventListener('click', () => byId('recipe-file').click());
byId('recipe-file').addEventListener('change', async event => {
  const file = event.target.files[0]; if (!file) return;
  try {
    if (file.size > 65536) throw new Error('Recipe files must be smaller than 64 KiB.');
    const recipe = JSON.parse(await file.text());
    if (!recipe || typeof recipe !== 'object' || Array.isArray(recipe)) throw new Error('The recipe must be a JSON object.');
    if (recipe.version !== 1 || recipe.generatorVersion !== current.manifest.generatorVersion) throw new Error('This recipe uses an unsupported format or renderer version.');
    if (!Object.hasOwn(recipe, 'seed') || !Number.isInteger(recipe.seed) || recipe.seed < 0 || recipe.seed > 4294967295) throw new Error('The recipe must include an unsigned 32-bit integer seed.');
    const study = studyFor(recipe.kind); if (!study) throw new Error('The recipe names an unknown study.');
    if (recipe.width !== 1440 || recipe.height !== 1000) throw new Error('The recipe has unsupported drawing dimensions.');
    if (!recipe.params || typeof recipe.params !== 'object' || Array.isArray(recipe.params)) throw new Error('The recipe is missing its parameter object.');
    const keys = study.controls.map(control => control.key);
    if (Object.keys(recipe.params).length !== keys.length || Object.keys(recipe.params).some(key => !keys.includes(key))) throw new Error('The recipe must contain exactly the controls for its study.');
    const candidate = { ...recipe.params, seed: recipe.seed };
    const checked = renderStudy(recipe.kind, candidate);
    saved[recipe.kind] = { ...checked.manifest.params, seed: checked.manifest.seed };
    selectStudy(recipe.kind, false); status.textContent = 'Recipe loaded and validated. The drawing has been reconstructed.';
  } catch (error) { showError('Recipe not loaded: ' + error.message); }
  finally { event.target.value = ''; }
});
byId('full-size').addEventListener('click', () => { byId('dialog-drawing').replaceChildren(viewer.firstElementChild); byId('drawing-dialog').showModal(); byId('dialog-drawing').focus(); });
byId('close-dialog').addEventListener('click', () => byId('drawing-dialog').close());
byId('drawing-dialog').addEventListener('close', () => { if (byId('dialog-drawing').firstElementChild) viewer.replaceChildren(byId('dialog-drawing').firstElementChild); });
selectStudy(selected, false);
</script>
</body>
</html>\n`;
}

/** Build original vectors, machine-readable recipes and the single-file viewer. */
export async function buildAtlas({ outDir, seed = 731 } = {}) {
  if (typeof outDir !== 'string' || !outDir.trim()) throw new Error('Provide a nonempty output directory.');
  const rendered = STUDIES.map(study => ({ study, ...renderStudy(study.id, { seed }) }));
  const rendererSource = await readFile(join(HERE, 'world-diagrams.mjs'), 'utf8');
  const html = renderAtlasHtml(rendererSource, seed);
  const target = resolve(outDir);
  await mkdir(target, { recursive: true });
  const files = [];
  for (const { study, svg, manifest } of rendered) {
    for (const [name, contents] of [[study.id + '.svg', svg], [study.id + '.recipe.json', JSON.stringify(manifest, null, 2) + '\n']]) {
      await writeFile(join(target, name), contents, 'utf8'); files.push(name);
    }
  }
  await writeFile(join(target, 'atlas.html'), html, 'utf8'); files.push('atlas.html');
  const readme = `ENGINEERED WORLDS — ORIGINAL DIAGRAM ATLAS\n\nOpen atlas.html in a modern browser. The viewer works offline. No server, network request or installation is required.\n\nThree original studies\n${STUDIES.map(study => '- ' + study.title + ': ' + study.id + '.svg').join('\n')}\n\nUse the study controls to change the mechanism and composition. Apply a geometry seed, save the SVG or save a JSON recipe. Load a saved recipe to reconstruct a drawing. Inspect full size opens a scrollable native-size view; Escape closes it.\n\nThe SVG files contain editable vector geometry and text. The associated recipe JSON records the exact renderer version, seed and parameters. Original example seed: ${seed}. Exact replay requires the same renderer version; the recipe is not an embedded copy of the generator.\n\nThese are fictional engineering studies. Thermal, load and circulation marks are synthetic, normalized artistic signals. They do not claim a physical simulation, measured performance or engineering validation.\n\nCreative decision process adapted from Antialgorithm, pinned at 766e30411195a9198afad38f3d76e08701ed4516:\n${SOURCE}\nThe seeded geometry, controls, viewer and speculative systems are original additions. Antialgorithm is not a renderer or simulation dependency.\n`;
  await writeFile(join(target, 'README.txt'), readme, 'utf8'); files.push('README.txt');
  return { outDir: target, files };
}

async function main(argv) {
  let outDir;
  let seed = 731;
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      process.stdout.write('Usage: node build-diagram-atlas.mjs --out-dir PATH [--seed UINT32]\nBuilds an offline HTML atlas, three original SVG studies and their JSON recipes.\n');
      return;
    }
    if (arg === '--out-dir') { outDir = argv[++index]; continue; }
    if (arg === '--seed') {
      const raw = argv[++index];
      if (!raw || !/^\d+$/.test(raw)) throw new Error('--seed requires an unsigned whole number.');
      seed = Number(raw); continue;
    }
    throw new Error('Unknown argument: ' + arg);
  }
  const result = await buildAtlas({ outDir, seed });
  process.stdout.write('Built ' + result.files.length + ' files in ' + result.outDir + '\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  main(process.argv.slice(2)).catch(error => { process.stderr.write('Diagram atlas: ' + error.message + '\n'); process.exitCode = 1; });
}
