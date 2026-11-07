import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('../site/data/questions-cde.js');
const katex = require('../site/vendor/katex.js');
const bank = globalThis.QUESTION_CDE;
const errors = [];
for (const q of bank) {
  if (q.options.length !== 4 || new Set(q.options).size !== 4) errors.push(`${q.id}: invalid options`);
  if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer > 3) errors.push(`${q.id}: invalid answer`);
  if (bank.findIndex(x => x.id === q.id) !== bank.indexOf(q)) errors.push(`${q.id}: duplicate id`);
  for (const s of [q.prompt, ...q.options, q.explanation]) {
    if (/NaN|undefined|Infinity/.test(s)) errors.push(`${q.id}: invalid numeric value`);
    if ((s.match(/\$/g) || []).length % 2) errors.push(`${q.id}: unmatched math delimiter`);
    for (const match of s.matchAll(/\$([^$]+)\$/g)) {
      try { katex.renderToString(match[1], { throwOnError: true, strict: false }); }
      catch (err) { errors.push(`${q.id}: ${err.message}`); }
    }
  }
}
const topics = Object.fromEntries([...new Set(bank.map(q=>q.topic))].map(t=>[t,bank.filter(q=>q.topic===t).length]));
if (bank.length !== 560 || Object.values(topics).some(n=>n!==40)) errors.push('Coverage count mismatch');
console.log(JSON.stringify({ questions: bank.length, topics, errors }, null, 2));
if (errors.length) process.exitCode = 1;
