// Legacy dependencies assume a Node-like global reference in the browser.
(globalThis as typeof globalThis & { global?: typeof globalThis }).global = globalThis;
