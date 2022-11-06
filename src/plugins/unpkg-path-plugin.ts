import * as esbuild from "esbuild-wasm";

const UNPKG_PATH = "https://unpkg.com";

export const unpkgPathPlugin = () => {
  return {
    name: "unpkg-path-plugin",
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log("onResolve", args);
        if (args.path === "index.js") {
          return { path: args.path, namespace: "a" };
        }

        if (args.path.includes("./") || args.path.includes("../")) {
          return {
            namespace: "a",
            path: new URL(
              args.path,
              UNPKG_PATH + args.resolveDir + "/"
            ).href,
          };
        }

        return {
          namespace: "a",
          path: `${UNPKG_PATH}/${args.path}`,
        };
      });

      build.onLoad({ filter: /.*/ }, async (args: any) => {
        console.log("onLoad", args);

        if (args.path === "index.js") {
          return {
            loader: "jsx",
            contents: `
              import React from 'react';
              import ReactDOM from 'react-dom';

              console.log(React, ReactDOM);
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
          resolveDir: new URL("./", resp.url).pathname,
        };
      });
    },
  };
};
