"""Package the self-contained site and verify the ZIP's contents."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import re

root = Path(__file__).resolve().parents[1]
site = root / 'site'
out = root / 'output' / 'getibphysics.zip'
out.parent.mkdir(exist_ok=True)

required = ['index.html', 'styles.css', 'app.js', 'README.txt',
            'data/lessons.js', 'data/questions-ab.js', 'data/questions-cde.js',
            'data/flashcards.js', 'data/formulas.js', 'assets/mark.svg',
            'assets/physics-data-booklet.pdf', 'assets/logo.svg', 'vendor/katex.min.js',
            'vendor/katex.min.css', 'vendor/contrib/auto-render.min.js',
            'vendor/LICENSE-katex.txt']
required += [f'assets/booklet/page-{p:02}.png' for p in range(6, 18)]
css = (site / 'vendor/katex.min.css').read_text(encoding='utf-8')
required += ['vendor/' + url for url in re.findall(r'url\(([^)]+)\)', css)]
files = sorted(set(required))
for name in files:
    assert (site / name).is_file(), f'Missing asset: {name}'

with ZipFile(out, 'w', ZIP_DEFLATED, compresslevel=9) as archive:
    for name in files:
        archive.write(site / name, 'getibphysics/' + name)

with ZipFile(out) as archive:
    assert archive.testzip() is None, 'Corrupt archive entry'
    assert len(archive.namelist()) == len(files)
    for name in files:
        assert archive.read('getibphysics/' + name) == (site / name).read_bytes()
print(f'Packaged and verified {len(files)} files')
print(f'Size: {out.stat().st_size:,} bytes')
print(f'SHA-256: {hashlib.sha256(out.read_bytes()).hexdigest()}')
print(out)
