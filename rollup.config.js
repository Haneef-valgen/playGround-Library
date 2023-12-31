import PeerDepsExternalPlugin from 'rollup-plugin-peer-deps-external';

import resolve from "@rollup/plugin-node-resolve";

import commonjs from "@rollup/plugin-commonjs";

import typescript from "@rollup/plugin-typescript";

import postcss from "rollup-plugin-postcss";

import dts from "rollup-plugin-dts";

import terser from '@rollup/plugin-terser';

import del from 'rollup-plugin-delete';

 

 

// This is required to read package.json file when

// using Native ES modules in Node.js

// https://rollupjs.org/command-line-interface/#importing-package-json

import { createRequire } from 'node:module';

const requireFile = createRequire(import.meta.url);

const packageJson = requireFile('./package.json');

 

 

export default [{

  input: "src/index.ts",

  output: [

    {

      file: packageJson.main,

      format: "cjs",

      sourcemap: true

    },

    {

      file: packageJson.module,

      format: "esm",

      sourcemap: true

    }

  ],

  plugins: [

    del({ targets: 'dist/*' }),

    terser(),

    PeerDepsExternalPlugin(),

    resolve(),

    commonjs(),

    typescript({

        tsconfig: './tsconfig.json',

        declaration: true,

        declarationDir: 'dist',

     }),

    postcss({

      plugins: [],

      minimize: true,

      extensions: ['.css'],
      extract:false,
      modules:true,
      use:['sass']

    })

  ]

}, {

  input: 'dist/esm/index.d.ts',

  output: [{ file: 'dist/index.d.ts', format: 'es' }],

  plugins: [dts.default()],

  external: [/\.css$/,/\.scss$/]

},]