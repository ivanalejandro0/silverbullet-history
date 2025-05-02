import { FileMeta } from "@silverbulletmd/silverbullet/types.ts";
import { getPageContents } from "./history.ts";

/**
 * Handle SilverBullet namespace operations.
 * These functions are used on history.plug.yaml
 */

export async function readFile(
  name: string,
): Promise<{ data: Uint8Array; meta: FileMeta }> {
  const text = await getPageContents(name)

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
