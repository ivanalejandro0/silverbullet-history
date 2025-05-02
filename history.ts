import { editor, shell } from "@silverbulletmd/silverbullet/syscalls";
import { FileMeta } from "@silverbulletmd/silverbullet/types.ts";
import { parse_full_path } from "./parse_path.ts";
import { getPanelContents } from "./panel.ts";
import { isGitRepo, getFileContents, getNewestVersion, isGitTracked } from "./git.ts";

// NOTE: on the yaml configuration file for the plugin there's also the "@History" string
const PAGE_PREFIX = "@History"

export async function historyToggle(): boolean {
  const page_name: string = await editor.getCurrentPage();
  const historyOpen = page_name.startsWith(PAGE_PREFIX);

  if (historyOpen) {
    historyClose();
  } else {
    historyShow();
  }
}

/**
  * Checks on an interval if we're still on the history page.
  * If that's not the case then the sidebar is closed.
  */
function checkForNavigation() {
  async function handler() {
    const page_name = await editor.getCurrentPage();
    if (!page_name.startsWith(PAGE_PREFIX)) {
      editor.hidePanel("lhs");
      clearInterval(interval_id);
    }
  }

  // Note: kind of overkill, but I didn't find a way to listen to an event that
  // triggers when the page is changed.
  const interval_id = setInterval(handler, 1000);
}

// TODO: handle 'toggle dark theme', sideba closes and history page stays open
// TODO: handle offline mode
// BUG: on history back, the selected commit doesn't change to the right version

export async function historyShow() {
  if (!await isGitRepo()) {
    editor.flashNotification("History: not available. Not in a git repo.", "error")
    return;
  }

  const page_name = await editor.getCurrentPage();

  if (page_name.startsWith(PAGE_PREFIX)) {
    // history already open, do nothing
    return;
  }

  const file_path = `${page_name}.md`;

  if (!await isGitTracked(file_path)) {
    editor.flashNotification("History: not available for this file. Not tracked on git.", "error")
    return;
  }

  const version = await getNewestVersion(file_path);
  const full_path = `${PAGE_PREFIX}/${page_name}/${version}`;

  checkForNavigation()
  await editor.navigate(full_path);

  await updatePanel(page_name, version)
}

async function updatePanel(page_name: string, version: string) {
  // TODO: handle case where there's already a panel and I'm already in a
  // vestion view
  const { html, js } = await getPanelContents(page_name, version)

  const mode = 0.7;
  // the sidebar will have an inline style of `flex: ${mode} 0 auto`
  // mode will determine the value of `flex-grow` for the sidebar

  // see see https://github.com/silverbulletmd/silverbullet/blob/d7e8ab1ea50d24f68175960c6581f70244340251/web/editor_ui.tsx#L351
  await editor.showPanel("lhs", mode, html, `
${js}
; init();
`);
}

export async function historyClose() {
  const current_page = await editor.getCurrentPage();
  const { page_name } = parse_full_path(current_page)
  await editor.navigate(page_name);
  await editor.hidePanel("lhs");
}

export async function selectVersion(hash: string) {
  const current_page = await editor.getCurrentPage();
  const { page_name } = parse_full_path(current_page)
  const full_path = `${PAGE_PREFIX}/${page_name}/${hash}`;
  await editor.navigate(full_path);
  await updatePanel(page_name, hash)
}

async function getVersionContents(page_name: string, version: string) {
  const file_path = `${page_name}.md`;
  const contents = await getFileContents(file_path, version);
  return contents
}

async function getData(full_path: string) {
  let { page_name, version } = parse_full_path(full_path)

  if (!version) {
    // if there's no ID then is first load, grab latest id
    const file_path = `${page_name}.md`;
    version = await getNewestVersion(file_path);
  }

  const file_contents = await getVersionContents(page_name, version)

  return file_contents;
}

export async function readFile(
  name: string,
): Promise<{ data: Uint8Array; meta: FileMeta }> {
  const text = await getData(name)

  return {
    data: new TextEncoder().encode(text),
    meta: {
      name,
      contentType: "text/markdown",
      size: text.length,
      created: 0,
      lastModified: 0,
      perm: "ro",
    },
  };
}

export function writeFile(name: string): FileMeta {
  // noop. files should be read-only, so I'm not doing any actual file writing.
  // BUG: for some reason the pages are not read only, I need to investigate
  return getFileMeta(name);
}

export function getFileMeta(name: string): FileMeta {
  return {
    name,
    contentType: "text/markdown",
    size: -1,
    created: 0,
    lastModified: 0,
    perm: "ro",
  };
}
