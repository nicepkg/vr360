/* eslint-disable @typescript-eslint/no-unnecessary-type-arguments */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import type {Ref} from 'vue'
import {shallowRef, ref, watch} from 'vue'
import type {SpaceConfig} from '@nicepkg/vr360-core'
import {Vr360} from '@nicepkg/vr360-core'

export type MaybeRef<T> = T | Ref<T>

export type UseVr360Options = {
  containerEl?: MaybeRef<HTMLElement | undefined>
  tipEl?: MaybeRef<HTMLElement | undefined>
  spacesConfig?: MaybeRef<SpaceConfig[]>
}

const containerRef = ref<HTMLElement>()
const tipRef = ref<HTMLElement>()
const tipLeft = ref(0)
const tipTop = ref(0)
const showTip = ref(false)
const tipTitle = ref('')
const tipContent = ref('')
const vr360 = shallowRef<InstanceType<typeof Vr360>>()

const spacesConfig = ref<SpaceConfig[]>()

watch(
  [containerRef, tipRef, spacesConfig],
  () => {
    if (containerRef.value && tipRef.value && spacesConfig.value) {
      if (!vr360.value) {
        console.log('创建 vr360实例')
        vr360.value = new Vr360({
          container: containerRef.value,
          tipContainer: tipRef.value,
          spacesConfig: spacesConfig.value
        })

        // vr360.value.controls.autoRotate = true

        vr360.value.render()

        vr360.value.listenResize()

        vr360.value.on('showTip', e => {
          // vr360.value!.controls.autoRotate = false
          const {top, left, tip} = e
          showTip.value = true
          tipLeft.value = left
          tipTop.value = top
          tipTitle.value = tip.content.title
          tipContent.value = tip.content.text
        })

        vr360.value.on('hideTip', () => {
          // vr360.value!.controls.autoRotate = true
          showTip.value = false
        })
      } else {
        vr360.value.updateSpacesConfig(spacesConfig.value)
      }
    }
  },
  {
    immediate: true,
    deep: true
  }
)

export function useVr360(options: UseVr360Options) {
  const createReturn = () => {
    return {
      vr360,
      containerRef,
      tipRef,
      spacesConfig,
      tipLeft,
      tipTop,
      showTip,
      tipTitle,
      tipContent
    }
  }

  watch(
    ref(options.containerEl),
    val => {
      if (val) containerRef.value = val
    },
    {
      immediate: true
    }
  )

  watch(
    ref(options.tipEl),
    val => {
      if (val) tipRef.value = val
    },
    {
      immediate: true
    }
  )

  watch(
    ref(options.spacesConfig),
    val => {
      if (val) spacesConfig.value = val
    },
    {
      immediate: true,
      deep: true
    }
  )

  return createReturn()
}
