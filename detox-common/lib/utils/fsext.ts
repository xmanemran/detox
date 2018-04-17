import fs from "fs-extra";
import path from "path";

async function getDirectories (rootPath: string): Promise<string[]> {
  const files = await fs.readdir(rootPath);
  const dirs = [];

  for (const file of files) {
    const pathString = path.resolve(rootPath, file);
    if ((await fs.lstat(pathString)).isDirectory()) {
      dirs.push(file);
    }
  }

  return dirs.sort();
}

module.exports = {
  getDirectories
};
