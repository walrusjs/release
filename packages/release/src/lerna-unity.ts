import semver from 'semver';
import { execa, chalk, getLernaPackages } from '@walrus/cli-utils';
import {
  exec,
  logStep,
  confirmVersion,
  getCommitMessage,
  getNextVersion,
  getLernaUpdated,
  printErrorAndExit
} from './utils';
import type { Options } from './types';

export const lernaCli = require.resolve('lerna/cli');

export async function lernaUnity(
  currentVersion: string,
  cwd: string,
  opts: Options
) {
  let updated = null;

  if (!opts.publishOnly) {
    /** 获取更新的包 */
    logStep('check updated packages');

    updated = getLernaUpdated(opts.filterPackages);

    if (!updated.length) {
      printErrorAndExit('Release failed, no updated package is updated.');
    }

    /** 执行项目编译 */
    if (!opts.skipBuild) {
      logStep('build');
      await execa('npm', ['run', opts.buildCommand as string]);
    } else {
      logStep('build is skipped, since --skip-build is supplied');
    }

    /** 获取下一个需要发布的版本 */
    const nextVersion = await getNextVersion(currentVersion);

    /** 检验版本是否合法 */
    if (!semver.valid(nextVersion)) {
      printErrorAndExit(`输入的版本(${nextVersion})格式不合法`);
      return;
    }

    /** 版本二次确认 */
    const result = await confirmVersion(nextVersion);
    if (!result) return;

    // Bump version
    logStep('bump version with lerna version');

    const versionArgs = [
      'version',
      '--exact',
      '--no-commit-hooks',
      '--no-git-tag-version',
      '--no-push',
    ];

    await exec(lernaCli, versionArgs);

    // Commit
    const commitMessage = getCommitMessage(opts.commitMessage as string, nextVersion);
    logStep(`git commit with ${chalk.blue(commitMessage)}`);
    await execa('git', ['commit', '--all', '--message', commitMessage]);

    // Git Tag
    logStep(`git tag v${nextVersion}`);
    await execa('git', ['tag', `v${nextVersion}`]);
  }

  // Publish
  const pkgs = opts.publishOnly
    ? getLernaPackages(cwd, opts.filterPackages)
    : updated;

  const names = pkgs.reduce((prev: string, pkg: any) => {
    return prev + `${pkg.name}, `;
  }, '')

  logStep(`publish packages: ${chalk.blue(names)}`);
}
