/// <reference path="../../typings/index.d.ts" />

import { getPackagesSync } from '@lerna/project';
import { filterPackages } from '@lerna/filter-packages';
import type { FilterPackageOptions } from '../types';

/**
 * 获取lerna所有的包，支持过滤
 * @param cwd
 * @param opts
 * @returns
 */
export function getPackages(
  cwd: string,
  opts: FilterPackageOptions = {}
) {
  const { scope = [], ignore = [], showPrivate = false } = opts;
  let pkgs = getPackagesSync(cwd);

  return filterPackages(pkgs, scope, ignore, showPrivate);
}
