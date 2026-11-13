---
title: CheckboxPopup
subtitle: 复选弹出框
demo: pages-sub/checkbox-popup/checkbox-popup
added: 0.5.0
---

## 介绍

`m-checkbox-popup` 复选弹出框：m-popup（底部弹层）+ m-checkbox-group 组合，选项由 options 数组驱动渲染（不要求写子组件模板），头部标题 + 关闭图标，选中集合 `v-model:value` 受控。基于 m-popup 组合，弹层 props 全透传（对齐 m-cascader-popup 先例）。

```vue
<m-checkbox-popup
	v-model:show="show"
	v-model:value="list"
	:options="options"
	title="选择标签"
/>
```

## API

### CheckboxPopupProps

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| show | 是否显示弹层（v-model:show） | boolean | `false` |
| value | 选中项标识集合（v-model:value） | CheckboxValueArray | `[]` |
| options | 选项数组（label / value / disabled 字段） | UTSJSONObject[] | `null` |
| title | 弹层标题 | string | `''` |
| show-header | 是否显示头部（标题 + 关闭图标） | boolean | `true` |
| closeable | 是否显示关闭图标 | boolean | `true` |
| close-icon | 关闭图标名 | IconName | `cross` |
| disabled | 是否禁用全部选项 | boolean | `false` |
| max | 最大可选数（0 不限制） | number | `0` |
| direction | 排列方向：`vertical` / `horizontal` | CheckboxDirection | `vertical` |
| shape | 形状：`round` / `square` | CheckboxShape | `round` |
| icon-size | 图标尺寸（number 补 px / string 原样） | string \| number | `''` |
| checked-color | 选中态颜色 | string | `''` |
| label-position | 文本位置：`right` / `left` | CheckboxLabelPosition | `right` |
| field-names | 选项字段名映射（默认 label / value / disabled） | CheckboxFieldNames | `null` |
| options-height | 选项区高度 px（0 用主题变量） | number | `0` |
| position | 弹出方位（透传 m-popup） | 'top' \| 'bottom' \| 'left' \| 'right' \| 'center' | `bottom` |
| round | 弹层圆角（透传 m-popup） | boolean | `true` |
| close-on-click-overlay | 点击遮罩关闭（透传 m-popup） | boolean | `true` |
| safe-area-inset-bottom | 底部安全区适配（透传 m-popup） | boolean | `true` |
| z-index | 层级（透传 m-popup） | number | `99` |
| duration | 动画时长秒（透传 m-popup） | number | `0.3` |
| custom-class / custom-style | 根节点样式直达 | - | - |

### CheckboxPopupEvents

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| update:show | 弹层显隐变化（遮罩与关闭图标均经此派发） | value: boolean |
| update:value | 选中集合变化（v-model:value） | value: CheckboxValueArray |
| change | 选中集合变化 | value: CheckboxValueArray |
| click-item | 点击选项（含禁用态） | index: number |
| close | 关闭（关闭图标或遮罩触发） | - |

### CheckboxPopupSlots

| 名称 | 说明 |
| --- | --- |
| footer | 弹层底部区域（如确定按钮） |

## 注意事项

- options 中 value 为 null 的项不渲染（无法参与勾选）
- value 为 number 类型时与 string 的 `'1'` 视为同一项（字符串化比较，与 [Checkbox](/components/checkbox) 一致）
- 勾选集合变化实时回写（无确定按钮语义，如需「确定才生效」请自行用 footer 插槽 + 本地副本）
