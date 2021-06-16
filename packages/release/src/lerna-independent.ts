import { getLernaUpdated } from './utils';
import type { Options } from './types';

export async function lernaIndependent(
  cwd: string,
  opts: Options
) {
  /** 获取更新的包 */
  const updated = getLernaUpdated(opts) ?? [];
  console.log(updated);
}
