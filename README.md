<h1 align="center">
  @walrus/release-cli
</h1>

<h2 align="center">
  发布版本的小工具
</h2>

支持三种发布形式

- 单项目
- 多项目(Lerna) 统一版本
- 多项目(Lerna) 单独版本

**发布步骤**

- 确定发布模式，根据项目根目录是否存在`lerna.json`来区分是否是多包
- 检查 `Git` 状态，是否存在未提交的文件 **可跳过**
- 检查 npm registry **可跳过**
- 编译项目，执行 `npm run build` **可跳过**

**以下为单项目的发布步骤**

- 获取需要发布的版本
- 修改 `package.json` 中的版本
- git commit
- git tag
- git push
- 发布项目 **可跳过**

**以下为多项目独立版本独有的发布步骤**

- 修改版本
- git commit
- git tag
- git push
- publish **可跳过**

**以下为多包统一版本独有的发布步骤**

- 修改版本
- git commit
- git tag
- git push
- publish **可跳过**

## ✨ 特性

- 🚀  快速，默认情况下零配置
- 🌈  支持定制
- 🎉  支持 [lerna](https://github.com/lerna/lerna)
- 💻  使用 TypeScript 编写，提供类型定义文件

## 🏗 安装

请使用 `@walrus/release-cli` 

```
# npm install
$ npm install @walrus/release-cli --save --dev

# yarn install
$ yarn add @walrus/release-cli --dev
```

## 🔨 使用

1️⃣ **安装** 按以上步骤按照依赖

2️⃣ **添加命令** `package.json`:

```json
{ 
  "scripts": {
    "release": "release"
  }
}
```

3️⃣ **执行编译** 运行 `npm run release`.

## 📝 配置文件

项目将按照以下顺序读取配置文件

- `release.config.ts`
- `release.config.js`
- `.releaserc.ts`
- `.releaserc.js`

配置项如下

```ts
{
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
  /** 是否跳过同步到淘宝源 */
  skipSync?: boolean;
  /** 指定提交的信息 */
  commitMessage?: string;
  /** 仅发布，lerna模式有效 */
  publishOnly?: boolean;
  /** 是否选择版本，lerna模式有效 */
  selectVersion?: boolean;
  /** 将预发布版本的软件包升级为稳定版本，lerna模式有效 */
  conventionalGraduate?: string[];
  /** 将当前更改发布为预发布版本，lerna模式有效 */
  conventionalPrerelease?: string[];
  /** 过滤lerna包 */
  filterPackages?: FilterPackagesOptions;
  /** npm push --tag **** */
  tag?: string;
}
```

## ⚡ 命令行参数

### --skip-git-status-check

跳过 Git 状态检查，默认会在发布前是检查否有未提交的文件

### --build-command

设置编译命令，默认`build`

### --skip-build

跳过编译，发布过程会默认执行 `npm run build`；

### --commit-message

指定提交的信息

### --skip-publish

跳过发布，如果项目不需要发布到 npm ，请设置此项。

### --tag 

设置发布的Tag，使用在 npm publish --tag **

```sh
release --tag next
```
