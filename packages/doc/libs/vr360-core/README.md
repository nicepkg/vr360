# 介绍

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

:::: code-group
::: code-group-item npm

```bash
npm i @nicepkg/vr360-core threejs
```

:::
::: code-group-item yarn

```bash
yarn add @nicepkg/vr360-core threejs
```

:::
::: code-group-item pnpm

```bash
pnpm add @nicepkg/vr360-core threejs
```

:::
::::

## 为什么

如果产品叫你实现一个类似全景看房的功能，而且时间紧，你会怎么做？

学 threejs 知识，然后徒手撸出全景，然后自己抽象出一个 json 配置驱动和后端数据联调对接？

可能还要自己写一个全景编辑器？

可以但没必要，你完全可以把时间省下来做些有意义的事，你只要用 `@nicepkg/vr360-core` 就可以了。

简单点的业务需求仅需 json 配置就能实现，重要是这种代码拉条哈士奇也能维护。

编辑器还在开发中，复杂度不会消失，只会转移，当你岁月静好，一定是作者在为你负重前行。

## 使用

请阅读我们的 [属性文档](./properties.md)、 [函数文档](./methods.md)、[事件文档](./events.md)，了解如何使用 `@nicepkg/vr360-core`。

除了下面的简易示例，你也可以浏览我们的 [完整项目示例](./example.md)

#### 简易示例效果

<br>
<DemoA></DemoA>

#### 简易示例代码（cv 专用）

<br>
<CodeGroup>
  <CodeGroupItem title="vue2" active>

@[code vue](@/examples/firstHouse/vue2.vue)

  </CodeGroupItem>
  <CodeGroupItem title="vue3">

@[code vue](@/examples/firstHouse/vue3.vue)

  </CodeGroupItem>
  <CodeGroupItem title="react">

@[code tsx](@/examples/firstHouse/react.tsx)

  </CodeGroupItem>
  <CodeGroupItem title="原生">

@[code html](@/examples/firstHouse/html.html)

  </CodeGroupItem>
  <CodeGroupItem title="demo.css">

@[code css](@/examples/firstHouse/demo.css)

  </CodeGroupItem>
</CodeGroup>
