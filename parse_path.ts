export function parse_full_path(full_path: string) {
  // const full_path = "@History/page name.md"
  // const full_path = "@History/page name/a1b1c1d.md"
  // TODO: support pages with '/' in their name
  let [_, page_name, id] = full_path.split('/')


  if (!id) {
    // Slverbullet will add '.md' to all pages
    // but if there's an ID then we built the path so there
    // won't be an id on the page name
    if (page_name.slice(-3) === ".md") {
      // remove '.md' extension
      page_name = page_name.slice(0, -3);
    }
    return { page_name, version: undefined }
  }

  let version = id;
  if (id.slice(-3) === ".md") {
    // remove '.md' extension
    version = id.slice(0, -3);
  }
  return { page_name, version }
}
