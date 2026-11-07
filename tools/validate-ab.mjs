import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const context = vm.createContext({});
vm.runInContext(fs.readFileSync(new URL('../site/data/questions-ab.js', import.meta.url), 'utf8'), context);
const bank = context.QUESTION_AB;
assert.equal(bank.length, 440);
const ids = new Set(), prompts = new Set(), counts = {};
for (const question of bank) {
  assert(!ids.has(question.id), `Duplicate ID: ${question.id}`);
  assert(!prompts.has(question.prompt), `Duplicate prompt: ${question.id}`);
  ids.add(question.id); prompts.add(question.prompt);
  assert.equal(question.options.length, 4, question.id);
  assert.equal(new Set(question.options).size, 4, `Duplicate options: ${question.id}`);
  assert(Number.isInteger(question.answer) && question.answer >= 0 && question.answer <= 3, question.id);
  assert(question.explanation.length > 20, `Missing explanation: ${question.id}`);
  if (['A.4','A.5','B.4'].includes(question.topic)) assert.equal(question.level, 'HL', question.id);
  for (const text of [question.prompt, question.explanation, ...question.options]) {
    assert.equal((text.match(/\$/g) || []).length % 2, 0, `Unbalanced math: ${question.id}`);
    assert(!/[\u0000-\u001f]/.test(text), `Control character: ${question.id}`);
    assert(!/\bNaN\b/.test(text), `Invalid value: ${question.id}`);
  }
  counts[question.topic] = (counts[question.topic] || 0) + 1;
}
for (const value of Object.values(counts)) assert.equal(value, 44);
console.log(JSON.stringify({ total:bank.length, perTopic:counts, status:'passed' }, null, 2));
