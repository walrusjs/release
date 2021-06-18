#!/usr/bin/env node
import { cac, joycon } from '@walrus/cli-utils';
import { DEFAULT_CONFIG_FILES } from './config';
import { release } from '@walrus/release';

const cli = cac(`commit`);

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
    '--skip-sync',
    `[boolean] 是否跳过同步到淘宝源`,
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
    `[string] 指定提交信息。`,
    {
      default: '🔖 chore(release): publish'
    }
  )
  .option(
    '--publish-only',
    `[boolean] 仅发布`
  )
  .option(
    '--exclude-private',
    `[boolean] 排除私有的包`,
    {
      default: true
    }
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
  .option(
    '--scope [scope]',
    `[string] 仅包含与给定 glob 匹配的包。`,
    {
      default: []
    }
  )
  .example('--scope @walrus/*')
  .option(
    '--ignore [ignore]',
    `[string] 排除名称与给定 glob 匹配的包。`,
    {
      default: []
    }
  )
  .example('--ignore @test/example1 --ignore @test/example2')
  .option(`--tag`, `指定发布Tag`)
  .action((entries: string[], opts: any = {}) => {
    const {
      data = {}
    } = joycon.loadSync({
      files: DEFAULT_CONFIG_FILES,
      cwd: process.cwd(),
      packageKey: 'release'
    });

    if (typeof opts.scope === 'string') {
      opts.scope = [opts.scope];
    }

    if (typeof opts.ignore === 'string') {
      opts.ignore = [opts.ignore];
    }

    release(Object.assign({}, data, opts))
      .catch((err) => {
        console.error(err);
        process.exit(1);
      });
  })

cli.help();
cli.version(require('../package.json').version);
cli.parse();
