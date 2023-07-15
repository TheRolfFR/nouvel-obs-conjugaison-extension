const { build } = require('esbuild');
const sveltePlugin = require('esbuild-svelte');
const sveltePreprocess = require('svelte-preprocess');

const isProdBuild = process.argv.includes('--prod');

main();

async function main() {
  /**
   * @type {import('esbuild').BuildOptions}
   */
  const commonConfig = {
    outbase: './src',
    platform: 'browser',
    external: [],
    bundle: true,
    sourcemap: !isProdBuild,
    minify: isProdBuild,
    tsconfig: './tsconfig.json',
    drop: isProdBuild ? ['console'] : undefined
  };
  const contentJob = build({
    ...commonConfig,
    entryPoints: ['./src/content.ts'],
    outfile: './extension/dist/content.js'
  });

  const backgroundJob = build({
    ...commonConfig,
    entryPoints: ['./src/background.ts'],
    outfile: './extension/dist/background.js'
  });

  const popupJob = build({
    ...commonConfig,
    entryPoints: ['./src/popup/popup.ts'],
    outbase: './src/popup',
    outdir: './extension/dist',
    mainFields: ['svelte', 'module', 'main', 'browser'],
    plugins: [
      sveltePlugin({
        preprocess: sveltePreprocess(),
        filterWarnings: (warning) => !warning.message.includes('ARIA role'),
        compilerOptions: { dev: !isProdBuild }
      }),
    ],
  });

  const settingsJob = build({
    ...commonConfig,
    entryPoints: ['./src/settings/settings.ts'],
    outbase: './src/settings',
    outdir: './extension/dist',
    mainFields: ['svelte', 'module', 'main', 'browser'],
    plugins: [
      sveltePlugin({
        preprocess: sveltePreprocess()
      })
    ]
  });

  return Promise.all([contentJob, backgroundJob, popupJob, settingsJob]).then(
    () => console.log('⚡ Compiled')
  );
}
