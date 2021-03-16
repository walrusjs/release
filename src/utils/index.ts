import fs from 'fs';
import path from 'path';

/**
 * 判断项目是否是Lerna项目
 * @param cwd
 * @returns
 */
export function isLernaPackage(cwd: string = process.cwd()) {
  return fs.existsSync(path.join(cwd, 'lerna.json'))
}
