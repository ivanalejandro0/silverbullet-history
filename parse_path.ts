/**
 * Parse full page path in the form that this plugin uses and return the page
 * name and the version for the given path.
 *
 * Example pages:
 * "@History/page name/a1b1c1d.md"
 * "@History/page name/sub page/a1b1c1d.md"
 * "@History/page name/sub page/extra page/a1b1c1d.md"
 *
 * Note: @History is defined as PAGE_PREFIX on the codebase.
 */
export function parse_full_path(full_path: string): {page_name: string, version: string} {
  let path_array = full_path.split('/');
  if (path_array.length < 3) {
    // path at least has 3 elements:
    // - @History prefix
    // - page name
    // - version id
    throw new Error("Error parsing path, malformed");
  }
  path_array.shift(); // remove "@History/" prefix
  let version = path_array.pop()!;
  const page_name = path_array.join('/');

  if (version.slice(-3) === ".md") {
    // remove '.md' extension
    version = version.slice(0, -3);
  }
  return { page_name, version }
}
