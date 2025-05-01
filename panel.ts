import { asset } from "@silverbulletmd/silverbullet/syscalls";

import { getHistory, hasUncommittedChanges } from "./git.ts";

// TODO: add file not in git yet, not in index, 0 versions committed
export async function getPanelContents(
  page_name: string,
  selected_version: string
):
Promise<{html: string, js: string}> {
  const file_path = page_name + ".md";
  const history = await getHistory(file_path);
  const newerChanges = await hasUncommittedChanges(file_path);

  let html = "";
  html += "<h2>Version History</h2>\n"

  if (newerChanges) {
    html += "<div>heads up: there are newer changes not committed, not on this list.</div>"
    html += "\n"
  }

  html += '<ul id="version-list" style="list-style: none; padding: 0;">\n';
  for (let commit of history) {
    html += `
      <li
        data-hash="${commit.hash}"
        style="cursor: pointer; font-family: 'sans-serif'; background-color: ${selected_version === commit.hash ? '#3b3e5f' : 'transparent'}; padding: 0.5rem; border-radius: 4px;"
      >
        <div><strong>${commit.timestamp}</strong></div>
        <div>${commit.hash}</div>
        <div>${commit.message}</div>
      </li>
`;
  }
  html += "</ul>";

  const js = await asset.readAsset("history", "assets/scripts.js");

  return { html, js };
}
