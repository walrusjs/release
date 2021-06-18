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
  selectVersion?: boolean;
  conventionalGraduate?: any;
  conventionalPrerelease?: any;
  /**  */
  scope?: string[];
  /**  */
  ignore?: string[];
  /** npm push --tag **** */
  tag?: string;
}
