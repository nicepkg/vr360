<div align="center">
  <a href="https://vr360.nicepkg.cn/libs/vr360-core/">
    <img src="https://vr360.nicepkg.cn/images/logo-bg.png" width="50%">
  </a>
  <h1>@nicepkg/vr360-core</h1>
  <p>json 驱动的全景浏览库核心，设计框架无关性，可用于任何框架，如vue/react/angular/svelte/solidjs...</p>
  <p>
    <img src="https://img.shields.io/npm/v/@nicepkg/vr360-core?style=flat-square" alt="version">
    <img src="https://img.shields.io/npm/dependency-version/@nicepkg/vr360-core/peer/three" alt="three">
    <img src="https://img.shields.io/npm/l/@nicepkg/vr360-core.svg" alt="license">
    <img src="https://img.shields.io/codecov/c/github/nicepkg/vr360" alt="coverage">
    <img src="https://img.badgesize.io/https://unpkg.com/@nicepkg/vr360-core?compression=gzip&label=gzip" alt="gzip" />
    <img src="https://img.shields.io/github/stars/nicepkg/vr360?style=social" alt="stars">
  </p>
</div>

## 介绍

`@nicepkg/vr360-core` 是一个基于 [threejs](https://github.com/mrdoob/three.js/) 的全景库，非常适合用来做全景看房、全景街景、全景景点等业务需求。

它支持 json 配置驱动视图，你可以用 json 配置的方式快速实现常见全景需求。

## 特性

- json 驱动视图，快速实现全景业务需求
- 高性能，支持自动找出 json 变更的部分，最小化更新到 3d 全景里，不会整个场景重建。
- 支持增删改提示点，hover 提示点的弹窗支持自定义定制，支持自定义提示点的贴图。
- 内置场景切换穿梭动画
- 暴露 scene、camera、renderer 等 [threejs](https://github.com/mrdoob/three.js/) 对象，方便你更高的定制化
- 基于事件驱动的数据交互，设计框架无关性
- 完整的 ts 支持

## 安装

for npm

```bash
npm i @nicepkg/vr360-core threejs
```

for yarn

```bash
yarn add @nicepkg/vr360-core threejs
```

for pnpm

```bash
pnpm add @nicepkg/vr360-core threejs
```

## 使用

点击查看[使用文档](https://vr360.nicepkg.cn/libs/vr360-core/)。

## Contributing

Learn about contribution [here](https://github.com/nicepkg/vr360/blob/master/CONTRIBUTING.md).

This project exists thanks to all the people who contribute:

<a href="https://github.com/nicepkg/vr360/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nicepkg/vr360" />
</a>

## License

[MIT](https://github.com/nicepkg/vr360/blob/master/LICENSE) License © 2022-PRESENT [nicepkg](https://github.com/nicepkg)
