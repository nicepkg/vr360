import {buildUtils} from '@nicepkg/vr360-shared'
import {minifyConfig, unMinifyConfig, packagePath} from '../vite.config'

buildUtils.build({
  minifyConfig,
  unMinifyConfig,
  packagePath,
  dtsOptions: {
    // merge all .d.ts files
    rollupTypes: true
  }
})
