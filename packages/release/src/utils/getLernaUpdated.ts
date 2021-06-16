/// <reference path="../../typings/index.d.ts" />

import { logStep } from './';
import { Package } from '@lerna/package';
import { filterPackages } from '@lerna/filter-packages';
import { execa } from '@walrus/cli-utils';
import type { Options } from '../types';

const lernaCli = require.resolve('lerna/cli');

export const getLernaUpdated = (opts: Options) => {
  let updated = null;
  const scope = opts.scope ?? [];
  const ignore = opts.ignore ?? [];

  if (!opts.publishOnly) {
    // Get updated packages
    logStep('check updated packages');

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

    updated = filterPackages(packages, scope, ignore, !opts.excludePrivate);
  }

  return updated;
};
