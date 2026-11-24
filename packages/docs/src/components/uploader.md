---
title: Uploader
subtitle: 文件上传
demo: pages-sub/form/uploader/uploader
added: 0.8.0
---

## 介绍

用于选择本地图片 / 视频并预览，支持数量与大小限制、上传状态与进度展示、内置 `uni.uploadFile` 上传、全屏预览、长按拖拽排序，以及选择区 / 预览覆盖层 / 删除按钮插槽定制。

> `v-model:value` 的元素为普通对象（`UTSJSONObject`），字段：`url`、`path`、`name`、`size`、`type`、`status`、`message`、`progress`、`deletable`。缺失字段会按默认值补全。

## 代码演示

### 基础用法 {#demo-basic}

通过 `v-model:value` 绑定文件列表，`multiple` 开启多选：

```vue
<m-uploader
	v-model:value="files"
	multiple
	upload-text="上传图片"
	@change="onChange"
	@after-read="onAfterRead"
/>
```

```uts
const files = ref<UTSJSONObject[]>([])

function onAfterRead(item: UTSJSONObject, index: number) {
	// 未配置 upload-url 时由业务自行上传
}
```

### 上传状态 {#demo-status}

未配置 `upload-url` 时，组件只负责选择与展示；业务在 `after-read` 中调用 `setItemStatus` 回写状态：

```uts
const uploaderRef = ref<ComponentPublicInstance | null>(null)

function onAfterRead(item: UTSJSONObject, index: number) {
	const inst = uploaderRef.value
	if (inst == null) return
	inst.$callMethod('setItemStatus', index, 'uploading', '上传中', 30)
	setTimeout(() => {
		inst.$callMethod('setItemStatus', index, 'done', '', 100)
	}, 800)
}
```

`status` 取值为 `ready` / `uploading` / `done` / `failed`；失败项点击会自动触发 `reupload`。

### 数量与大小限制 {#demo-limit}

```vue
<m-uploader v-model:value="files" multiple :max-count="2" :max-size="102400" @oversize="onOversize" />
```

`max-count` 为 0 时不限数量；`max-size` 为单文件字节上限，0 不限，超限文件会通过 `oversize` 事件返回。

### 媒体类型 {#demo-media}

```vue
<m-uploader v-model:value="images" multiple />
<m-uploader v-model:value="videos" media-type="video" :max-count="1" upload-text="上传视频" />
```

`media-type` 支持 `image` / `video` / 数组。视频项无缩略图能力，以播放角标占位；数组同时包含两者时选择器按图片打开。

### 直接拍照 {#demo-capture}

```vue
<m-uploader v-model:value="files" capture="camera" :max-count="1" upload-text="拍照" />
```

### 禁用与只读 {#demo-status-prop}

```vue
<m-uploader :value="files" disabled />
<m-uploader :value="files" readonly :deletable="false" />
```

`disabled` 整体置灰且不可选择 / 删除；`readonly` 隐藏选择区，仅展示列表。

### 插槽自定义 {#demo-slot}

```vue
<m-uploader v-model:value="files" multiple>
	<template #preview-cover="{ item, index }">
		<text>第 {{ index + 1 }} 张</text>
	</template>
	<template #preview-delete="{ index }">
		<text>×</text>
	</template>
	<view>+ 自定义选择区</view>
</m-uploader>
```

### 内置上传 {#demo-upload}

配置 `upload-url` 后，选择完成会自动调用 `uni.uploadFile`，并回填 `status` / `progress`：

```vue
<m-uploader
	v-model:value="files"
	multiple
	upload-url="https://example.com/upload"
	upload-name="file"
	:form-data="formData"
	:header="header"
	@progress="onProgress"
	@success="onSuccess"
	@error="onError"
/>
```

```uts
const formData = { scene: 'avatar' } as UTSJSONObject
const header = { Authorization: 'Bearer token' } as UTSJSONObject

function onProgress(index: number, progress: number, item: UTSJSONObject) {
	console.log('upload progress: ' + progress.toString())
}

function onSuccess(index: number, item: UTSJSONObject, response: string) {
	// response 为服务端返回的 data 字符串
}

function onError(index: number, item: UTSJSONObject, errMsg: string) {
	console.log('upload error: ' + errMsg)
}
```

### 拖拽排序 {#demo-sort}

`sortable` 开启后，长按预览格 300ms 进入拖拽，松手后派发 `sort`：

```vue
<m-uploader v-model:value="files" multiple sortable @sort="onSort" />
```

### 实例方法 {#demo-method}

```vue
<m-uploader ref="uploaderRef" v-model:value="files" />
<m-button @click="callChoose">选择</m-button>
```

```uts
function callChoose() {
	const inst = uploaderRef.value
	if (inst != null) inst.$callMethod('choose')
}
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 文件列表（v-model:value） | UTSJSONObject[] | `[]` |
| media-type | 可选媒体类型：`image` / `video` / 数组 | string \| string[] | `'image'` |
| multiple | 是否多选 | boolean | `false` |
| max-count | 最大数量（0 不限） | number | `0` |
| max-size | 单文件大小上限，字节（0 不限） | number | `0` |
| accept | 文件类型过滤（透传 extension，仅 Web 生效） | string | `''` |
| capture | 直接调起摄像头（传 `'camera'`） | string | `''` |
| disabled | 禁用选择与删除 | boolean | `false` |
| readonly | 只读：隐藏选择区，仅展示列表 | boolean | `false` |
| deletable | 是否展示删除按钮 | boolean | `true` |
| show-upload | 是否展示选择区 | boolean | `true` |
| preview-size | 预览格尺寸 px，可传 `[宽, 高]` | number \| number[] | `0` |
| preview-full-image | 点击预览图是否全屏预览 | boolean | `true` |
| image-fit | 预览图裁剪模式（image 组件的 mode 取值） | UploaderImageMode | `'aspectFill'` |
| upload-text | 选择区文字 | string | `''` |
| upload-icon | 选择区图标名 | IconName | `'plus'` |
| upload-url | 服务端地址（非空则内置上传） | string | `''` |
| upload-name | 上传文件字段名 | string | `'file'` |
| form-data | 附加表单数据 | UTSJSONObject \| null | `null` |
| header | 请求头 | UTSJSONObject \| null | `null` |
| before-choose | 选择前钩子，调用 `next(true)` 继续 | `(fileList, next) => void` | - |
| before-read | 读取前校验，返回 boolean 或 Promise&lt;boolean&gt; | Function | - |
| before-delete | 删除前校验，返回 boolean 或 Promise&lt;boolean&gt; | Function | - |
| sortable | 是否开启长按拖拽排序 | boolean | `false` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 列表变化（v-model:value） | value: UTSJSONObject[] |
| change | 列表变化（增 / 删 / 状态更新） | value: UTSJSONObject[] |
| afterRead | 选择完成（未配置 upload-url 时由业务上传） | item, index |
| oversize | 文件超过 max-size 被过滤 | files: UTSJSONObject[] |
| clickUpload | 点击选择区 | event: MouseEvent |
| clickPreview | 点击预览图（全屏预览前） | index, item |
| itemClick | 点击单项（失败重传入口） | index, item |
| delete | 删除单项 | index, item |
| progress | 内置上传进度变化 | index, progress, item |
| success | 内置上传成功 | index, item, response |
| error | 内置上传失败 | index, item, errMsg |
| sort | 拖拽排序完成 | fromIndex, toIndex, value |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 自定义选择区内容 | - |
| preview-cover | 覆盖在预览图上的内容 | item, index |
| preview-delete | 自定义删除按钮 | item, index |

### Methods

| 方法 | 说明 |
| --- | --- |
| choose() | 主动调起选择 |
| clear() | 清空列表并中止未完成上传 |
| abort(index) | 中止指定项的上传 |
| reupload(index) | 重传指定项 |
| setItemStatus(index, status, message, progress) | 回写单项状态 |

## 主题定制

| 变量 | 说明 | 默认值 |
| --- | --- | --- |
| $m-uploader-size | 预览格默认边长 | 80px |
| $m-uploader-gap | 格子间距 | 8px |
| $m-uploader-radius | 预览格圆角 | 主题中圆角 |
| $m-uploader-select-background | 选择区底色 | #f7f8fa |
| $m-uploader-select-active-opacity | 选择区按压态透明度 | 0.7 |
| $m-uploader-icon-size | 选择区图标尺寸 | 24px |
| $m-uploader-icon-color | 选择区图标颜色 | #dcdee0 |
| $m-uploader-text-font-size | 选择区文字字号 | 12px |
| $m-uploader-text-color | 选择区文字颜色 | 三级文本色 |
| $m-uploader-delete-size | 删除按钮直径 | 18px |
| $m-uploader-delete-icon-size | 删除图标字号 | 10px |
| $m-uploader-delete-background | 删除按钮底色 | rgba(0,0,0,.7) |
| $m-uploader-delete-color | 删除图标颜色 | #ffffff |
| $m-uploader-mask-background | 状态遮罩底色 | rgba(0,0,0,.6) |
| $m-uploader-mask-color | 进度文字颜色 | #ffffff |
| $m-uploader-mask-font-size | 进度 / 失败文字字号 | 12px |
| $m-uploader-failed-color | 失败文字颜色 | 主题危险色 |
| $m-uploader-video-background | 视频占位底色 | #000000 |
| $m-uploader-cover-background | 预览覆盖层底色 | rgba(0,0,0,.3) |
| $m-uploader-disabled-opacity | 禁用态透明度 | 主题禁用透明度 |

完整变量与覆盖方式见[主题定制](/guide/theming)。

## 与 Vant / Sard 的差异

- **绑定语法**：统一 `v-model:value`
- **上传职责**：兼容两种模式——`upload-url` 非空走内置 `uni.uploadFile`，为空只派发 `after-read`
- **状态写回**：不直接改元素属性（uni-app x 中不会触发父组件更新），改为 `setItemStatus` 实例方法
- **媒体类型**：`media-type` 支持 `image` / `video` / 数组，不提供通用文件类型
- **排序**：内置长按拖拽排序（Vant / Sard 需业务实现）
- **预览**：图片使用 `uni.previewImage`；视频项点击派发 `item-click`，由业务处理播放

## 注意事项

- `value` 元素为 `UTSJSONObject`，业务新增自定义字段不会丢失内部逻辑，但组件只读写上述标准字段
- 配置 `upload-url` 后，选择完成会自动上传；`success` 事件回传服务端 `data` 字符串，如需把 `url` 换成服务端地址，业务整体回写 `value` 即可
- 内置上传按文件 `path` 关联任务，删除 / 排序后仍能正确回填对应项
- `before-read` / `before-delete` 支持返回 Promise，`false` 时分别丢弃文件 / 取消删除
- 拖拽排序依赖触摸事件（App / 小程序 / 移动端浏览器），桌面端鼠标拖动不生效
- 主题 `$m-uploader-size` 控制默认格子尺寸；开启 `sortable` 且覆盖该变量时，请同时传 `preview-size` 保持一致（拖拽几何按默认 80px 计算）
- 只读模式只隐藏选择区，预览与点击仍然可用；需要完全冻结请使用 `disabled`
