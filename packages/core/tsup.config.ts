import { defineConfig } from 'tsup'

export default defineConfig(() => ({
  entry: ['src/index.js'], //打包入口
  splitting: true, //是否开启代码分割
  clean: true, //是否清除dist目录
  dts: false, //是否生成dts文件
  minify: true, //是否压缩代码
  treeshake: true, //是否开启tree-shaking
  external: ['axios', 'js-cookie'], //外部依赖
  format: ['esm', 'cjs'] //打包格式
}))
