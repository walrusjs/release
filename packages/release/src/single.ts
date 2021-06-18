import { join } from 'path';
import { writeFileSync } from 'fs';
import semver from 'semver';
import { execa, chalk } from '@walrus/cli-utils';
import { PackageJson } from '@pansy/types';
import { Options } from './types';
import {
  printErrorAndExit,
  getNextVersion,
  confirmVersion,
  logStep,
  getCommitMessage
} from './utils';

export async function singleRelease(
  currentVersion: string,
  opts: Options,
  pkg: PackageJson,
) {
  /** 不合法检查 */
  if (!opts.skipPublish) {
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

  /** 执行项目编译 */
  if (!opts.skipBuild) {
    logStep('build');
    await execa('npm', ['run', opts.buildCommand ?? 'build']);
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

  const pkgPath = join(opts.cwd as string, 'package.json');

  /** 修改package.json版本 */
  logStep('sync version to root package.json');
  const rootPkg = require(pkgPath);
  rootPkg.version = nextVersion;
  writeFileSync(pkgPath, JSON.stringify(rootPkg, null, 2) + '\n', 'utf-8');

  /** 提交代码 */
  const commitMessage = getCommitMessage(opts.commitMessage ?? 'update version', nextVersion);
  logStep(`git commit with ${chalk.blue(commitMessage)}`);
  await execa('git', ['commit', '--all', '--message', commitMessage]);

  /** 创建Tag */
  logStep(`git tag v${nextVersion}`);
  await execa('git', ['tag', `v${nextVersion}`]);

  /** 提交Tag */
  logStep(`git push tags`);
  await execa('git', ['push', 'origin', '--tags']);

  /** 提交代码到服务器端 */
  logStep(`git push`);
  await execa('git', ['push']);

  /** 发布到npm */
  if (!opts.skipPublish) {
    logStep(`npm pulish`);
    const publishOpts = ['publish'];

    if (opts.tag) {
      publishOpts.push('--tag', opts.tag);
    }

    await execa('npm', publishOpts);
  } else {
    logStep('npm registryre check is skipped, since --skip-publish is supplied');
  }

  logStep('done');
}
