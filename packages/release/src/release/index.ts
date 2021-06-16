import { PackageJson } from '@pansy/types';
import semver from 'semver';
import { execa, chalk } from '@walrus/cli-utils';
import { isLernaPackage, logStep, resolveLerna, printErrorAndExit } from '../utils';
import { Mode, ReleaseConfig } from '../types';

async function release({ pkg, cwd, mode, options }: {
  cwd: string,
  mode: Mode,
  pkg: PackageJson,
  options: ReleaseConfig
}) {
  logStep('start');

  /** 获取当前版本 */
  const currentVersion = getCurrentVersion(mode);

  /** 单项目不合法检查 */
  if (mode === 'single' && !options.skipPublish) {
    if (pkg.private) {
      printErrorAndExit('私有项目不允许发布，可设置--skip-publish跳过发布');
      return;
    }

    if (!currentVersion || !semver.valid(currentVersion)) {
      printErrorAndExit('package.json version 字段不存在或不合法');
      return;
    }

    if (!pkg.name) {
      printErrorAndExit('package.json name 字段不存在');
      return;
    }

    if (pkg.name.charAt(0) === '@' && pkg.publishConfig?.access !== 'public') {
      printErrorAndExit('未设置 publishConfig.access 为 public');
      return;
    }
  }

  if (
    !(mode === 'lerna' && currentVersion === 'independent') &&
    !semver.valid(currentVersion)
  ) {
    printErrorAndExit(`lerna.json version 不存在或不合法`);
    return;
  }

  /** 检查Git状态，是否存在未提交的文件 */
  if (!options.skipGitStatusCheck) {
    logStep('check git status');
    const gitStatus = execa.sync('git', ['status', '--porcelain']).stdout;
    if (gitStatus.length) {
      printErrorAndExit(`Your git status is not clean. Aborting.`);
    }
  } else {
    logStep('git status check is skipped, since --skip-git-status-check is supplied');
  }

  /** 检查 npm registry 地址 */
  if (!options.skipPublish) {
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

  /** 执行项目编译 */
  if (!options.skipBuild) {
    logStep('build');
    await execa('npm', ['run', options.buildCommand ?? 'build']);
  } else {
    logStep('build is skipped, since --skip-build is supplied');
  }




  // ------------- functions -------------

  function getCurrentVersion(mode: Mode = 'single') {
    let version;

    switch (mode) {
      case 'single':
        version = pkg.version;
        break;
      case 'lerna':
        version = resolveLerna(cwd).version;
        break;
    }

    return version;
  }
}
