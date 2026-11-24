# m-uploader 文件上传 实施方案

## 需求

用户给出两份参考实现，要求新增文件上传组件：

- Vant Uploader：`https://vant-ui.github.io/vant/#/zh-CN/uploader`
- Sard Upload：`https://sard.wzt.zone/components/upload#uploadprops`

目标：按 unix-ui 组件规范实现 `m-uploader`，覆盖本地选择、预览、状态展示（上传中 / 失败 / 完成）、数量与大小限制、删除、禁用 / 只读、插槽自定义；上传请求是否内置待确认（见疑问清单 Q1）。

## 需求分析

### 两套参考的能力差异

| 能力 | Vant Uploader | Sard Upload | 本组件建议 |
| --- | --- | --- | --- |
| 绑定 | `v-model`（FileListItem[]） | `v-model`（UploadFileItem[]） | `v-model:value`（项目统一约定） |
| 上传职责 | 不内置请求，`after-read` 回调 | 同左，业务在回调里改 `status` / `message` | 待确认（Q1） |
| 媒体类型 | `accept`（原生 input 语义，默认 `image/*`） | `media-type`：`image` / `video` / 数组 | `mediaType`（`image` \| `video` \| `file`） |
| 多选 / 数量 | `multiple` / `max-count` | `multiple` / `max-count` | 同左（`maxCount`，0 为不限） |
| 大小限制 | `max-size` + `oversize` 事件 | `max-size` + `over-size` 事件 | `maxSize` + `oversize` 事件 |
| 选择前钩子 | 无 | `before-choose(fileList, next)`，可注入 `capture` | 保留 `beforeChoose` |
| 读取前钩子 | `before-read`（支持 Promise 做压缩） | 同左 | 保留 `beforeRead` |
| 删除前钩子 | `before-delete` | 无 | 保留 `beforeDelete` |
| 状态 | `status` + `message`（uploading / failed / done） | 同左 | 同左，另加 `progress` 0-100 |
| 失败重传 / 取消 | `reupload` 覆盖上传、`chooseFile` 实例方法 | `item-click` 事件，业务自行重传 / abort | `itemClick` 事件（Q3） |
| 只读 / 禁用 | `disabled` / `readonly`（只读仅作用上传区） | `readonly` 隐藏选区、`disabled` 置灰 | 同 Sard：readonly 隐藏选区 |
| 预览 | `preview-size` / `preview-full-image` / `image-fit` | 无独立预览配置 | `previewSize` / `previewFullImage` / `imageFit` |
| 插槽 | `default`（选区）、`preview-delete`、`preview-cover` | `select`（选区）、作用域 `default`（全量渲染） | `default`（选区）、`preview-cover`、`preview-delete` |

### uni-app x 平台约束（已核对官方文档，影响 API 形态）

| 事实 | 来源 | 对设计的影响 |
| --- | --- | --- |
| `uni.chooseImage` 成功返回 `tempFilePaths` + `tempFiles{path,size,name?,type?}`，`name` / `type` 仅 H5 有 | choose-image 文档 | Android / iOS 需自行从 `path` 推导文件名与类型 |
| `count` 在 App 端不限制，小程序上限 20 | choose-image 文档 | 数量上限必须由组件侧 `maxCount` 再裁剪 |
| `extension` 仅 H5 支持 | choose-image 文档 | `accept` 仅 Web 生效，不作为主过滤手段 |
| `uni.chooseFile` 的 `type` 支持 `image` / `video` / `audio` / `all`；`extension` App 端仅 Harmony 支持；`sizeType` / `sourceType` App 端不支持 | choose-file 文档 | 通用文件选择的能力在端上不一致，需要条件编译降级 |
| `uni.chooseFile` 的 `tempFilePaths` **Android 不支持**，需读 `tempFiles` | choose-file 文档 | 统一归一化逻辑必须以 `tempFiles` 为主、`tempFilePaths` 兜底 |
| `uni.uploadFile` Web 4.0 / Android 3.91 / iOS 4.11 / Harmony 4.61 均支持，返回 `UploadTask`（`onProgressUpdate` / `abort`） | upload-file 文档 | 内置上传能力可跨端实现，进度可真实回填 |

### 涉及文件与影响面

- 组件：`packages/core/components/m-uploader/m-uploader.uvue`（新建）
- 主题：`packages/core/theme/vars.scss` 新增 `$m-uploader-*` 段（全部 `!default`）
- 同步：`pnpm sync:uni-modules`（playground 侧只读产物）
- 演示页：`packages/playground/pages-sub/form/uploader/uploader.uvue`（新建，归数据录入组），页面内 `defineUniPage({ title: '文件上传 Uploader', name: 'uploader' })`
- 演示登记：`pages/index/demo-components.uts` 数据录入组，字母序排在组末（`switch` 之后）
- 双语文档：`packages/docs/src/components/uploader.md`、`src/en/components/uploader.md`
- 侧栏：`docs/.vitepress/config/zh.ts` / `en.ts` 数据录入组，同步插在 `switch` 之后
- 插件元数据：`playground/uni_modules/m-ui-x/changelog.md`（KEEP 文件，手工追加）

## 伪代码设计

### 类型

```text
type UploadStatus = 'ready' | 'uploading' | 'done' | 'failed'

type UploadFileItem = {
  url: string        // 预览地址：本地临时路径或服务端返回地址
  path: string       // 上传用的本地路径（uni.uploadFile 的 filePath）
  name: string       // 文件名（App 端从 path 推导）
  size: number       // 字节
  type: string       // image / video / file
  status: UploadStatus
  message: string    // 状态文案（上传中 / 失败原因）
  progress: number   // 0-100
  deletable: boolean // 单项删除开关，默认跟随 deletable 属性
}
```

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 文件列表（`v-model:value`） | UploadFileItem[] | `[]` |
| mediaType | 可选媒体类型 | `'image' \| 'video' \| 'file' \| string[]` | `'image'` |
| multiple | 是否多选 | boolean | `false` |
| maxCount | 最大数量（0 不限） | number | `0` |
| maxSize | 单文件大小上限，字节（0 不限） | number | `0` |
| accept | 文件类型过滤（仅 Web 生效，透传 `extension`） | string | `''` |
| capture | 直接调起摄像头（`'camera'`） | string | `''` |
| disabled | 禁用选择与删除 | boolean | `false` |
| readonly | 只读：隐藏选择区，仅展示列表 | boolean | `false` |
| deletable | 是否展示删除按钮 | boolean | `true` |
| showUpload | 是否展示选择区 | boolean | `true` |
| previewSize | 预览格尺寸 px，可传 `[宽, 高]` | number \| number[] | `0`（用主题 80px） |
| previewFullImage | 点击预览图是否全屏预览 | boolean | `true` |
| imageFit | 预览图裁剪模式 | string | `'aspectFill'` |
| uploadText | 选择区文字 | string | `''` |
| uploadIcon | 选择区图标名 | string | `'plus'` |
| uploadUrl | 服务端地址（非空则内置上传，见 Q1） | string | `''` |
| uploadName | 上传文件字段名 | string | `'file'` |
| formData / header | 附加表单数据 / 请求头 | UTSJSONObject \| null | `null` |
| beforeChoose | 选择前钩子，`next(boolean \| options)` 决定是否继续（Sard 能力） | Function | `null` |
| beforeRead | 读取前校验，返回 `boolean` 或 `Promise<boolean>`（可做压缩） | Function | `null` |
| beforeDelete | 删除前校验，返回 `boolean` 或 `Promise<boolean>` | Function | `null` |
| customClass / customStyle | 根节点样式直达 | string | `''` |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:value | 列表变化（`v-model:value`） | value: UploadFileItem[] |
| change | 列表变化（增 / 删 / 状态更新） | value: UploadFileItem[] |
| afterRead | 选择完成（未配置 `uploadUrl` 时由业务上传） | item: UploadFileItem, index: number |
| oversize | 文件超过 `maxSize` 被过滤 | files: UploadFileItem[] |
| clickUpload | 点击选择区（禁用 / 只读不触发） | event: UniEvent |
| clickPreview | 点击预览图 | index: number, item: UploadFileItem |
| itemClick | 点击单项（失败重传 / 取消上传入口） | index: number, item: UploadFileItem |
| delete | 删除单项 | index: number, item: UploadFileItem |
| progress | 内置上传进度变化 | index: number, progress: number, item: UploadFileItem |
| success | 内置上传成功 | index: number, item: UploadFileItem, response: string |
| error | 内置上传失败 | index: number, item: UploadFileItem, errMsg: string |

### Slots

| 名称 | 说明 | 作用域参数 |
| --- | --- | --- |
| default | 自定义选择区内容（替代图标 + 文案） | - |
| preview-cover | 覆盖在预览图上的内容 | item: UploadFileItem, index: number |
| preview-delete | 自定义删除按钮 | item: UploadFileItem, index: number |

### 暴露方法

| 方法 | 说明 |
| --- | --- |
| choose() | 主动调起选择（受 disabled / readonly / maxCount 约束） |
| clear() | 清空列表并中止未完成上传 |
| abort(index) | 中止指定项的上传 |
| setItemStatus(index, status, message, progress) | 业务在 `afterRead` 中回写状态（见 Q4） |

### 模板结构

```text
view.m-uploader（row + wrap，间距用 margin，禁用 gap）
├── view.m-uploader__item（v-for value）
│   ├── m-image.m-uploader__thumb（previewSize / imageFit；视频显示播放角标）
│   ├── view.m-uploader__mask（status = uploading：m-loading + 进度百分比）
│   ├── view.m-uploader__mask--failed（status = failed：重传提示 + message）
│   ├── slot preview-cover（覆盖层最上层）
│   └── view.m-uploader__delete（deletable && status != uploading）
└── view.m-uploader__select（showUpload && !readonly && 未达 maxCount）
    └── slot default / m-icon(uploadIcon) + text.m-uploader__select-text(uploadText)
```

### 关键逻辑（伪代码）

```text
choose():
  若 disabled || readonly → return
  若 maxCount > 0 && value.length >= maxCount → return
  若 beforeChoose 存在 → 等 next(允许/配置)，拒绝则 return
  count = multiple ? (maxCount > 0 ? maxCount - value.length : 9) : 1
  按 mediaType 分发：
    image → uni.chooseImage({ count, sourceType: capture ? ['camera'] : ['album','camera'], extension: accept })
    video → uni.chooseVideo({ sourceType: capture ? ['camera'] : ['album','camera'], maxDuration })
    file  → uni.chooseFile({ count, type: 'all' })
  normalize：优先 tempFiles（path / size / name / type），缺失时用 tempFilePaths + path 推导 name / type
  过滤：size > maxSize → 收集到 oversize，最终 emit oversize
  beforeRead 逐项校验（boolean | Promise<boolean>），false 丢弃
  next = value + 通过项（同时裁剪到 maxCount）
  emit update:value(next) + change
  若 uploadUrl != '' → 逐项 startUpload(item)，否则 emit afterRead(item, index)

startUpload(item):
  item.status = 'uploading'；item.progress = 0；emit update:value
  task = uni.uploadFile({ url: uploadUrl, filePath: item.path, name: uploadName, formData, header })
  taskMap.set(index, task)
  task.onProgressUpdate(e => 更新 progress，按 5% 步长节流 emit update:value + progress)
  success → status = 'done'，url = 业务 resolveUrl(item, response) ?? url；emit success
  fail    → status = 'failed'，message = errMsg；emit error
  结束后 taskMap.delete(index)，emit update:value + change

delete(index):
  beforeDelete(item) 返回 false → 中止
  abort 未完成上传 → 从数组移除 → emit update:value + change + delete

watch(value)：
  同步内部 draft 副本，保证预览 / 状态渲染与外部一致
```

### 主题变量（全部 `!default`）

```scss
$m-uploader-size: 80px;
$m-uploader-gap: 8px;
$m-uploader-radius: $m-radius-md;
$m-uploader-select-background: #f7f8fa;
$m-uploader-select-active-opacity: 0.7;
$m-uploader-icon-size: 24px;
$m-uploader-icon-color: #dcdee0;
$m-uploader-text-font-size: 12px;
$m-uploader-text-color: $m-text-color-tertiary;
$m-uploader-delete-size: 14px;
$m-uploader-delete-background: rgba(0, 0, 0, 0.7);
$m-uploader-delete-color: $m-white;
$m-uploader-mask-background: rgba(0, 0, 0, 0.6);
$m-uploader-mask-color: $m-white;
$m-uploader-mask-font-size: 12px;
$m-uploader-failed-color: $m-color-danger;
$m-uploader-disabled-opacity: $m-disabled-opacity;
```

## 疑问清单

### Q1 上传职责：只做选择，还是内置 uni.uploadFile？（影响：Props / Events / 演示页 / 文档）

- A. 纯选择：组件只调起选择并派发 `afterRead`，上传完全由业务实现（Vant / Sard 原样）。
- B. 内置上传：传 `uploadUrl`，组件用 `uni.uploadFile` 上传并回填 `status` / `progress`，支持 `abort`。
- C. 两者兼容（建议）：`uploadUrl` 非空走内置上传，为空只派发 `afterRead`；已核对 `uni.uploadFile` 在 Web / Android / iOS / Harmony 均支持。

回答：C。

### Q2 首版媒体范围（影响：选择 API 与端上能力降级）

事实：`chooseImage` / `chooseVideo` / `chooseFile` 三端可用；但 `chooseFile` 的 `extension` 仅 Web + Harmony 生效，App 端不支持 `sourceType` / `sizeType`。

- A. 仅图片（与 Vant 默认一致，三端表现最稳）。
- B. 图片 + 视频（建议）：`mediaType` 支持 `image` / `video` / 数组。
- C. 图片 + 视频 + 通用文件：支持 `mediaType='file'`，接受 App 端无法按扩展名过滤的降级。

回答：B。

### Q3 首版边界：全屏预览 / 覆盖上传 / 拍照（影响：模板复杂度与演示条目）

建议：全屏预览做（复用 `m-image` 预览能力）、`capture` 拍照做、`reupload` 覆盖上传不做、拖拽排序不做。

回答：都做。

### Q4 文件项状态写回方式（影响：值契约与 afterRead 语义）

Vant / Sard 的做法是业务直接改 `item.status` / `item.message`（引用共享）。但 uni-app x 中直接改 `v-model` 数组元素的属性不会触发父组件重渲染，且外部改动无法被组件感知。

- A. 保持引用可变（贴近 Vant / Sard），文档明确要求业务改完后重新整体赋值。
- B. 组件暴露 `setItemStatus(index, status, message, progress)`（建议），业务在 `afterRead` 中调用；内置上传时组件内部写回并 emit。
- C. 两者都支持。

回答：B。

## 实施记录

### 方案落地形态

- **值契约改为 `UTSJSONObject[]`**：原设计 `UploadFileItem[]` 为组件内类型，easycom 页面无法导入，UTS 名义类型会导致父页面无法构造同构数组。改为对外收发普通对象（字段 `url` / `path` / `name` / `size` / `type` / `status` / `message` / `progress` / `deletable`），组件内 `fromJsonList` / `toJsonList` 双向转换并补默认值，与 `m-select` / `m-cascader` 的 options 约定一致。
- **Q1（C）双模式**：`upload-url` 非空 → 选择完成自动 `uni.uploadFile`，按文件 `path` 关联 `UploadTask`，进度 5% 步长节流回写；为空 → 仅派发 `after-read`。
- **Q2（B）媒体范围**：`media-type` 支持 `image` / `video` / 数组；仅视频时走 `chooseVideo`，含图片（含混合数组）走 `chooseImage`；`accept` 透传 `extension`（仅 Web 生效）。
- **Q3（都做）**：全屏预览（图片走 `uni.previewImage`，视频点击派发 `item-click`）、`capture="camera"`、失败项点击自动 `reupload`、`sortable` 长按 300ms 拖拽排序（按格子几何计算目标下标，松手派发 `sort`）。
- **Q4（B）**：暴露 `setItemStatus(index, status, message, progress)`；内置上传由组件内部写回并 emit `progress` / `success` / `error`。
- 附带实现：`before-choose`（`next(true/false)` 回调式）、`before-read` / `before-delete`（boolean 或 Promise）、`choose` / `clear` / `abort` / `reupload` 实例方法、`default` / `preview-cover` / `preview-delete` 插槽、`disabled` / `readonly` / `show-upload` / `deletable` 状态约束。
- **尺寸契约**：未传 `preview-size` 时格子尺寸由主题 `$m-uploader-size` 控制（CSS，不再内联 80px）；传值时才写内联宽高。拖拽几何仍以默认 80px 计算，覆盖主题尺寸并开启 `sortable` 时需同时传 `preview-size`（文档已注明）。

### 变更文件清单

| 类型 | 文件 |
| --- | --- |
| 组件 | `packages/core/components/m-uploader/m-uploader.uvue`（新建） |
| 主题 | `packages/core/theme/vars.scss`（新增 `$m-uploader-*` 20 项，全部 `!default`） |
| 同步产物 | `packages/playground/uni_modules/m-ui-x/{components,theme}`（`pnpm sync:uni-modules` 生成） |
| 演示页 | `packages/playground/pages-sub/form/uploader/uploader.uvue`（新建，10 组示例） |
| 演示登记 | `packages/playground/pages/index/demo-components.uts`（数据录入组 `switch` 之后） |
| 文档 | `packages/docs/src/components/uploader.md`、`packages/docs/src/en/components/uploader.md`（新建） |
| 侧栏 | `packages/docs/.vitepress/config/zh.ts`、`en.ts`（数据录入组 `switch` 之后） |
| 插件元数据 | `packages/playground/uni_modules/m-ui-x/changelog.md`（新增 0.8.0 段） |

### 验证方式与结果

- `pnpm sync:uni-modules` 与 `pnpm sync:uni-modules:check` 通过。
- HBuilderX CLI 启动 Web 编译（5174），演示页 `/unix-ui/playground/pages-sub/form/uploader/uploader` 正常渲染，无编译 / 运行时错误。
- 浏览器实测通过：
  - 状态矩阵 4 格（ready / uploading 45% / done / failed）渲染正确；上传中格无删除按钮（`.m-uploader__item` = 4、`.m-uploader__delete` = 3）。
  - 点击图片打开 `uni.previewImage` 全屏预览（1/4），Esc 关闭正常。
  - 点击 × 删除单项，单元格 4 → 3，`change` 正常。
  - 注入 `chooseImage` 成功回调（`tempFiles`）后，预览格正常出现、`after-read` 以 index 0 派发（真实文件选择框无法由自动化控制，未覆盖原生选择弹窗）。
  - 插槽：`preview-cover` 左下角「第 1 张」、自定义 ×、默认插槽「+ 上传」均正确。
  - `disabled` 置灰且 1 格、`readonly` 隐藏选择区且 2 格、媒体类型 / 拍照 / 排序区块均正常。
- `pnpm build:docs` 通过（VitePress 死链检查）。

### 遗留 TODO / 已知限制

- **内置上传**未做真实服务端联调：代码路径已编译通过，`success` / `fail` / 进度回写逻辑需接入真实接口后验证。
- **视频选择 / 视频占位**未在真机验证（Web 端无法选择视频）；`chooseVideo` 分支按官方 API 实现。
- **长按拖拽排序**依赖 `touch` 事件，Web 桌面鼠标未验证；真机触摸交互待回归。
- `before-choose` / `before-read` / `before-delete` 未在演示页配置，逻辑按设计实现，待业务接入时回归。
- 混合媒体数组（`['image', 'video']`）的选择器按图片打开，视频仅能通过业务回写 `value` 注入；已在文档说明。
- 内置上传成功后 `url` 仍为本地路径；如业务需要服务端地址，需在 `success` 后整体回写 `value`（文档已说明），未引入额外的 `resolveUrl` 钩子。
