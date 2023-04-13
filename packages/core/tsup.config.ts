import { defineConfig } from 'tsup'

export default defineConfig(() => ({
    entry: ['src/index.ts'], //打包入口
    splitting: true, //是否开启代码分割
    clean: true, //是否清除dist目录
    dts: true, //是否生成dts文件
    format: ['esm', 'cjs'] //打包格式
}))
