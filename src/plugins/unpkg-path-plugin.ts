import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

const UNPKG_PATH = "https://unpkg.com";

const fileCache = localforage.createInstance({
  name: "filecache",
});

export const unpkgPathPlugin = (input: string) => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /^(index\.js)/ }, () => {
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

      build.onLoad(
        { filter: /.*/ },
        async (args: esbuild.OnLoadArgs): Promise<esbuild.OnLoadResult> => {
          console.log("onLoad", args);

          if (args.path === "index.js") {
            return {
              loader: "jsx",
              contents: input,
            };
          }

          // Check if the file is in the cache
          const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
            args.path
          );

          // If it is, return it immediately
          if (cacheResult) {
            return cacheResult;
          }

          // If not, fetch it
          let resp = await fetch(args.path, {
            method: "GET",
            headers: {
              "Content-Type": "application/javascript",
            },
          });

          const result: esbuild.OnLoadResult = {
            loader: "jsx",
            contents: await resp.text(),
            resolveDir: new URL("./", resp.url).pathname,
          };

          fileCache.setItem(args.path, result);

          return result;
        }
      );
    },
  };
};
