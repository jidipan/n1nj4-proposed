import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "@bangjelkoski/vite-plugin-node-polyfills";

const stripUseClientDirective = (): PluginOption => ({
  name: "strip-use-client-directive",
  enforce: "pre",
  apply: "build",
  transform(code: string, id: string) {
    if (!id.includes("node_modules")) return null;
    if (
      !code.includes('"use client"') &&
      !code.includes("'use client'")
    ) {
      return null;
    }
    const cleaned = code.replace(/(^|\n)\s*(['"])use client\2;?/g, "$1");
    return { code: cleaned, map: null };
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({ protocolImports: true }),
    stripUseClientDirective(),
  ],
  define: {
    global: "globalThis",
  },
  resolve: {
    alias: {
      buffer: "buffer/",
    },
    dedupe: ["valtio"],
  },
  optimizeDeps: {
    include: ["buffer", "valtio"],
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
      onwarn(warning, warn) {
        // 忽略 "use client" 警告
        if (warning.code === "MODULE_LEVEL_DIRECTIVE" && warning.message.includes("use client")) {
          return;
        }
        // 忽略循环依赖警告
        if (warning.code === "CIRCULAR_DEPENDENCY") {
          return;
        }
        // 其他警告正常输出
        warn(warning);
      },
    },
  },
});
