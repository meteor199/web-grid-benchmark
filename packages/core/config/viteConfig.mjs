


export function createGridViteConfig(options) {
  return {
    base: './',
    build: {
      outDir: '../../dist/' + options.gridName,
      emptyOutDir: true,
    },
    server: {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      }
    }
  };
}
