// Minimal declaration for the one bundler-injected field this package reads.
// Avoids depending on vite just for its ambient types.
interface ImportMeta {
  readonly env: { readonly BASE_URL: string };
}
