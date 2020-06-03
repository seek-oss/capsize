import memfs from 'memfs';
import path from 'path';
import data from 'fontkit/data.trie';
import indic from 'fontkit/indic.trie';
import use from 'fontkit/use.trie';
export * from 'memfs';

memfs.writeFileSync(path.join(__dirname, '/data.trie'), data);
memfs.writeFileSync(path.join(__dirname, '/indic.trie'), indic);
memfs.writeFileSync(path.join(__dirname, '/use.trie'), use);
