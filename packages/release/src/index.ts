import { PackageJson } from '@pansy/types';
import { execa, chalk } from '@walrus/cli-utils';
import {
  logStep,
  resolveLerna,
  printErrorAndExit,
  isLernaPackage,
} from './utils';
import { singleRelease } from './single';
import { lernaUnity } from './lerna-unity';
import { lernaIndependent } from './lerna-independent';
import type { Options, Mode } from './types';

export async function release(opts: Options, pkg?: PackageJson) {
  logStep('start');

  /** 当前的工作目录 */
  const cwd = opts.cwd ?? process.cwd();
  /** 获取当前工作目录的package.json */
  let pkgInfo: PackageJson = pkg ?? require(`${cwd}/package.json`);

  /** 添加默认值 */
  opts.buildCommand = opts.buildCommand ?? 'build';
  opts.commitMessage = opts.commitMessage ?? '🔖 chore(release): publish %v';

  /** 获取发布模式 */
  let mode: Mode = 'single';
  if (isLernaPackage(cwd)) {
    mode = 'lerna';
  }

  /** 检查Git状态，是否存在未提交的文件 */
  if (!opts.skipGitStatusCheck) {
    logStep('check git status');
    const gitStatus = execa.sync('git', ['status', '--porcelain']).stdout;
    if (gitStatus.length) {
      printErrorAndExit(`Your git status is not clean. Aborting.`);
    }
  } else {
    logStep('git status check is skipped, since --skip-git-status-check is supplied');
  }

  /** 检查 npm registry 地址 */
  if (!opts.skipPublish) {
    logStep('check npm registry');
    const userRegistry = execa.sync('npm', ['config', 'get', 'registry']).stdout;
    if (userRegistry.includes('https://registry.yarnpkg.com/')) {
      printErrorAndExit(`Release failed, please use ${chalk.blue('npm run release')}.`);
    }
    if (!userRegistry.includes('https://registry.npmjs.org/')) {
      const registry = chalk.blue('https://registry.npmjs.org/');
      printErrorAndExit(`Release failed, npm registry must be ${registry}.`);
    }
  } else {
    logStep('npm registryre check is skipped, since --skip-publish is supplied');
  }

  /** 单项目发布 */
  if (mode === 'single') {
    await singleRelease(cwd, opts, pkgInfo);
    return;
  }

  const currentVersion = resolveLerna(cwd).version ?? 'independent';

  /** lerna 独立版本发布 */
  if (currentVersion === 'independent') {
    await lernaIndependent(cwd, opts);
    return;
  }

  /** lerna 同版本发布 */
  await lernaUnity(
    currentVersion,
    cwd,
    opts
  );
}

export default release;

export { Options as Config } from './types';
