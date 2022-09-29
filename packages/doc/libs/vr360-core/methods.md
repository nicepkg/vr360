# 方法

## constructor

### 介绍

```ts
class Vr360 {
  /**
   * @param options 构造参数配置
   * @returns Vr360 实例
   */
  constructor(options: Vr360Options) {
    ...
  }
}
```

点击查看 [Vr360Options](#vr360options-构造参数) 类型

### 示例

```ts
import {Vr360, Vr360Options} from '@nicepkg/vr360-core'

const vr360Options: Vr360Options = {
  container: document.querySelector('#container'),
  tipContainer: document.querySelector('#tip-container'),
  spacesConfig: []
}
const vr360 = new Vr360(vr360Options)
```

### 相关类型

#### Vr360Options 构造参数

```ts
/**
 *  vr360 的构造参数
 */
interface Vr360Options {
  /**
   * 容器
   */
  container: HTMLElement

  /**
   * 提示的 element 节点
   */
  tipContainer?: HTMLElement

  /**
   * 初始显示的空间 id
   */
  initSpaceId?: string

  /**
   * 空间配置
   */
  spacesConfig: SpaceConfig[]
}
```

#### SpaceConfig 构造参数里的空间配置

```ts
/**
 * 空间配置
 */
interface SpaceConfig {
  /**
   * 空间 id
   */
  id: string

  /**
   * 相机配置
   */
  camera?: {
    /**
     * 位置
     */
    position: {
      x: number
      y: number
      z: number
    }

    /**
     * 缩放
     */
    scale?: {
      x: number
      y: number
      z: number
    }

    /**
     * 旋转
     */
    rotate?: {
      x: number
      y: number
      z: number
    }
  }

  /**
   * 提示配置列表
   */
  tips?: Tip[]

  /**
   * 空间贴图列表
   */
  cubeSpaceTextureUrls: {
    /**
     * 左侧贴图 url
     */
    left: string

    /**
     * 右侧贴图 url
     */
    right: string

    /**
     * 上侧贴图 url
     */
    top: string

    /**
     * 下侧贴图 url
     */
    bottom: string

    /**
     * 前侧贴图 url
     */
    front: string

    /**
     * 后侧贴图 url
     */
    back: string
  }
}
```

#### Tip 空间配置里的提示配置

```ts
interface Tip {
  /**
   * 提示 id
   */
  id: string

  /**
   * 跳转的空间 id
   */
  targetSpaceId?: string

  /**
   * 提示图案纹理贴图
   */
  textureUrl?: string

  /**
   * 位置
   */
  position: {
    x: number
    y: number
    z: number
  }

  /**
   * 缩放
   */
  scale?: {
    x: number
    y: number
    z: number
  }

  /**
   * 旋转
   */
  rotate?: {
    x: number
    y: number
    z: number
  }

  /**
   * 其它携带信息，比如你可以附加 title 、 content，在提示相关事件回调时你可以拿到
   */
  [key: string]: any
}
```

## listenResize

### 介绍

```ts
class Vr360 {
  /**
   * 监听页面尺寸变化，更新画布尺寸
   * @returns 返回取消监听函数
   */
  public listenResize(): () => void {
    ...
  }
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 让渲染器监听页面尺寸变化，实时更新画布尺寸
const removeResizeListener = vr360.listenResize()

// 你可以随时移除监听
removeResizeListener()
```

## updateContainerSize

### 介绍

```ts
class Vr360 {
  /**
   * 更新容器宽高
   */
  public updateContainerSize(): void {
    ...
  }
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 手动更新画布尺寸
vr360.updateContainerSize()
```

## updateSpacesConfig

### 介绍

```ts
class Vr360 {
  /**
   * 更新 spacesConfig
   * @param newSpacesConfig 新的空间配置
   */
  public updateSpacesConfig(newSpacesConfig: SpaceConfig[]): void {
    ...
  }
}
```

点击查看 [SpaceConfig](#spaceconfig-构造参数里的空间配置) 类型

### 示例

```ts
import {Vr360, SpaceConfig} from '@nicepkg/vr360-core'

const spacesConfig: SpaceConfig[] = []
const vr360 = new Vr360({
  container: document.querySelector('#container'),
  tipContainer: document.querySelector('#tip-container'),
  spacesConfig
})

vr360.render()

spacesConfig.push([
  {
    ....
  }
])

// 手动更新空间配置
vr360.updateSpacesConfig(spacesConfig)
```

## switchSpace

### 介绍

```ts
class Vr360 {
   /**
   * 切换空间
   * @param id 空间 id
   */
  public switchSpace(id: string): void {
    ...
  }
}
```

### 示例

```ts
import {Vr360, SpaceConfig} from '@nicepkg/vr360-core'

const spacesConfig: SpaceConfig[] = [
  {
    id: 'roomA',
    ...
  },
  {
    id: 'roomB',
    ...
  }
]

const vr360 = new Vr360({
  container: document.querySelector('#container'),
  tipContainer: document.querySelector('#tip-container'),
  spacesConfig
})

vr360.render()

// 切换到 roomB 空间
vr360.switchSpace('roomB')
```

## render

### 介绍

```ts
class Vr360 {
  /**
   * 渲染
   */
  public render(): void {
    ...
  }
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()
```

## getPositionFromMouseXY

### 介绍

```ts
class Vr360 {
  /**
   * 根据鼠标位置获取当前空间的位置
   * @param x 鼠标 x 坐标
   * @param y 鼠标 y 坐标
   * @returns 返回当前空间的位置
   */
  public getPositionFromMouseXY(x: number, y: number): {
    x: number
    y: number
    z: number
  } {
    ...
  }
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({
  container: document.querySelector('#container'),
  tipContainer: document.querySelector('#tip-container'),
  spacesConfig: [....]
})

vr360.render()

// 获取当前空间的位置
document.querySelector('#container').addEventListener('click', (e) => {
  const {x, y, z} = vr360.getPositionFromMouseXY(e.clientX, e.clientY)
  console.log('点击的画布里的空间位置为：', x, y, z)
})
```

## destroy

### 介绍

```ts
class Vr360 {
  /**
   * 销毁实例
   */
  public destroy(): void {
    ...
  }
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 销毁实例
vr360.destroy()
```
