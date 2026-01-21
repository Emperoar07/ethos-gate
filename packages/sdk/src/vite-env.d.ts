interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_ETHOS_DEBUG?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
