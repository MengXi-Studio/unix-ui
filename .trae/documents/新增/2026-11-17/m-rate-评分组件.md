# m-rate 评分组件 实施方案

## 需求

对标两家实现，为 unix-ui 新增评分组件 `m-rate`：

- **Vant Rate**：`v-model` 分值、`count` 图标总数、`size` / `gutter`、`color` / `void-color` / `disabled-color`、`icon` / `void-icon`、`allow-half` 半星、`clearable` 再次点击清零、`readonly`、`disabled`、`touchable` 滑动评分、`change(value)` 事件；只读 + 半星可展示任意小数（如 3.3）
- **Sard Rate**：`allow-half`、`clearable`（点击同值或滑到最左归零）、`size` / `gap`、`text` / `void-text` 文字评分、`color` / `void-color`、`readonly` / `disabled`、`star` / `void-star` 图标插槽、`update:modelValue` + `change`

## 需求分析

### 与两个参考的取舍（待疑问清单确认）

| 维度 | Vant | Sard | 本项目建议 | 理由 |
| --- | --- | --- | --- | --- |
| 组件形态 | Rate 单体 | Rate 单体 | **单体 `m-rate`** | 评分无「弹层选择 / 表单触发器」场景，不做 popup / input 系列 |
| 值模型 | `v-model` number | `model-value` number | **`v-model:value` number，`0` = 未评分** | 项目全系 `v-model:value`；评分天然有「0 分」语义，不引入 null |
| 间距命名 | `gutter` | `gap` | **`gap`** | 项目内 `flex` / `space` / `password-input` 均用 `gap`，统一优先 |
| 半星 | 支持 | 支持 | **支持（`allow-half`）** | 两家一致的核心能力 |
| 只读小数 | 支持（3.3） | 不支持 | **支持** | 展示评分均值（4.3 分）是真实诉求 |
| 滑动评分 | `touchable`（默认 true） | 无 | **支持（默认 true）** | 移动端评分的主要交互方式 |
| 自定义图标 | `icon` / `void-icon` 名称 | `star` / `void-star` 插槽 | **`icon` / `void-icon` 接 IconName + 同名两插槽** | 字体图标零成本；插槽兜底图片等自定义内容 |
| 文字评分 | 无 | `text` / `void-text` | **不做** | 插槽已可覆盖；文字评分属 Sard 私有扩展 |
| 禁用色 | `disabled-color` | 无 | **`disabled-color`** | 显式配色优于透明度叠加（见 m-radio 禁用态教训） |
| 可清空 | `clearable` | `clearable` | **`clearable`** | 点击同值归零；联动滑动时滑到最左侧也归零（自然结果） |

### 可复用资产（结构性复用，代码独立实现）

- `m-icon`：`star` / `star-o` 两个字形已在 `icons.uts` 中（'star' `\ue727`、'star-o' `\ue722`），`IconName` 类型跨组件导入为先例（m-cell / m-fab / m-cascader / m-radio-popup 均如此）
- 矩形测量：沿用 `m-color-picker` 的 `measureNode` 三端分支（WEB `getBoundingClientRect` / MP `createSelectorQuery` / APP `getBoundingClientRectAsync`）
- 触摸换算：沿用 `m-color-picker` 的 `clampNumber` + `clientX - rect.left` 归一化思路
- 派发去重：沿用 `m-color-picker` 的 `lastEmitted` 防回灌抖动
- 主题变量体系：新增 `$m-rate-*` 段，全部 `!default`

### 能力缺口 / 技术风险

- **无「半星」字形**：图标库只有 `star` / `star-o`，半星需**裁切方案**——实心星放在宽度 50%（或小数比例）的裁切层内，底层铺未选星。风险：App 端 text 字形在 `overflow: hidden` 容器内的裁切表现需实机确认（Web 已有多处 overflow 先例，m-color-picker 绝对定位层亦为同类结构）
- **滑动评分需要容器宽度**：多实例同页时不能用静态 id，改为 `createSelectorQuery().in(proxy).select('.m-rate')` 作用域内按类名测量
- 无公共工具函数需新增到 `utils/`，逻辑全部在组件内

### 影响面

| 产物 | 落点 |
| --- | --- |
| 组件源 | `packages/core/components/m-rate/m-rate.uvue`（单文件，类型内联） |
| 主题变量 | `packages/core/theme/vars.scss` 新增 `$m-rate-*` 段（约 8 项） |
| 同步 | `pnpm sync:uni-modules` → `playground/uni_modules/m-ui-x/components/m-rate/` |
| 演示页 | `packages/playground/pages-sub/rate/rate.uvue`（一页穷举全部变体）+ `demo-components.uts` 数据录入组登记 |
| 文档 | `docs/src/components/rate.md` + `docs/src/en/components/rate.md` + zh/en 侧栏 |
| 版本日志 | `playground/uni_modules/m-ui-x/changelog.md` + `docs/src/changelog.md` + `docs/src/en/changelog.md` |
| 既有组件 | 不触碰 |

- **登记位置**：数据录入组末尾（现有末项 `radio-popup`，`radio` < `rate` < `radio`? 实际比较：`radio` / `rate` → 第 3 字符 `d` < `t`，故 `rate` 排在全部 radio 之后），三处（`demo-components.uts` / `zh.ts` / `en.ts`）同序

## 伪代码设计

### 模板结构（半星裁切）

```html
<view :class="rootClass" :style="rootStyle"
      @touchstart="onTouchStart" @touchmove="onTouchMove" @click="onClick">
  <!-- 每颗星：底层未选字形 + 裁切层内的选中字形 -->
  <view v-for="(item, index) in items" :key="index"
        class="m-rate__item" :style="itemStyle">
    <slot name="void-icon" :index="index" :active="false">
      <m-icon :name="voidIcon" :size="sizeText" :color="voidColorValue" />
    </slot>
    <!-- 裁切层：宽度按 fillPercent 百分比，overflow 隐藏 -->
    <view class="m-rate__fill" :style="fillStyleOf(index)">
      <slot name="icon" :index="index" :active="true">
        <m-icon :name="activeIcon" :size="sizeText" :color="activeColorValue" custom-class="m-rate__star" />
      </slot>
    </view>
  </view>
</view>
```

关键约束：

- 裁切层 `position: absolute; left: 0; top: 0; bottom: 0; overflow: hidden`，宽度 `width: <percent>%`；内部图标固定 `width: <size>` + `flex-shrink: 0`，避免被窄容器压缩变形
- 未选层与选中层同尺寸、同字号，只差字形与颜色
- 不使用 `@keyframes` / 伪元素；不引入 rpx

### 填充比例计算

```uts
/** 单颗星填充百分比：0 / 50 / 100，只读+半星时为任意小数比例 */
function fillPercentOf(index: number): number {
	const i = index + 1
	if (!props.allowHalf) return props.value >= i ? 100 : 0
	if (isReadonlyLike()) {
		const ratio = clampNumber(props.value - index, 0, 1)
		return ratio * 100
	}
	if (props.value >= i) return 100
	if (props.value >= i - 0.5) return 50
	return 0
}
```

- `isReadonlyLike()` = `props.readonly`（仅只读展示任意小数；`disabled` 按 0.5 网格展示，与 Vant 一致）

### 交互换算（触摸 / 点击共用）

```uts
/** 由容器内横向坐标换算分值；allowHalf 时吸附到 0.5 网格 */
function valueFromX(x: number): number {
	const step = sizeNumber + gapNumber
	if (step <= 0) return props.value
	const index = Math.floor(x / step)
	if (index < 0) return 0
	if (index >= props.count) return props.count
	const inItem = clampNumber((x - index * step) / sizeNumber, 0, 1)
	if (!props.allowHalf) return index + 1
	return inItem <= 0.5 ? index + 0.5 : index + 1
}

/** 应用分值：禁用 / 只读直接返回；与上次派发相同则跳过；clearable 时同值归零 */
function applyValue(next: number) {
	if (disabled || readonly) return
	let v = next
	if (props.clearable && v == props.value) v = 0
	if (v == lastEmitted) return
	lastEmitted = v
	emit('update:value', v)
	emit('change', v)
}
```

- `@touchstart` 兼做点选（移动端），`@click` 仅 `#ifdef WEB` 生效（桌面无触摸事件）；两端换算同值不会产生偏差
- 容器矩形首次交互时若未测量则先测量再处理（同 m-color-picker 的 null 兜底）

### API

#### Props

| Props | 类型 | 默认 | 说明 | 来源 |
| --- | --- | --- | --- | --- |
| `value` | `number` | `0` | 当前分值（v-model:value），0 = 未评分 | 两家 |
| `count` | `number` | `5` | 图标总数 | 两家 |
| `size` | `string \| number` | `20px` 主题值 | 图标尺寸（number 补 px） | 两家 |
| `gap` | `string \| number` | `4px` 主题值 | 图标间距（number 补 px） | Sard / 项目惯例 |
| `color` | `string` | `''` | 选中色（空用主题默认） | 两家 |
| `voidColor` | `string` | `''` | 未选中色 | 两家 |
| `disabledColor` | `string` | `''` | 禁用色（选中与未选同时生效） | Vant |
| `icon` | `IconName` | `'star'` | 选中字形 | Vant |
| `voidIcon` | `IconName` | `'star-o'` | 未选中字形 | Vant |
| `allowHalf` | `boolean` | `false` | 允许半星 | 两家 |
| `clearable` | `boolean` | `false` | 再次点击同值清零 | 两家 |
| `readonly` | `boolean` | `false` | 只读（视觉正常，不可交互） | 两家 |
| `disabled` | `boolean` | `false` | 禁用（灰显 + 不可交互） | 两家 |
| `touchable` | `boolean` | `true` | 允许滑动评分 | Vant |
| `customClass` | `string.ClassString` | `''` | 根节点自定义类名 | 项目惯例 |
| `customStyle` | `string` | `''` | 根节点内联样式 | 项目惯例 |

#### Events

| 事件 | 参数 | 说明 |
| --- | --- | --- |
| `update:value` | `[value: number]` | 分值变化（v-model:value） |
| `change` | `[value: number]` | 分值变化 |
| `click` | `[event: MouseEvent]` | 点击（含禁用 / 只读被拒绝时） |

#### Slots

| 插槽 | 作用域 | 说明 |
| --- | --- | --- |
| `icon` | `{ index, active }` | 选中态图标内容（置于半星裁切层内，需自行贴合 `size`） |
| `void-icon` | `{ index, active }` | 未选中态图标内容 |

### 主题变量（`$m-rate-*`）

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `$m-rate-icon-size` | `20px` | 图标默认尺寸 |
| `$m-rate-gap` | `4px` | 图标默认间距 |
| `$m-rate-icon-color` | `$m-color-danger` | 选中色（Vant 同为 #ee0a24） |
| `$m-rate-icon-void-color` | `$m-text-color-fourth` | 未选中色 |
| `$m-rate-icon-disabled-color` | `$m-text-color-fourth` | 禁用色 |
| `$m-rate-star-line-height` | `1` | 字形行高（避免裁切层垂直偏移） |

### 约束与边界

| 约束 | 说明 |
| --- | --- |
| **UI 用值统一 number** | 不做 string 分值；外部传入超界值（> count）时仅视觉截断，不回写 |
| **size / gap 像素语义** | number 补 px；string 支持 px 值（滑动换算需数值，非 px 单位时滑动退化为点击选择） |
| **不引入任何动画** | 评分状态切换无过渡需求，规避 ucss 动画限制 |
| **扁平类** | `m-rate` / `m-rate__item` / `m-rate__fill` / `m-rate__star` / `m-rate--disabled` 全部扁平，无层级嵌套 |
| **无 hairline** | 纯字形渲染，不涉及 0.5px 边框 |
| **字体依赖** | 半星验证必须在字形已加载状态下验收（LESSONS：依赖字体的视觉须在字形可见态验收） |

### 验证矩阵

| 场景 | 操作 | 预期 |
| --- | --- | --- |
| 基础 | 点击第 3 颗星 | 前 3 颗实心，value = 3，change 回传 3 |
| 半星 | allow-half 点击第 2 颗左半 / 右半 | 分别为 1.5 / 2，第 2 颗半填充 |
| 半星只读小数 | readonly + allow-half + value=3.3 | 第 4 颗填充 30%，不派发事件 |
| 自定义图标 | icon="like" void-icon="like-o" | 心形实心 / 空心图标 |
| 图标插槽 | 传入自定义内容 | 替换内置字形，裁切层对半星仍生效 |
| 颜色 / 尺寸 / 间距 | color / void-color / disabled-color / size / gap | 视觉同步生效，item 步进正确 |
| 自定义数量 | count=6 | 渲染 6 颗，点击上限为 6 |
| 可清空 | 再次点击当前分值 | value 归 0，change 回传 0 |
| 只读 | readonly 点击 | 值不变，click 派发 |
| 禁用 | disabled 点击 | 全部灰显，值不变 |
| 滑动 | touchable 按住横向拖动 | 分值随手指连续变化，松手保持 |
| 关闭滑动 | touchable=false 拖动 | 仅点击选择，拖动无响应 |
| 超界值 | value=9 且 count=5 | 5 颗全实心，不回写外部值 |

## 疑问清单

> 每条已给推荐答案，在「回答：」处作答；回复「按推荐执行」即全部按推荐定案。

### Q1 组件形态：只做单体 `m-rate`？（影响：目录与交付量）

**推荐：只做单体**。理由：评分是即点即得的原子交互，不存在「弹层选择」或「只读触发器」场景；Vant / Sard 均只有单体。若后续出现表单场景，可再按 popup / input 惯例扩展。

回答：只做单体。

### Q2 值模型与命名：`v-model:value` + `0` 表未评分？（影响：全部 API 与清空语义）

**推荐：`value: number`，默认 `0`，`v-model:value`**。理由：项目全系使用 `v-model:value`；评分有天然「0 = 未评」语义，引入 null 只增加可空分支；`clearable` 归零与外部 `0` 语义一致。

回答：`value: number`，默认 `0`，`v-model:value`。

### Q3 间距 prop 命名：`gap` 还是 `gutter`？（影响：API 命名）

**推荐：`gap`**。理由：Vant 叫 `gutter`，但项目内 `flex` / `space` / `password-input` 已统一用 `gap` 表达「元素间距」，跨组件命名一致性优先；文档中注明等价 Vant 的 `gutter`。

回答：`gap`。

### Q4 半星实现方案：裁切层？（影响：跨端视觉风险）

**推荐：底层未选字形 + 宽度百分比裁切层内放选中字形**。理由：图标库无半星字形；裁切层用 `overflow: hidden` + 绝对定位，与 m-color-picker 的层叠结构同源；只读态可按任意小数比例裁切（4.3 分）。App 端字形裁切需实机验收（Web 必验，App 列入遗留 TODO）。

回答：`裁切层`

### Q5 是否实现 `touchable` 滑动评分？（影响：交互复杂度与测量逻辑）

**推荐：实现，默认 `true`**。理由：Vant 默认开启，移动端评分几乎都靠滑动；换算只需容器矩形 + `clientX`，m-color-picker 已有三端测量先例。

回答：实现，默认 `true`。

### Q6 只读 + 半星是否展示任意小数？（影响：填充比例算法）

**推荐：支持**。理由：商品评分常见 4.3 分展示；Vant 同款能力；实现上只读态用小数比例裁切，非只读态仍吸附 0.5 网格。

回答：支持。

### Q7 自定义图标出口：`icon` / `void-icon` 名称 + 同名插槽？（影响：API 与渲染层级）

**推荐：两者都提供**。理由：`IconName` 覆盖库内 257 个字形（含 `star` / `star-o`），零成本；插槽兜底图片 / 自绘图标场景，插槽内容放进裁切层内以保证半星仍有效。

回答：两者都提供。

### Q8 是否吸收 Sard 的 `text` / `void-text` 文字评分？（影响：API 范围）

**推荐：不做**。理由：`icon` / `void-icon` 插槽已可放任意文字节点，无需额外 prop；Sard 该能力属私有扩展。

回答：不做。

### Q9 禁用配色：`disabled-color` prop（影响：视觉与主题变量）

**推荐：提供 `disabled-color`**，选中与未选字形同时改用该色（默认 `$m-rate-icon-disabled-color`）。理由：显式换色比透明度叠加更可靠（m-radio 禁用态透明方案已被判定不可见）。

回答：提供 `disabled-color`。

### Q10 版本归属：追加到 0.7.0 还是新开 0.8.0？（影响：changelog 与文档 frontmatter `added`）

**推荐：追加 `0.7.0`**。理由：0.7.0 为当前开发版本（changelog 头部即 0.7.0，radio / password-input 均在本版），四个 package.json 的 version 由你统一手动 bump。

回答：追加 `0.7.0`。

## 实施记录（2026-11-17）

Q1-Q10 全部按推荐执行（单体 / `v-model:value` + 0 未评分 / `gap` / 裁切层半星 / `touchable` / 只读小数 / 名称 + 插槽 / 不做文字评分 / `disabled-color` / 追加 0.7.0）。产出：

- 组件源：`packages/core/components/m-rate/m-rate.uvue`（单文件，类型内联；`icon` / `voidIcon` 走 `IconName`）
- 主题变量：`$m-rate-*` 5 项（vars.scss 末尾追加，全 `!default`）
- 演示页：`packages/playground/pages-sub/rate/rate.uvue`（10 卡片）+ `demo-components.uts` 数据录入组末尾登记（`radio-*` < `rate` 字母序）
- 文档：zh / en 各 1 份 + 侧栏两侧同序 + 三处 changelog 0.7.0

**实现细节（与伪代码的差异）**

- 半星裁切层：`.m-rate__fill` 绝对定位 + `overflow: hidden`，宽度由 `fillPercentOf` 输出百分比；实心字形靠 flex 的 min-content 不压缩特性保持原尺寸，未额外写死宽度
- 尺寸 / 间距：未传时走主题类（`.m-rate__item` 的 `font-size` / `--gap` 的 margin），传值时内联直达；滑动换算用 `unitToNumber` 解析 px，识别失败回落 `DEFAULT_ICON_SIZE` / `DEFAULT_GAP`
- 触摸：`touchstart` 兼做点选，`touchmove` 受 `touchable` 控制；Web 桌面端 `click` 用 `MouseEvent.clientX` 走同一套换算，两端同值由 `lastEmitted` + `next == props.value` 双重去重
- MP 端：`icon` / `void-icon` 插槽在 `v-for` 内不声明（沿用 #17 结论），条件编译回退内置字形
- 测量：`.m-rate` 类名在组件作用域内查询，规避多实例同页的静态 id 冲突

**DoD 验证结果：**

- [x] 编译通过：既有 vite dev server（5174）热更新加载新组件与新页面，`/pages-sub/rate/rate` 返回 200
- [x] 页面实测：10 张卡片全部渲染；点击第 4 颗星 → `当前：4`；半星点击左半 → 3.5 且第 4 颗填充 50%（10px / 20px）；只读小数 3.3 → 第 4 颗填充 6px（30%）；`clearable` 再点当前值 → 0；只读 / 禁用点击不改变分值
- [x] 运行日志：`rate 基础 change: 4`、`rate 半星 change: 3.5`、`rate 可清空 change: 0` 回传值正确
- [x] 无运行时错误：控制台仅 vite 连接与业务 log，无 error / warning
- [x] `pnpm sync:uni-modules:check` 一致性通过
- [x] `pnpm build:docs` 构建与死链检查通过

**遗留 TODO**

- App 端半星字形在 `overflow: hidden` 裁切层内的表现需真机验收（Web 已验证；若 App 出现字形溢出 / 压缩，备选方案为裁切层内固定 `width: <size>` 或改用双层 mask）
- MP 端插槽回退与类名测量未在本轮实测（项目验证以 Web 为准，结论沿用 #17 既有经验）

**经验**：本轮一次编译通过，无新增 LESSONS（评分组件不涉及动画 / hairline / 语法糖边界）。

