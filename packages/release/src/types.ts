/**
 * lerna.json数据结构
 */
export interface LernaInfo {
  version?: string;
  npmClient?: string;
  useWorkspaces?: boolean;
  ignoreChanges?: string[];
}

export interface FilterPackageOptions {
  scope?: string[];
  ignore?: string[];
  showPrivate?: boolean;
}

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
  /** 是否跳过编译 */
  skipBuild?: boolean;
  /** 是否跳过发布 */
  skipPublish?: boolean;
  /** 是否跳过同步到淘宝源 */
  skipSync?: boolean;
  /** 指定编译命令 */
  buildCommand?: string;
  /** 指定提交的信息 */
  commitMessage?: string;
  /** 仅发布，lerna模式有效 */
  publishOnly?: boolean;
  /** 排除私有的包，lerna模式有效 */
  excludePrivate?: boolean;
  /** 是否选择版本，lerna模式有效 */
  selectVersion?: boolean;
  /** 将预发布版本的软件包升级为稳定版本，lerna模式有效 */
  conventionalGraduate?: string[];
  /** 将当前更改发布为预发布版本，lerna模式有效 */
  conventionalPrerelease?: string[];
  /** 仅包含与给定 glob 匹配的包 */
  scope?: string[];
  /** 排除名称与给定 glob 匹配的包 */
  ignore?: string[];
  /** npm push --tag **** */
  tag?: string;
}
