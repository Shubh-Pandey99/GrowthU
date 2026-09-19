import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
});

export default defineConfig([
  ...compat.extends("next/core-web-vitals"),
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
