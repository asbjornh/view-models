const babel = require("@babel/core");
const fs = require("fs");
const path = require("path");
const tempy = require("tempy");
const test = require("ava");
const webpack = require("webpack");

const webpackConfig = require("../fixtures/javascript/webpack.config");

const babelPlugin = require("../babel-plugin");

const template = (t, input, expected) => {
  const { code } = babel.transformSync(input, {
    plugins: [babelPlugin, "@babel/proposal-class-properties"]
  });

  t.is(expected, code);
};

test(
  "Doesn't crash on missing class properties",
  template,
  "class Component extends React.Component {}",
  "class Component extends React.Component {}"
);

test(
  "Class component",
  template,
  "class C extends React.Component { static viewModelMeta = {}; }",
  "class C extends React.Component {}"
);

test("Functional component", template, "Component.viewModelMeta = {};", "");

const webpackTemplate = (t, useBabelPlugin) => {
  t.plan(1);

  webpack(
    webpackConfig(
      { babelPlugin: useBabelPlugin, path: tempy.directory() },
      { mode: "production" }
    ),
    (error, stats) => {
      if (error) {
        throw error;
      }

      const compilation = stats.toJson();

      if (stats.hasErrors()) {
        t.fail(compilation.errors);
        return;
      }

      const { outputPath } = compilation;
      const mainJs = compilation.assets.find(asset => asset.name === "main.js");

      const mainJsContent = fs.readFileSync(
        path.join(outputPath, mainJs.name),
        "utf-8"
      );

      t.is(mainJsContent.includes("viewModelMeta"), !useBabelPlugin);

      t.end();
    }
  );
};

// Check for 'viewModelMeta' in built code to avoid a false positive for the other test
test.cb("viewModelMeta exists", webpackTemplate, false);

test.cb("Removes viewModelMeta", webpackTemplate, true);
