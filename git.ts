import { shell } from "@silverbulletmd/silverbullet/syscalls";

type Commit = {
  hash: string,
  timestamp: number,
  message: string,
}

export async function isGitRepo(): Promise<boolean> {
  try {
    const { stdout } = await shell.run("git",
      ["rev-parse", "--is-inside-work-tree"]);
    return (stdout.trim() === "true");
  } catch (e) {
    return false;
  }
}

export async function isGitTracked(filePath: string): Promise<boolean> {
  const { stdout } = await shell.run("git",
    ['status', '--porcelain', '--', filePath]);
  // status line for untracked files look like:
  //  ?? file-name.ext
  const [flag, fileName] = stdout.trim().split(' ');
  return (flag !== "??");
}

export async function hasUncommittedChanges(filePath: string): Promise<boolean> {
  const { stdout } = await shell.run("git",
    ['status', '--porcelain', '--', filePath]);
  const statusLine = stdout.trim();
  return (statusLine !== "");
}

export async function getHistory(filePath: string): Promise<Commit[]> {
  const { stdout } = await shell.run("git",
    ['log', '--format=%h %ct %s', '--', filePath])

  const lines = stdout.trim().split('\n');

  const commits: Commit[] = [];
  for (const line of lines) {
    const [hash, timestamp, ...messageParts] = line.split(' ');
    const message = messageParts.join(' ');

    commits.push({
      hash,
      timestamp,
      message,
    });
  }

  return commits;
}

export async function getNewestVersion(filePath: string): Promise<string> {
  const { stdout } = await shell.run("git",
    ['log', '-1', '--format=%h', '--', filePath])

  const hash = stdout.trim()
  return hash;
}

export async function getFileContents(filePath: string, hash: string): Promise<string> {
  const { stdout } = await shell.run("git", ['show', `${hash}:${filePath}`])
  return stdout;
}
