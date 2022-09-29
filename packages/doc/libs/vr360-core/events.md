# 事件

## showTip

### 介绍

```ts
interface Vr360Events {
  /**
   * 触发提示时的回调
   */
  showTip: (e: {
    /**
     * 提示配置信息
     */
    tip: Tip

    /**
     * 相对于 container 的 left
     */
    left: number

    /**
     * 相对于 container 的 top
     */
    top: number
  }) => void
}
```

点击查看 [tip](./methods.md#tip-空间配置里的提示配置) 类型

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

vr360.on('showTip', (e) => {
  console.log('触发提示时的回调', e)
})
```

## hideTip

### 介绍

```ts
interface Vr360Events {
  /**
   * 隐藏提示时的回调
   */
  hideTip: (e: {
    /**
     * 提示配置信息
     */
    tip: Tip
  }) => void
}
```

点击查看 [tip](./methods.md#tip-空间配置里的提示配置) 类型

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

vr360.on('hideTip', (e) => {
  console.log('隐藏提示时的回调', e)
})
```

## clickTip

### 介绍

```ts
interface Vr360Events {
  /**
   * 点击提示时的回调
   */
  clickTip: (e: {
    /**
     * 提示配置信息
     */
    tip: Tip
  }) => void
}
```

点击查看 [tip](./methods.md#tip-空间配置里的提示配置) 类型

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

vr360.on('clickTip', (e) => {
  console.log('点击提示时的回调', e)
})
```

## update

### 介绍

```ts
interface Vr360Events {
  /**
   * 每帧更新回调
   */
  update: () => void
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

vr360.on('update', () => {
  console.log('每帧更新回调')
})
```

## afterSwitchSpace

### 介绍

```ts
interface Vr360Events {
  /**
   * 完成跳转空间时的回调
   */
  afterSwitchSpace: (e: {
    /**
     * 跳转的目标空间配置
     */
    spaceConfig: SpaceConfig
  }) => void
}
```

点击查看 [SpaceConfig](./methods.md#spaceconfig-构造参数里的空间配置) 类型

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

vr360.on('afterSwitchSpace', (e) => {
  console.log('完成跳转空间时的回调', e)
})
```
