import { readFileSync } from "node:fs";
import { DateTime } from "luxon";
import pluginRss from "@11ty/eleventy-plugin-rss";
import pluginSyntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

const site = JSON.parse(
  readFileSync(new URL("./src/_data/site.json", import.meta.url), "utf8"),
);

const pathPrefix = process.env.PATH_PREFIX || site.pathPrefix || "/";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);

  eleventyConfig.addPassthroughCopy({
    "src/css": "css",
    "src/js": "js",
    "src/assets": "assets",
  });

  eleventyConfig.addWatchTarget("src/css/");
  eleventyConfig.addWatchTarget("src/js/");

  eleventyConfig.setServerOptions({
    port: 43127,
    showAllHosts: true,
  });

  eleventyConfig.addFilter("readableDate", (date) => {
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy年LL月dd日");
  });

  eleventyConfig.addFilter("isoDate", (date) => {
    return DateTime.fromJSDate(date, { zone: "utc" }).toISODate();
  });

  eleventyConfig.addFilter("htmlDateString", (date) => {
    return DateTime.fromJSDate(date, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("absoluteUrl", (path) => {
    const base = String(site.url || "").replace(/\/$/, "");
    const prefix = pathPrefix === "/" ? "" : pathPrefix.replace(/\/$/, "");
    if (!path) return base || "/";
    return `${base}${prefix}${path}`;
  });

  eleventyConfig.addFilter("head", (array, n) => {
    if (!Array.isArray(array) || !n) return array;
    return array.slice(0, n);
  });

  eleventyConfig.addCollection("posts", (collectionApi) => {
    return collectionApi
      .getFilteredByGlob("src/posts/*.md")
      .sort((a, b) => b.date - a.date);
  });

  eleventyConfig.addCollection("tagList", (collectionApi) => {
    const tags = new Set();
    for (const item of collectionApi.getFilteredByGlob("src/posts/*.md")) {
      for (const tag of item.data.tags || []) {
        if (tag !== "posts") tags.add(tag);
      }
    }
    return [...tags].sort((a, b) => a.localeCompare(b, "zh-CN"));
  });

  eleventyConfig.amendLibrary("md", (md) => {
    md.set({ html: true, breaks: false, linkify: true, typographer: true });
  });

  return {
    pathPrefix,
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    templateFormats: ["md", "njk", "html"],
  };
}
