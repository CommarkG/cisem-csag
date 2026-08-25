import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import noUnpartitionedStorage from "./cisem_core/linters/no_unpartitioned_storage.mjs";
import noForbiddenWords from "./cisem_core/linters/no_forbidden_words.mjs";

const eslintConfig = defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "backend/**",
    "**/node_modules/**",
    "**/.venv/**",
    "scratch/**",
  ]),
  ...nextVitals,
  ...nextTs,
  {
    plugins: {
      cisem: {
        rules: {
          "no-unpartitioned-storage": noUnpartitionedStorage,
          "no-forbidden-words": noForbiddenWords
        }
      }
    },
    rules: {
      "cisem/no-unpartitioned-storage": "error",
      "cisem/no-forbidden-words": "error"
    }
  },
]);

export default eslintConfig;
