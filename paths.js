// Vendor Imports
import * as path from 'path';

export let root = path.resolve(__dirname);
export let dist = path.join(root, 'dist');

export let serverEntrypoint = path.join(root, 'server.ts');
export let clientEntrypoint = path.join(root, 'client', 'app.ts');