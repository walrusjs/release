export interface ReleaseConfig {
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
  /** npm push --tag **** */
  tag?: string;
}
