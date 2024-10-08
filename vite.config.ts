/// <reference types="vite/client" />

import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import { exec } from "child_process";
export default defineConfig((options) => {
  const { mode } = options;
  const isDev = mode === 'dev'
  return {
    plugins: [
      solidPlugin(),
      isDev && {
        name: "postbuild-commands", // the name of your custom plugin. Could be anything.
        closeBundle: async () => {
          // await postBuildCommands(); // run during closeBundle hook. https://rollupjs.org/guide/en/#closebundle
          console.log("after build");
          exec("npm run build-dts", (error, stdout, stderr) => {
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
            if (error !== null) {
              console.log(`exec error: ${error}`);
            } else {
            }
          });
        },
      },
    ],
    build: {
      ...(isDev
        ? {
            watch: {
              include: "src/**",
            },
          }
        : {}),
      cssTarget: "chrome61",
      sourcemap: true,
      rollupOptions: {
        external: ["klinecharts"],
        output: {
          assetFileNames: (chunkInfo) => {
            if (chunkInfo.name === "style.css") {
              return "klinecharts-pro.css";
            }
          },
          globals: {
            klinecharts: "klinecharts",
          },
        },
      },
      lib: {
        entry: "./src/index.ts",
        name: "klinechartspro",
        fileName: (format) => {
          if (format === "es") {
            return "klinecharts-pro.js";
          }
          if (format === "umd") {
            return "klinecharts-pro.umd.js";
          }
        },
      },
    },
  };
});
