import { asset } from "@silverbulletmd/silverbullet/syscalls";
import { getHistory, hasUncommittedChanges } from "./git.ts";
const PLUG_NAME = "history";

// https://lucide.dev/icons/circle-x
const iconCircleX = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-x-icon lucide-circle-x">
<circle cx="12" cy="12" r="10"/>
<path d="m15 9-6 6"/>
<path d="m9 9 6 6"/>
</svg>
`;

// https://lucide.dev/icons/circle-alert
const iconCircleAlert = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-alert-icon lucide-circle-alert">
<circle cx="12" cy="12" r="10"/>
<line x1="12" x2="12" y1="8" y2="12"/>
<line x1="12" x2="12.01" y1="16" y2="16"/>
</svg>
`;

// https://lucide.dev/icons/calendar-clock
const iconCalendarClock = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-clock-icon lucide-calendar-clock">
<path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/>
<path d="M16 2v4"/>
<path d="M8 2v4"/>
<path d="M3 10h5"/>
<path d="M17.5 17.5 16 16.3V14"/>
<circle cx="16" cy="16" r="6"/>
</svg>
`;

// https://lucide.dev/icons/git-commit-horizontal
const iconGitCommitHorizontal = `
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-git-commit-horizontal-icon lucide-git-commit-horizontal">
<circle cx="12" cy="12" r="3"/>
<line x1="3" x2="9" y1="12" y2="12"/>
<line x1="15" x2="21" y1="12" y2="12"/>
</svg>
`;

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
