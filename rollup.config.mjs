import { createRequire } from 'module';
import typescript from 'rollup-plugin-typescript2';
import styles from 'rollup-plugin-styles';
//import urlPlugin from '@rollup/plugin-url'; we use image instead
import resolve from 'rollup-plugin-node-resolve';
import image from '@rollup/plugin-image';
import localResolve from 'rollup-plugin-local-resolve';
import replace from 'rollup-plugin-replace';
// import { terser } from 'rollup-plugin-terser';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: (p) => {
    if (
      [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        'prop-types'
      ].indexOf(p) > -1
    ) {
      return true;
    }
    // prevent duplicate import of three
    // prevent packages that have css separately bundled to fail
    return /^three/.test(p) || /^@trendmicro/.test(p) || /^react-toastify/.test(p);
  },
  plugins: [
    styles(),
    image(),
    localResolve(),
    resolve(),
    typescript({
      exclude: [
        '**/*.spec.ts',
        '**/*.spec.tsx',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/*.stories.ts',
        '**/*.stories.tsx',
        'src/stories/**'
      ],
      tsconfigDefaults: {},
      tsconfig: 'tsconfig.json',
      tsconfigOverride: {
        include: ['src/**/*'],
        exclude: [
          'src/**/*.spec.ts',
          'src/**/*.spec.tsx',
          'src/**/*.test.ts',
          'src/**/*.test.tsx',
          'src/**/*.stories.ts',
          'src/**/*.stories.tsx',
          'src/stories/**'
        ],
        compilerOptions: {
          declaration: true,
          declarationDir: 'dist',
          rootDir: 'src'
        }
      },
      useTsconfigDeclarationDir: true,
      sourceMap: false,
      verbosity: 1 // overrides for debugging
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production')
    })
    //terser() // TODO(chab) we might want to not mimify it
  ]
};
