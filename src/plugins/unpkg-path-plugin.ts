import * as esbuild from "esbuild-wasm";

// UNPKG URL
const UNPKG_PATH = "https://unpkg.com";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^(index\.js)$/ }, () => {
        return { path: "index.js", namespace: "a" };
      });

      build.onResolve({ filter: /^\.+\// }, (args: esbuild.OnResolveArgs) => {
        return {
          namespace: "a",
          path: new URL(args.path, UNPKG_PATH + args.resolveDir + "/").href,
        };
      });

      build.onResolve({ filter: /.*/ }, async (args: esbuild.OnResolveArgs) => {
        console.log("onResolve", args);
        return {
          namespace: "a",
          path: `${UNPKG_PATH}/${args.path}`,
        };
      });
    },
  };
};
