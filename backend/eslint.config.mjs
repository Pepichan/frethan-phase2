import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // ⭐ dist フォルダは lint 対象から除外
  {
    ignores: ["dist/**", "node_modules/**"],
  },

  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
      },
      parser: tseslint.parser,
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
    ],
    rules: {
      // require() スタイルは backend では許可する
      "@typescript-eslint/no-require-imports": "off",

      // any をとりあえず許可（将来きつくするならここを変更）
      "@typescript-eslint/no-explicit-any": "off",

      // 未使用変数は warning に下げて、next は無視
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_?next$",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
]);
