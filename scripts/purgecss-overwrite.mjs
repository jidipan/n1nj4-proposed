import fs from "node:fs/promises";
import path from "node:path";
import { PurgeCSS } from "purgecss";

const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, "src");

const walkCssFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walkCssFiles(fullPath)));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".css")) {
      results.push(fullPath);
    }
  }

  return results;
};

const run = async () => {
  const cssFiles = await walkCssFiles(srcDir);
  const content = ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"];
  const purger = new PurgeCSS();

  for (const file of cssFiles) {
    const result = await purger.purge({
      content,
      css: [file],
      fontFace: true,
      keyframes: true,
      variables: true,
      safelist: {
        standard: [/^rk-/, /^w3m-/, /^walletconnect-/],
        deep: [/^rainbowkit/],
      },
    });

    const css = result[0]?.css ?? "";
    await fs.writeFile(file, `${css}\n`, "utf8");
  }

  console.log(`Purged and overwrote ${cssFiles.length} CSS files.`);
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
