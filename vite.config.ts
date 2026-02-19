import { defineConfig } from "vite";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1];
const ghDefaultBase = repo ? `/${repo}/` : "/";
const base = process.env.VITE_BASE_PATH ?? (process.env.GITHUB_PAGES === "true" ? ghDefaultBase : "/");

export default defineConfig({
  base,
  build: {
    outDir: "dist"
  }
});
