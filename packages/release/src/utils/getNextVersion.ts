import semver, { ReleaseType } from 'semver';
import inquirer from 'inquirer';

export const bumps = ['patch', 'minor', 'major', 'prerelease'];

export const nexts = ['rc', 'beta', 'alpha'];

export async function getNextVersion(currentVersion: string) {
  const versions: Record<string, string> = {};
  bumps.forEach((bump) => {
    versions[bump] = semver.inc(currentVersion, bump as ReleaseType) as string;
  });

  nexts.forEach((next) => {
    versions[next] = semver.inc(currentVersion, 'prerelease', next) as string;
  });

  const choices = Object.keys(versions).map((b) => ({
    name: `${b} (${versions[b]})`,
    value: b
  }));

  const { bump, customVersion } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [...choices, { name: 'custom', value: 'custom' }]
    },
    {
      name: 'customVersion',
      message: 'Input version:',
      type: 'input',
      when: (answers) => answers.bump === 'custom'
    }
  ]);

  return customVersion || versions[bump];
}
