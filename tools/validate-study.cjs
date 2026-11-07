const k=require('../site/vendor/katex.js');
require('../site/data/formulas.js');
require('../site/data/lessons.js');
require('../site/data/flashcards.js');
let n=0;const errors=[];
function check(tex,where){n++;try{k.renderToString(tex,{throwOnError:true,strict:'error'});}catch(e){errors.push({where,tex,error:e.message});}}
function prose(s,w){for(const m of s.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$]+)\$/g))check(m[1]||m[2],w);}
for(const f of FORMULAS){check(f.tex,f.name);for(const v of f.variables)check(v.symbol,f.name+' symbol');prose(f.explanation,f.name);}
for(const c of CONSTANTS){check(c.symbol,c.name);check(c.tex,c.name);}
for(const c of CONVERSIONS)check(c[0],'conversion');
for(const t of TOPICS){for(const s of t.sections)prose(s.body,t.id+' '+s.title);for(const eq of t.equations)check(eq.tex,t.id);prose(t.worked.solution,t.id+' worked');}
for(const c of FLASHCARDS){prose(c.definition,c.id);prose(c.detail,c.id);}
console.log(JSON.stringify({parsed:n,errors},null,2));
process.exitCode=errors.length?1:0;
