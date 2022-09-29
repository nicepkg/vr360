# 属性

## container

### 介绍

```ts
class Vr360 {
  /**
   * 容器
   */
  public container: HTMLElement
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 获取容器
console.log('3d 渲染容器是：', vr360.container)
```

## camera

### 介绍

```ts
class Vr360 {
  /**
   * 相机
   */
  public camera: THREE.PerspectiveCamera
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 获取相机
console.log('3d 相机是：', vr360.camera)
```

## renderer

### 介绍

```ts
class Vr360 {
  /**
   * 渲染器
   */
  public renderer: THREE.WebGLRenderer
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 获取渲染器
console.log('3d 渲染器是：', vr360.renderer)
```

## scene

### 介绍

```ts
class Vr360 {
  /**
   * 场景
   */
  public scene: THREE.Scene
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 获取场景
console.log('3d 场景是：', vr360.scene)
```

## controls

### 介绍

```ts
class Vr360 {
  /**
   * 控制器
   */
  public controls: THREE.OrbitControls
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 获取控制器
console.log('3d 控制器是：', vr360.controls)
```

## spacesConfig

### 介绍

```ts
class Vr360 {
  /**
   * 空间配置
   */
  public spacesConfig: SpaceConfig[]
}
```

点击查看 [SpaceConfig](./methods.md#spaceconfig-构造参数里的空间配置) 类型

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 获取空间配置
console.log('3d 空间配置是：', vr360.spacesConfig)
```

## tipContainer

### 介绍

```ts
class Vr360 {
  /**
   * 提示容器
   */
  public tipContainer?: HTMLElement
}
```

### 示例

```ts
import {Vr360} from '@nicepkg/vr360-core'

const vr360 = new Vr360({....})

vr360.render()

// 获取提示容器
console.log('3d 提示容器是：', vr360.tipContainer)
```
