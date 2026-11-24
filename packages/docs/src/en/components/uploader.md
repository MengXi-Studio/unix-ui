---
title: Uploader
subtitle: Uploader
demo: pages-sub/form/uploader/uploader
added: 0.8.0
---

## Introduction

Select and preview local images / videos, with count and size limits, upload status and progress, built-in `uni.uploadFile` upload, full-screen preview, long-press drag sorting, and slots for the select area, preview cover and delete button.

> Each `v-model:value` element is a plain object (`UTSJSONObject`) with fields: `url`, `path`, `name`, `size`, `type`, `status`, `message`, `progress`, `deletable`. Missing fields are filled with defaults.

## Examples

### Basic usage {#demo-basic}

Bind the file list with `v-model:value`; enable multi-select with `multiple`:

```vue
<m-uploader
	v-model:value="files"
	multiple
	upload-text="Upload image"
	@change="onChange"
	@after-read="onAfterRead"
/>
```

```uts
const files = ref<UTSJSONObject[]>([])

function onAfterRead(item: UTSJSONObject, index: number) {
	// Upload yourself when upload-url is not configured
}
```

### Upload status {#demo-status}

Without `upload-url`, the component only selects and displays; write status back with `setItemStatus` in `after-read`:

```uts
const uploaderRef = ref<ComponentPublicInstance | null>(null)

function onAfterRead(item: UTSJSONObject, index: number) {
	const inst = uploaderRef.value
	if (inst == null) return
	inst.$callMethod('setItemStatus', index, 'uploading', 'Uploading', 30)
	setTimeout(() => {
		inst.$callMethod('setItemStatus', index, 'done', '', 100)
	}, 800)
}
```

`status` is `ready` / `uploading` / `done` / `failed`; tapping a failed item triggers `reupload` automatically.

### Count and size limits {#demo-limit}

```vue
<m-uploader v-model:value="files" multiple :max-count="2" :max-size="102400" @oversize="onOversize" />
```

`max-count` 0 means unlimited; `max-size` is the per-file byte limit (0 unlimited); oversized files are returned through `oversize`.

### Media type {#demo-media}

```vue
<m-uploader v-model:value="images" multiple />
<m-uploader v-model:value="videos" media-type="video" :max-count="1" upload-text="Upload video" />
```

`media-type` supports `image` / `video` / an array. Video items have no thumbnail and render a play badge; when the array contains both, the picker opens in image mode.

### Camera capture {#demo-capture}

```vue
<m-uploader v-model:value="files" capture="camera" :max-count="1" upload-text="Take photo" />
```

### Disabled and readonly {#demo-status-prop}

```vue
<m-uploader :value="files" disabled />
<m-uploader :value="files" readonly :deletable="false" />
```

`disabled` greys out the whole component and blocks select / delete; `readonly` hides the select area and only shows the list.

### Custom slots {#demo-slot}

```vue
<m-uploader v-model:value="files" multiple>
	<template #preview-cover="{ item, index }">
		<text>No. {{ index + 1 }}</text>
	</template>
	<template #preview-delete="{ index }">
		<text>×</text>
	</template>
	<view>+ Custom select area</view>
</m-uploader>
```

### Built-in upload {#demo-upload}

With `upload-url`, selection automatically calls `uni.uploadFile` and fills `status` / `progress`:

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
	// response is the server data string
}

function onError(index: number, item: UTSJSONObject, errMsg: string) {
	console.log('upload error: ' + errMsg)
}
```

### Drag sorting {#demo-sort}

With `sortable`, long-press a preview cell for 300ms to drag; `sort` is emitted on drop:

```vue
<m-uploader v-model:value="files" multiple sortable @sort="onSort" />
```

### Instance methods {#demo-method}

```vue
<m-uploader ref="uploaderRef" v-model:value="files" />
<m-button @click="callChoose">Select</m-button>
```

```uts
function callChoose() {
	const inst = uploaderRef.value
	if (inst != null) inst.$callMethod('choose')
}
```

## API

### Props

| Name | Description | Type | Default |
| --- | --- | --- | --- |
| value | File list (v-model:value) | UTSJSONObject[] | `[]` |
| media-type | Media types: `image` / `video` / array | string \| string[] | `'image'` |
| multiple | Multi-select | boolean | `false` |
| max-count | Max count (0 unlimited) | number | `0` |
| max-size | Per-file byte limit (0 unlimited) | number | `0` |
| accept | Extension filter (extension passthrough, Web only) | string | `''` |
| capture | Open camera directly (`'camera'`) | string | `''` |
| disabled | Disable select and delete | boolean | `false` |
| readonly | Hide the select area, list only | boolean | `false` |
| deletable | Show delete buttons | boolean | `true` |
| show-upload | Show the select area | boolean | `true` |
| preview-size | Cell size px, or `[width, height]` | number \| number[] | `0` |
| preview-full-image | Full-screen preview on tap | boolean | `true` |
| image-fit | Preview crop mode | string | `'aspectFill'` |
| upload-text | Select area text | string | `''` |
| upload-icon | Select area icon name | string | `'plus'` |
| upload-url | Server URL (non-empty enables built-in upload) | string | `''` |
| upload-name | Upload field name | string | `'file'` |
| form-data | Extra form data | UTSJSONObject \| null | `null` |
| header | Request headers | UTSJSONObject \| null | `null` |
| before-choose | Hook before picking; call `next(true)` to continue | `(fileList, next) => void` | - |
| before-read | Validate before read; boolean or Promise&lt;boolean&gt; | Function | - |
| before-delete | Validate before delete; boolean or Promise&lt;boolean&gt; | Function | - |
| sortable | Enable long-press drag sorting | boolean | `false` |
| custom-class / custom-style | Root style passthrough | - | - |

### Events

| Name | Description | Payload |
| --- | --- | --- |
| update:value | List change (v-model:value) | value: UTSJSONObject[] |
| change | List change (add / remove / status) | value: UTSJSONObject[] |
| afterRead | Selection done (upload yourself without upload-url) | item, index |
| oversize | Files filtered by max-size | files: UTSJSONObject[] |
| clickUpload | Select area clicked | event: MouseEvent |
| clickPreview | Preview cell clicked (before full-screen preview) | index, item |
| itemClick | Item clicked (retry entry) | index, item |
| delete | Item deleted | index, item |
| progress | Built-in upload progress | index, progress, item |
| success | Built-in upload succeeded | index, item, response |
| error | Built-in upload failed | index, item, errMsg |
| sort | Drag sorting finished | fromIndex, toIndex, value |

### Slots

| Name | Description | Scope |
| --- | --- | --- |
| default | Custom select area content | - |
| preview-cover | Content above the preview image | item, index |
| preview-delete | Custom delete button | item, index |

### Methods

| Method | Description |
| --- | --- |
| choose() | Open the picker |
| clear() | Clear the list and abort running uploads |
| abort(index) | Abort the upload of an item |
| reupload(index) | Re-upload an item |
| setItemStatus(index, status, message, progress) | Write item status back |

## Theming

| Variable | Description | Default |
| --- | --- | --- |
| $m-uploader-size | Default cell size | 80px |
| $m-uploader-gap | Cell gap | 8px |
| $m-uploader-radius | Cell radius | theme medium radius |
| $m-uploader-select-background | Select area background | #f7f8fa |
| $m-uploader-select-active-opacity | Select area pressed opacity | 0.7 |
| $m-uploader-icon-size | Select area icon size | 24px |
| $m-uploader-icon-color | Select area icon color | #dcdee0 |
| $m-uploader-text-font-size | Select area text size | 12px |
| $m-uploader-text-color | Select area text color | tertiary text |
| $m-uploader-delete-size | Delete button diameter | 18px |
| $m-uploader-delete-icon-size | Delete icon size | 10px |
| $m-uploader-delete-background | Delete button background | rgba(0,0,0,.7) |
| $m-uploader-delete-color | Delete icon color | #ffffff |
| $m-uploader-mask-background | Status mask background | rgba(0,0,0,.6) |
| $m-uploader-mask-color | Progress text color | #ffffff |
| $m-uploader-mask-font-size | Progress / failed text size | 12px |
| $m-uploader-failed-color | Failed text color | theme danger |
| $m-uploader-video-background | Video placeholder background | #000000 |
| $m-uploader-cover-background | Preview cover background | rgba(0,0,0,.3) |
| $m-uploader-disabled-opacity | Disabled opacity | theme disabled opacity |

See [Theming](/en/guide/theming) for the full variable list and override guide.

## Differences from Vant / Sard

- **Binding**: unified `v-model:value`
- **Upload responsibility**: both modes — built-in `uni.uploadFile` when `upload-url` is set, otherwise only `after-read`
- **Status write-back**: use `setItemStatus` instead of mutating item fields (mutations do not re-render the parent in uni-app x)
- **Media types**: `media-type` supports `image` / `video` / array; no generic file type
- **Sorting**: built-in long-press drag sorting (business-side in Vant / Sard)
- **Preview**: images use `uni.previewImage`; video taps emit `item-click` for business playback

## Notes

- `value` elements are `UTSJSONObject`; custom fields are preserved but the component only reads / writes the standard fields above
- With `upload-url`, upload starts automatically after selection; `success` returns the server `data` string. To replace `url` with the server address, write the whole `value` back
- Built-in uploads are tracked by file `path`, so delete / sort still updates the right item
- `before-read` / `before-delete` may return a Promise; `false` drops the file / cancels deletion
- Drag sorting relies on touch events (App / mini programs / mobile browsers); mouse dragging on desktop is not supported
- `$m-uploader-size` controls the default cell size; when overriding it together with `sortable`, also pass `preview-size` to keep them in sync (drag geometry uses the 80px default)
- Readonly only hides the select area; preview and tapping still work. Use `disabled` to freeze everything
