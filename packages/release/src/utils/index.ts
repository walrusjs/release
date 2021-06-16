import fs from 'fs';
import path from 'path';
import { chalk } from '@walrus/cli-utils';
import { LernaInfo } from '../types';

export function logStep(name: string) {
  console.log(`${chalk.gray('>> Release:')} ${chalk.magenta.bold(name)}`);
}

export function printErrorAndExit(message: string) {
  console.error(chalk.red(message));
  process.exit(1);
}

/**
 * 判断项目是否是Lerna项目
 * @param cwd
 * @returns
 */
export function isLernaPackage(cwd: string = process.cwd()) {
  return fs.existsSync(path.join(cwd, 'lerna.json'))
}

/**
 * 获取lerna.json
 * @param cwd
 */
 export function resolveLerna(cwd: string): LernaInfo {
  try {
    return require(path.join(cwd, 'lerna.json'));
  } catch (e) {
    return {};
  }
}
