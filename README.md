<div align="center">
  <a href="https://vr360.vercel.app/">
    <img src="https://vr360.vercel.app/images/logo-dark.svg" width="150">
  </a>
  <br>
  <br>
  <p>快速实现你的全景开发需求，全景看房、全景街景、全景景点</p>
  <p>
    <img src="https://img.shields.io/github/package-json/v/nicepkg/vr360" alt="version">
    <img src="https://img.shields.io/github/license/nicepkg/vr360" alt="license">
    <img src="https://img.shields.io/github/stars/nicepkg/vr360?style=social" alt="stars">
  </p>
</div>

## 介绍

Vr360 是一个基于 threejs 能让你快速实现业务全景需求的库，比如全景看房、全景街景、全景景点。

它的核心被设计为框架无关性，可以用 json 配置的方式快速实现常见全景需求。

后续还会提供高度封装的 viewer 和 editor 等组件，很适合懒人，会提供 vue2/3 、 react 、web component 版本。

json 驱动视图的特性是好维护，你甚至可以不用接触 threejs。写出来的代码拉条哈士奇过来也能维护。

## 文档

[查看文档](https://vr360.vercel.app/)

## 库列表

| 库名                                                           | 文档                                                  | 版本                                                                                             | 描述                                                                                        |
| -------------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------- |
| [@nicepkg/vr360-core](./packages/vr360-core/README.md)         | [链接](https://vr360.vercel.app/libs/vr360-core/)     | <img src="https://img.shields.io/npm/v/@nicepkg/vr360-core?style=flat-square" alt="version">     | json 驱动的全景浏库，设计框架无关性，可用于任何框架，如 vue/react/angular/                  |
| [@nicepkg/vr360-ui](./packages/vr360-ui/README.md)             | [链接](https://vr360.vercel.app/libs/vr360-ui/)       | <img src="https://img.shields.io/npm/v/@nicepkg/vr360-ui?style=flat-square" alt="version">       | (开发中...) 提供一个现成的 vr360 viewer 和 editor 组件，基于 stencil 构建的 web component。 |
| [@nicepkg/vr360-ui-vue2](./packages/vr360-ui-vue2/README.md)   | [链接](https://vr360.vercel.app/libs/vr360-ui-vue2/)  | <img src="https://img.shields.io/npm/v/@nicepkg/vr360-ui-vue2?style=flat-square" alt="version">  | (开发中...) vr360-ui 的 vue2 二次封装版                                                     |
| [@nicepkg/vr360-ui-vue3](./packages/vr360-ui-vue3/README.md)   | [链接](https://vr360.vercel.app/libs/vr360-ui-vue3/)  | <img src="https://img.shields.io/npm/v/@nicepkg/vr360-ui-vue3?style=flat-square" alt="version">  | (开发中...) vr360-ui 的 vue3 二次封装版本，开箱即用。                                       |
| [@nicepkg/vr360-ui-react](./packages/vr360-ui-react/README.md) | [链接](https://vr360.vercel.app/libs/vr360-ui-react/) | <img src="https://img.shields.io/npm/v/@nicepkg/vr360-ui-react?style=flat-square" alt="version"> | (开发中...) vr360-ui 的 react 二次封装版本，开箱即用。                                      |

## Contributing

Learn about contribution [here](https://github.com/nicepkg/vr360/blob/master/CONTRIBUTING.md).

This project exists thanks to all the people who contribute:

<a href="https://github.com/nicepkg/vr360/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=nicepkg/vr360" />
</a>

## License

[MIT](https://github.com/nicepkg/vr360/blob/master/LICENSE) License © 2022-PRESENT [nicepkg](https://github.com/nicepkg)
