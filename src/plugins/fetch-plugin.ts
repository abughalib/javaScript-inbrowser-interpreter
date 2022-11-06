import * as esbuild from "esbuild-wasm";
import localforage from "localforage";

// Create a cache object
const fileCache = localforage.createInstance({
  name: "filecache",
});

export const fetchPlugin = (inputCode: string) => {
  return {
    name: "fetch-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onLoad({ filter: /(^index\.js$)/ }, () => {
        return {
          loader: "jsx",
          contents: inputCode,
        };
      });

      // Handles all cached files
      build.onLoad({ filter: /.*/ }, async (args: any) => {
        // Check if the file is in the cache
        const cacheResult = await fileCache.getItem<esbuild.OnLoadResult>(
          args.path
        );

        // If it is, return it immediately
        if (cacheResult) {
          return cacheResult;
        }
      });

      build.onLoad({ filter: /.css$/ }, async (args: any) => {
        // If not, fetch it
        let resp = await fetch(args.path, {
          method: "GET",
          headers: {
            "Content-Type": "application/javascript",
          },
        });

        const respContent = await resp.text();

        const escapedContent = respContent
          .replace(/\n/g, "")
          .replace(/"/g, '\\"')
          .replace(/'/g, "\\'");

        const contents = `const style = document.createElement('style');
                  style.innerText = '${escapedContent}';
                  document.head.appendChild(style);`;

        const result: esbuild.OnLoadResult = {
          loader: "jsx",
          contents: contents,
          resolveDir: new URL("./", resp.url).pathname,
        };

        fileCache.setItem(args.path, result);

        return result;
      });

      build.onLoad(
        { filter: /.*/ },
        async (args: esbuild.OnLoadArgs): Promise<esbuild.OnLoadResult> => {
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
