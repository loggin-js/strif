import { create } from "./src/strif";

export interface CreateOptions {
  // Set of transformer functions
  transformers: { [key: string]: (v) => v };

  // Plugins path
  plugins: string[];
}

export interface strif {
  create(): strif.StrifFormatter;
}