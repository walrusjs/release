import semver, { ReleaseType } from 'semver';
import inquirer from 'inquirer';

export const bumps = ['patch', 'minor', 'major', 'prerelease'];

export async function getNextVersion(currentVersion: string) {
  const versions: Record<string, string> = {};
  bumps.forEach((b) => {
    versions[b] = semver.inc(currentVersion, b as ReleaseType) as string;
  });

  const bumpChoices = bumps.map((b) => ({ name: `${b} (${versions[b]})`, value: b }));

  const { bump, customVersion } = await inquirer.prompt([
    {
      name: 'bump',
      message: 'Select release type:',
      type: 'list',
      choices: [...bumpChoices, { name: 'custom', value: 'custom' }]
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
