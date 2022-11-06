import * as esbuild from "esbuild-wasm";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }  // else if (args.path === "tiny-test-pkg") {
        //   return {
        //     namespace: "a",
        //     path: "https://unpkg.com/tiny-test-pkg@1.0.0/index.js",
        //   };
        // }

        return {
          namespace: "a",
          path: `https://unpkg.com/${args.path}`,
        }
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              const message = require('medium-test-pkg');
              console.log(message);
            `,
          };
        }

        let resp = await fetch(args.path, {
          method: "GET",
          headers: {
            "Content-Type": "application/javascript",
          },
        });

        let contents = await resp.text();

        return {
          loader: "jsx",
          contents: contents,
        };
      });
    },
  };
};
