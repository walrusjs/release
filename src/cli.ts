#!/usr/bin/env node
import { cac, joycon } from '@walrus/cli-utils';
import { DEFAULT_CONFIG_FILES } from './config';
import { ReleaseConfig } from './types';

const cli = cac(`commit`);

cli
  .command('[...entries]')
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
  .option(`--tag`, `指定发布Tag`)
  .action((entries: string[], opts: ReleaseConfig) => {
    console.log(opts);
    const {
      data = {}
    } = joycon.loadSync({
      files: DEFAULT_CONFIG_FILES,
      cwd: process.cwd(),
      packageKey: 'release'
    });

    const latestConfig: ReleaseConfig = Object.assign({}, data, opts);

    console.log(latestConfig);
  })

cli.help();
cli.version(require('../package.json').version);
cli.parse();
