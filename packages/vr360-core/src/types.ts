/* eslint-disable @typescript-eslint/no-explicit-any */

import type {ConfigModel} from './manager'
import type {SpaceManagerEvents} from './manager/space'

/**
 * vr360 暴露的自定义事件
 */
export type Vr360Events = {
  /**
   * 每帧更新回调
   */
  update: () => void
} & SpaceManagerEvents

/**
 * 通用坐标
 */
export type Vector3Position = {
  /**
   * x 轴坐标
   */
  x: number

  /**
   * y 轴坐标
   */
  y: number

  /**
   * z 轴坐标
   */
  z: number
}

/**
 * 位置
 */
export type Position = Vector3Position

/**
 * 缩放
 */
export type Scale = Vector3Position

/**
 * 旋转
 */
export type Rotate = Vector3Position

/**
 * 每个 threejs 对象的通用配置
 */
export type ThreeObjectBase = {
  /**
   * 位置
   */
  position: Position

  /**
   * 缩放
   */
  scale?: Scale

  /**
   * 旋转
   */
  rotate?: Rotate
}

/**
 * 立方体空间纹理贴图 url 列表
 */
export type CubeSpaceTextureUrls = {
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

/**
 * 提示配置
 */
export type Tip = {
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
   * 其它携带信息，比如你可以附加 title 、 content，在提示相关事件回调时你可以拿到
   */
  [key: string]: any
} & ThreeObjectBase &
  ConfigModel

/**
 * 空间配置
 */
export type SpaceConfig = {
  /**
   * 空间 id
   */
  id: string

  /**
   * 相机配置
   */
  camera?: ThreeObjectBase

  /**
   * 提示配置列表
   */
  tips?: Tip[]

  /**
   * 空间贴图列表
   */
  cubeSpaceTextureUrls: CubeSpaceTextureUrls
} & ConfigModel

export type Vr360Options = {
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
