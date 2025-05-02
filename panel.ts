import { asset } from "@silverbulletmd/silverbullet/syscalls";
import { getHistory, hasUncommittedChanges } from "./git.ts";
const PLUG_NAME = "history";

// TODO: add file not in git yet, not in index, 0 versions committed
export async function getPanelContents(
  page_name: string,
  selected_version: string
):
Promise<{html: string, js: string}> {
  const file_path = page_name + ".md";
  const history = await getHistory(file_path);
  const newerChanges = await hasUncommittedChanges(file_path);

  const css = await asset.readAsset(PLUG_NAME, "assets/styles.css");

  // icons from https://lucide.dev/icons
  const iconCircleX = await asset.readAsset(PLUG_NAME, "assets/icon-circle-x.svg");;
  const iconCircleAlert = await asset.readAsset(PLUG_NAME, "assets/icon-circle-alert.svg");;
  const iconCalendarClock = await asset.readAsset(PLUG_NAME, "assets/icon-calendar-clock.svg");;
  const iconGitCommitHorizontal = await asset.readAsset(PLUG_NAME, "assets/icon-git-commit-horizontal.svg");;

  let html = "";

  // <link rel="stylesheet" href="/.client/main.css" />
  html += `
<style>
${css}
</style>
`;

  html += `<div class="header">
    <h2>Version History</h2>
    <div id="close-history">${iconCircleX}</div>
  </div>
  `

  if (newerChanges) {
    html += `
      <div class="flexHCenter warning">
      ${iconCircleAlert}
      Heads up: there are newer changes not committed, not on this list.
      </div>
    `;
  }

  html += '<ul id="version-list">\n';
  for (let commit of history) {
    const isSelected = selected_version === commit.hash;
    const date = formatGitTimestamp(commit.timestamp);
    html += `
      <li
        data-hash="${commit.hash}"
        ${isSelected && 'class="selected"'}
      >
        <div class="date-and-hash">
          <div class="flexHCenter commit-date">
            ${iconCalendarClock}
            <strong>${date}</strong>
          </div>
          <div class="flexHCenter commit-hash">
            ${commit.hash}
            ${iconGitCommitHorizontal}
          </div>
        </div>
        <div>${commit.message}</div>
      </li>
`;
  }
  html += "</ul>";

  const js = await asset.readAsset(PLUG_NAME, "assets/scripts.js");

  return { html, js };
}

function formatGitTimestamp(gitTimestamp: number): string {
  const date = new Date(gitTimestamp * 1000); // Convert from seconds to milliseconds
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0'); // Months are 0-based
  const day = `${date.getDate()}`.padStart(2, '0');

  let hours = date.getHours();
  const minutes = `${date.getMinutes()}`.padStart(2, '0');
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // 0 becomes 12

  return `${year}-${month}-${day} at ${hours}:${minutes}${ampm}`;
}
