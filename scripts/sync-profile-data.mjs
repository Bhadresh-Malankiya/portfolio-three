// Regenerate the legacy reference from the canonical TypeScript data, without
// making a second manually maintained biography or executing application code.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import ts from 'typescript';
const root = process.cwd();
const cache = new Map();
function readData(name) {
  const filename = path.join(root, 'src/data', `${name}.ts`);
  if (cache.has(filename)) return cache.get(filename);
  const dataModule = { exports: {} };
  cache.set(filename, dataModule.exports);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const requireData = (specifier) => {
    if (!specifier.startsWith('@/data/')) throw new Error(`Unexpected dependency: ${specifier}`);
    return readData(specifier.slice('@/data/'.length));
  };
  vm.runInNewContext(code, { module: dataModule, exports: dataModule.exports, require: requireData }, { filename });
  cache.set(filename, dataModule.exports);
  return dataModule.exports;
}
const names = ['profile', 'experience', 'portfolio', 'projects', 'chapters', 'skills', 'impact', 'downloads', 'fieldGuides', 'upwork'];
const header = `# Bhadreshkumar Malankiya — Complete Profile Data\n\nGenerated reference snapshot of the canonical public data in src/data. Regenerate with \`node scripts/sync-profile-data.mjs\` after editing those files. This file is a reference, not an independent source of verified claims.\n\nEmployment titles and dates reflect the supplied employer records. MB Systems dates and team context reflect the author's clarification. Historical product figures and performance outcomes are author-reported, not independently audited benchmarks. Overlapping employment and venture periods do not add extra years of experience.\n\nThe portfolio presentation distinguishes employer products (ExtendedForms and Quzo), founder work (AscendXI/VocalXI) and personal builds (HelpDesk AI). The projects archive is retained for historical scope; the portfolio module contains the current presentation. Source documents remain ignored.\n`;
const sections = names.map((name) => `\n## ${name}\n\nSource: src/data/${name}.ts\n\n\`\`\`json\n${JSON.stringify(readData(name), null, 2)}\n\`\`\`\n`);
const output = header + sections.join('');
if (process.argv.includes('--check')) {
  if (fs.readFileSync(path.join(root, 'PROFILE-DATA.md'), 'utf8') !== output) {
    console.error('PROFILE-DATA.md is stale; run node scripts/sync-profile-data.mjs');
    process.exitCode = 1;
  }
} else fs.writeFileSync(path.join(root, 'PROFILE-DATA.md'), output);
