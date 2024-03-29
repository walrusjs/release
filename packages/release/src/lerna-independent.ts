import { execa, chalk, getPackages } from '@walrus/cli-utils';
import {
  exec,
  logStep,
  packageExists,
  isNextVersion,
  getLernaUpdated,
  printErrorAndExit
} from './utils';
import type { Options } from './types';

export const lernaCli = require.resolve('lerna/cli');

export async function lernaIndependent(
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

    // Bump version
    // Commit
    // Git Tag
    // Push
    logStep('bump version with lerna version');

    /** 将预发布版本的软件包升级为稳定版本 */
    const conventionalGraduate = opts.conventionalGraduate
      ? ['--conventional-graduate'].concat(
          Array.isArray(opts.conventionalGraduate)
            ? opts.conventionalGraduate.join(',')
            : [],
        )
      : [];

    /** 将当前更改发布为预发布版本 */
    const conventionalPrerelease = opts.conventionalPrerelease
      ? ['--conventional-prerelease'].concat(
          Array.isArray(opts.conventionalPrerelease)
            ? opts.conventionalPrerelease.join(',')
            : [],
        )
      : [];

    const versionArguments = [
      'version',
      '--exact',
      '--message',
      `'${opts.commitMessage as string}'`,
    ];

    if (!opts.selectVersion) {
      versionArguments.push('--conventional-commits');
    }

    await exec(
      lernaCli,
      versionArguments
        .concat(conventionalGraduate)
        .concat(conventionalPrerelease),
      {
        shell: false,
      },
    );
  }

  if (!opts.skipPublish) {
    // Publish
    const pkgs = opts.publishOnly
      ? getPackages(cwd, opts.filterPackages)
      : updated;

    const names = pkgs.reduce((prev: string, pkg: any) => {
      return prev + `${pkg.name}, `;
    }, '')

    logStep(`publish packages: ${chalk.blue(names)}`);

    /** 发布包 */
    pkgs.forEach((pkg: any, index: number) => {
      const pkgPath = pkg.contents;
      const { name, version } = pkg;
      const isNext = isNextVersion(version);

      let isPackageExist = null;

      if (opts.publishOnly) {
        isPackageExist = packageExists({ name, version });

        if (isPackageExist) {
          console.log(
            `package ${name}@${version} is already exists on npm, skip.`,
          );
        }
      }

      if (!opts.publishOnly || !isPackageExist) {
        console.log(
          `[${index + 1}/${pkgs.length}] Publish package ${name} ${
            isNext ? 'with next tag' : ''
          }`,
        );
        const cliArgs = isNext ? ['publish', '--tag', 'next'] : ['publish'];
        const { stdout } = execa.sync('npm', cliArgs, {
          cwd: pkgPath,
        });
        console.log(stdout);
      }
    });
  }

  logStep('done');
}
