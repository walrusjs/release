import fs from 'fs';
import path from 'path';
import { chalk, inquirer, execa } from '@walrus/cli-utils';
import { LernaInfo } from '../types';

/**
 * 输出日志
 * @param name
 */
export function logStep(name: string) {
  console.log(`${chalk.gray('>> release:')} ${chalk.magenta.bold(name)}`);
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
export function getCommitMessage(temp: string, version: string = 'publish') {
  if (temp.includes(`%s`)) {
    return temp.replace(`%s`, version);
  }

  if (temp.includes(`%v`)) {
    return temp.replace(`%v`, `v${version}`);
  }

  return temp;
}

/**
 * 是否是预发布版本
 * @param version
 * @returns
 */
export function isNextVersion(version: string): boolean {
  return (
    version.includes('-rc.') ||
    version.includes('-beta.') ||
    version.includes('-alpha.')
  );
};

/**
 * 检测指定包的版本是否已经存在
 * @param param0
 * @returns
 */
export function packageExists({ name, version }: { name: string, version: string}): boolean {
  const { stdout } = execa.sync('npm', ['info', `${name}@${version}`]);
  return stdout.length > 0;
}

export { exec } from './exec';
export { getPackages } from './getPackages';
export { getNextVersion } from './getNextVersion';
export { getLernaUpdated } from './getLernaUpdated';
