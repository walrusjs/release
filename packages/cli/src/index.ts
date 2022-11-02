#!/usr/bin/env node
import { cac, loadConfig, mergeConfig } from '@walrus/cli-utils';
import { DEFAULT_CONFIG_FILES } from './config';
import { release } from '@walrus/release';

const cli = cac.cac(`commit`);

cli
  .command('[...entries]')
  .option(
    '--cwd',
    `[cwd] 指定工作目录`
  )
  .option(
    '--skip-git-status-check',
    `[boolean] 是否跳过 git 状态检查`,
    {
      default: false
    }
  )
  .option(
    '--skip-build',
    `[boolean] 是否跳过项目编译`,
    {
      default: false
    }
  )
  .option(
    '--skip-publish',
    `[boolean] 是否跳过项目发布`,
    {
      default: false
    }
  )
  .option(
    '--skip-npm-registry-check',
    `[boolean] 是否跳过检查 npm registry 地址`,
    {
      default: false
    }
  )
  .option(
    '--build-command [buildCommand]',
    `[string] 指定编译命令`,
    {
      default: 'build'
    }
  )
  .option(
    '--commit-message [message]',
    `[string] 指定提交信息。`
  )
  .option(
    '--publish-only',
    `[boolean] 仅发布`
  )
  .option(
    '--select-version',
    `[boolean] 是否选择版本`,
  )
  .option(
    '--conventional-graduate [graduate]',
    `[string] 将预发布版本的软件包升级为稳定版本`,
  )
  .example('--conventional-prerelease package-2,package-4')
  .option(
    '--conventional-prerelease [prerelease]',
    `[string] 将当前更改发布为预发布版本`,
  )
  .example('--conventional-prerelease')
  .option(`--tag [tag]`, `指定发布Tag`)
  .action(async (entries: string[], opts = {}) => {
    const {
      data = {}
    } = await loadConfig(process.cwd(), DEFAULT_CONFIG_FILES);

    release(mergeConfig({}, opts, data))
      .catch((err: any) => {
        console.error(err);
        process.exit(1);
      });
  })

cli.help();
cli.version(require('../package.json').version);
cli.parse();
