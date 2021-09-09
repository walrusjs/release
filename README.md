<h1 align="center">
  @walrus/release-cli
</h1>

<h2 align="center">
  发布版本的小工具
</h2>

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

2️⃣ **完善项目信息** `package.json`:

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
