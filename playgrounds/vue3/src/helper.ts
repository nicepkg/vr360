/* eslint-disable unicorn/prefer-add-event-listener */
import type {CubeSpaceTextureUrls} from '@nicepkg/vr360-core'
import qs from 'qs'

/* eslint-disable @typescript-eslint/no-explicit-any */
export type HttpOptions = {
  url: string
  method?: 'get' | 'post'
  type?: 'json' | 'text' | 'blob'
  contentType?: string
  params?: Record<string, any>
  proxy?: boolean
}

export const http = <T = any>(options: HttpOptions): Promise<T> => {
  const {url, method = 'get', type = 'json', contentType = '', params = {}, proxy = false} = options
  let finalUrl = proxy ? `https://bird.ioliu.cn/v1?url=${url}` : url

  if (method === 'get') {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    finalUrl += `?${qs.stringify(params)}`
  }

  return new Promise<T>((resolve, reject) => {
    fetch(finalUrl, {
      method,
      headers: {
        'Content-Type': contentType || (type === 'json' ? 'application/json' : 'text/plain')
      },
      body: method === 'post' ? JSON.stringify(params) : undefined,
      mode: 'cors'
    })
      .then(res => (type === 'json' ? res.json() : type === 'text' ? res.text() : res.blob()))
      .then(res => {
        resolve(res as T)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export const bytesToBase64 = (bytes: number[]) => {
  return `data:image/png;base64,${window.btoa(bytes.reduce((data, byte) => data + String.fromCodePoint(byte), ''))}`
}

export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve(reader.result as string)
    }
    reader.onerror = error => {
      reject(error)
    }
    reader.readAsDataURL(blob)
  })
}

export const getRealseeTextureUrls = async (realseeVrShareUrl: string): Promise<CubeSpaceTextureUrls> => {
  const html = await http<string>({
    url: realseeVrShareUrl,
    method: 'get',
    type: 'json', // md，如果是 text 会自动过滤 xss，导致匹配不了
    proxy: true
  })

  const getScriptCommentContent = (html: string, id: string): string => {
    return (
      [
        ...html.matchAll(
          new RegExp(
            `<script\\s+type="application/json"\\s+id="${id}">\\s*<\\!--\\s*([\\w\\W]+?)\\s*-->\\s*</script>`,
            'ig'
          )
        )
      ][0]?.[1] ?? ''
    )
  }

  const getScriptJson = <T extends Record<string, any>>(html: string, id: string): T => {
    const jsonStr = getScriptCommentContent(html, id).replace(/\n/g, '\\n')
    try {
      return JSON.parse(jsonStr) as T
    } catch (error) {
      console.error('vr360: getRealseeTextureUrls json parse error', error)
      return {} as T
    }
  }

  const realseeVrInfo = getScriptJson<DeepPartial<RealseeVrInfo>>(html, 'vr-work-state')

  const imageBaseUrl = realseeVrInfo.base_url ?? ''
  const {front = '', back = '', left = '', right = '', up = '', down = ''} = realseeVrInfo.panorama?.list?.[0] ?? {}
  const imageEndFixUrl = '?imageMogr2/quality/70/thumbnail/512x'

  const textureUrls = {
    front: `${imageBaseUrl}${front}${imageEndFixUrl}`,
    back: `${imageBaseUrl}${back}${imageEndFixUrl}`,
    left: `${imageBaseUrl}${left}${imageEndFixUrl}`,
    right: `${imageBaseUrl}${right}${imageEndFixUrl}`,
    up: `${imageBaseUrl}${up}${imageEndFixUrl}`,
    down: `${imageBaseUrl}${down}${imageEndFixUrl}`
  }

  console.log('vr360: getRealseeTextureUrls', textureUrls)

  // fetch all images to base64
  const textureUrlsBase64 = await Promise.allSettled(
    Object.entries(textureUrls).map(async ([key, value]) => {
      const {data} = await http<{data: number[]}>({
        url: value,
        method: 'get',
        type: 'json',
        proxy: true
      })
      const base64 = bytesToBase64(data)
      return [key, base64] as [string, string]
    })
  ).then(res => {
    return res.reduce<Record<string, string>>((prev, curr) => {
      if (curr.status === 'fulfilled') {
        const [key, value] = curr.value
        return {...prev, [key]: value}
      }
      return prev
    }, {})
  })

  return {
    front: textureUrlsBase64.front,
    back: textureUrlsBase64.back,
    left: textureUrlsBase64.left,
    right: textureUrlsBase64.right,
    up: textureUrlsBase64.up,
    down: textureUrlsBase64.down
  }
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends readonly (infer V)[]
    ? readonly DeepPartial<V>[]
    : DeepPartial<T[P]>
}

export type RealseeVrInfo = {
  _signature: string
  allow_hosts: any[]
  base_url: string
  certificate: string
  create_time: Date
  expire_at: string
  initial: RealseeVrInfoInitial
  model: RealseeVrInfoModel
  observers: RealseeVrInfoObserver[]
  panorama: RealseeVrInfoPanorama
  picture_url: string
  title_picture_url: string
  vr_code: string
  vr_type: string
  work_code: string
}

export type RealseeVrInfoInitial = {
  fov: number
  heading: number
  latitude: number
  longitude: number
  pano_index: number
}

export type RealseeVrInfoModel = {
  file_url: string
  material_base_url: string
  material_textures: string[]
  modify_time: Date
  type: number
}

export type RealseeVrInfoObserver = {
  accessible_nodes: any[]
  floor_index: number
  index: number
  offset_point_count: number
  position: number[]
  quaternion: RealseeVrInfoObserverQuaternion
  standing_position: number[]
  visible_nodes: any[]
}

export type RealseeVrInfoObserverQuaternion = {
  w: number
  x: number
  y: number
  z: number
}

export type RealseeVrInfoPanorama = {
  count: number
  list: RealseeVrInfoPanoramaList[]
}

export type RealseeVrInfoPanoramaList = {
  back: string
  derived_id: number
  down: string
  front: string
  index: number
  left: string
  right: string
  tiles: number[]
  up: string
}
