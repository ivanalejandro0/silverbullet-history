import { assertEquals } from "jsr:@std/assert";

import { parse_full_path } from "./parse_path.ts";

Deno.test("path with id", () => {
  const path = "@History/page name/asdf.md";
  const result = parse_full_path(path)
  const expected = {page_name: "page name", version: "asdf"};
  assertEquals(result, expected);
});

Deno.test("path with id, only strip final .md extension", () => {
  const path = "@History/page name.md/asdf.md";
  const result = parse_full_path(path)
  const expected = {page_name: "page name.md", version: "asdf"};
  assertEquals(result, expected);
});

Deno.test("path with / and version", () => {
  const path = "@History/page name/child page/asdf.md";
  const result = parse_full_path(path)
  const expected = {page_name: "page name/child page", version: "asdf"};
  assertEquals(result, expected);
});
