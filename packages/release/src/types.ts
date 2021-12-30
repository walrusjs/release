import type {
  Options as GetLernaPackagesOpts
} from '@walrus/cli-utils/dist/getPackages';
/**
 * lerna.json数据结构
 */
export interface LernaInfo {
  version?: string;
  npmClient?: string;
  useWorkspaces?: boolean;
  ignoreChanges?: string[];
}

export interface FilterPackagesOptions extends GetLernaPackagesOpts {}

/**
 * 发布的模式
 */
export type Mode = 'lerna' | 'single';

/**
 * 配置参数
 */
export interface Options {
  /** 工作的目录 */
  cwd?: string;
  /** 是否跳过 Git 状态检查 */
  skipGitStatusCheck?: boolean;
  /** 指定编译命令 */
  buildCommand?: string;
  /** 是否跳过编译 */
  skipBuild?: boolean;
  /** 是否跳过发布 */
  skipPublish?: boolean;
  /** 是否跳过 npm 仓库检查 */
  skipNpmRegistryCheck?: boolean;
  /** 指定提交的信息 */
  commitMessage?: string;
  /** 仅发布，lerna模式有效 */
  publishOnly?: boolean;
  /** 将预发布版本的软件包升级为稳定版本，lerna模式有效 */
  conventionalGraduate?: string[];
  /** 将当前更改发布为预发布版本，lerna模式有效 */
  conventionalPrerelease?: string[];
  /** 过滤lerna包 */
  filterPackages?: FilterPackagesOptions;
  /** 是否选择版本，lerna模式有效 */
  selectVersion?: boolean;
  /** npm push --tag **** */
  tag?: string;
  /** 是否跳过同步到淘宝源 */
  skipSync?: boolean;
}
