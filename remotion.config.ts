import { Config } from "@remotion/cli/config";
import type { WebpackConfiguration } from "@remotion/bundler";

/**
 * Keep the authored SVGs inline when they are imported with `?raw`.
 *
 * The Ally artwork contains CSS keyframes. When it is emitted as an external
 * image, Chrome advances those keyframes on its own wall clock, which makes
 * individual Remotion frames non-deterministic. `asset/source` lets the video
 * renderer inject a frame-synchronised style into the SVG document instead.
 */
Config.overrideWebpackConfig((currentConfiguration: WebpackConfiguration) => {
  const rules = currentConfiguration.module?.rules ?? [];

  return {
    ...currentConfiguration,
    module: {
      ...currentConfiguration.module,
      rules: [
        {
          resourceQuery: /raw/,
          type: "asset/source",
        },
        ...rules.map((rule) => {
          if (
            rule &&
            typeof rule === "object" &&
            "test" in rule &&
            rule.test instanceof RegExp &&
            rule.test.test("ally.svg")
          ) {
            return {
              ...rule,
              resourceQuery: { not: [/raw/] },
            };
          }

          return rule;
        }),
      ],
    },
  };
});
