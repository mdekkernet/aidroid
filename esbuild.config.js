const esbuild = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const commonConfig = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node18',
  outdir: 'dist',
  sourcemap: true,
  minify: true,
  format: 'cjs',
  plugins: [nodeExternalsPlugin()],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
};

// Build for production
if (process.argv.includes('build')) {
  esbuild.build(commonConfig).catch(() => process.exit(1));
}

// Watch mode for development
if (process.argv.includes('dev')) {
  esbuild
    .context(commonConfig)
    .then(ctx => {
      ctx.watch();
    })
    .catch(() => process.exit(1));
}
