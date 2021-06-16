import fs from 'fs';
import path from 'path';
import template from 'lodash/template';
import { chalk, inquirer } from '@walrus/cli-utils';
import { LernaInfo } from '../types';

/**
 *
 * @param name
 */
export function logStep(name: string) {
  console.log(`${chalk.gray('>> Release:')} ${chalk.magenta.bold(name)}`);
}

/**
 * 输出异常并退出进程
 * @param message
 */
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

/**
 * 二次确认发布的版本
 * @param version
 * @returns
 */
export async function confirmVersion(version: string) {
  const { yes } = await inquirer.prompt([
    {
      name: 'yes',
      message: `Confirm releasing ${version}?`,
      type: 'confirm'
    }
  ]);

  return yes;
}

/**
 * 获取提交的信息
 * @param temp
 * @param version
 * @returns
 */
export function getCommitMessage(temp: string, version: string = '') {
  const compiled = template(temp);
  return compiled({ version }) + version ? `` : `release version`;
}

export { getNextVersion } from './getNextVersion';
export { getLernaUpdated } from './getLernaUpdated';
