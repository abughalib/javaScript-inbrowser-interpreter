import * as esbuild from "esbuild-wasm";
import { unpkgPathPlugin } from "../plugins/unpkg-path-plugin";
import { fetchPlugin } from "../plugins/fetch-plugin";

let initialized = false;

export default async function builder(rowCode: string) {
  if (!initialized) {
    await esbuild.initialize({
      worker: true,
      wasmURL: "./esbuild.wasm" /*http://unpkg.com/esbuild-wasm/esbuild.wasm*/,
    });
    initialized = true;
  }

  const result = await esbuild.build({
    entryPoints: ["index.js"],
    bundle: true,
    write: false,
    plugins: [unpkgPathPlugin(), fetchPlugin(rowCode)],
    define: {
      "process.env.NODE_ENV": '"production"',
      global: "window",
    },
  });
  return result.outputFiles[0].text;
}
