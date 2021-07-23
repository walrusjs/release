/// <reference path="../../typings/index.d.ts" />

import { Package } from '@lerna/package';
import { filterPackages } from '@lerna/filter-packages';
import { execa } from '@walrus/cli-utils';

const lernaCli = require.resolve('lerna/cli');

/**
 * 获取需要更新的包，支持过滤
 * @param scope
 * @param ignore
 * @param showPrivate
 * @returns
 */
export const getLernaUpdated = (
  scope: string[],
  ignore: string[],
  showPrivate = false
) => {
  let updated = [];

  const changedArguments = [
    'changed',
    '--ndjson'
  ];

  const updatedStdout = execa.sync(lernaCli, changedArguments).stdout;

  updated = updatedStdout
    .split('\n')
    .map(item => JSON.parse(item))
    .filter(Boolean);

  const packages = updated.map(item => {
    const pkg = require(`${item.location}/package.json`);
    return new Package(pkg, item.location);
  });

  updated = filterPackages(packages, scope, ignore, showPrivate);

  return updated;
};
