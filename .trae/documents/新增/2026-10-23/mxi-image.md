# 新增组件：mxi-image 图片

> 状态：**已完成**（2026-10-23 疑问闭环 Q1=E / Q2=A / Q3=A / Q4=A / Q5=A / Q6=A / Q7=B，实现并验证通过；docs 双语同步持续暂缓待用户通知）
> 本轮范围：组件源 → 主题变量 → sync → 演示页 → 验证（沿用 mxi-cell 流程），docs 不在本轮。

## 需求

- 用户原话（2026-10-23 方向调整）：「这个暂时不考虑vant，先参考 `https://sard.wzt.zone/components/image#imageprops` 在结合 vant。我的需求是在原生元素的基础上扩展一下功能」。
- **mxi-image 定位由「Vant Image API 复刻」调整为「原生 image 组件的增强封装」**（Sard UI 同款定位：image 组件的加强版，继承原生全部能力，扩展淡入动画、加载中 / 加载失败提示、圆角值和形状等）。
- mode 等原生能力**直通透传**（不另造 fit 映射层）；扩展能力的占位观感与交互开关结合 Vant（图标占位 / show-loading / show-error / 插槽自定义）。
- 初稿「Vant fit 五值映射」方案作废，历史辨析保留在 Q1 供追溯；验证工程（playground）落演示页并按登记链路接入首页分组导航；docs 不在本轮。

## 需求分析

### Sard Image API 盘点（首要参考，官网文档已核对）

**定位**：「image 组件的加强版，在继承了原有功能外，还支持淡入动画、加载中、加载失败提示、圆角值和形状等」。

**ImageProps（12）**：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| src | string | - | 图片资源地址 |
| mode | 原生 13 值联合类型（scaleToFill / aspectFit / aspectFill / widthFix / heightFix / top / bottom / center / left / right / 四角） | **'aspectFill'** | 与原生 image mode 同名直通 |
| loading | 'eager' \| 'lazy' | 'eager' | 加载方式（HTML 语义包装） |
| fade | boolean | true | 加载完成淡入动画 |
| width / height | string | - | 尺寸 |
| shape | 'circle' \| 'square' | 'square' | 形状 |
| radius | string | - | 圆角 |
| show-loading / show-error | boolean | true | 占位开关 |
| background | string | - | 图片背景色 |
| custom-load | (callback) => any | - | 自定义加载方法（web 专用） |

**ImageSlots**：loading / error（**无 default 插槽**）
**ImageEmits**：click / load / error
**样式变量**：`--s-image-bg`（fill-color-tertiary）、默认尺寸 **320px × 240px**（与原生 image 默认一致）、loading / error 图标 size 与色（text-color-fourth）、`--s-image-duration` 动画时长

**演示区块**：基础使用 / 图片模式（mode 全值网格对照）/ 图片形状 / 懒加载 / 加载中提示 / 加载错误提示 / 淡入动画。

### Vant Image API 盘点（结合吸收占位观感与交互）

**Props（19）**：`src` / `fit(contain|cover|fill|none|scale-down，默认 fill)` / `position(默认 center，等同 object-position)` / `alt` / `width` / `height` / `radius` / `round` / `block` / `lazy-load` / `show-loading(默认 true)` / `show-error(默认 true)` / `loading-icon(默认 photo)` / `error-icon(默认 photo-fail)` / `icon-size(默认 32px)` / `icon-prefix` / `crossorigin` / `referrerpolicy` / `decoding`
**Events**：`click` / `load` / `error`
**Slots**：`default` / `loading` / `error`
**CSS 变量**：占位背景 `--van-image-placeholder-background`（#f7f8fa）、占位图标 32px、图标色 gray-4（#dcdee0）

### uni-app x 原生 image 能力（官方文档已核对）

- `mode` 14 合法值：scaleToFill（默认）/ aspectFit / aspectFill / widthFix / heightFix / 九宫格九向（top / bottom / center / left / right / 四角）。
- `lazy-load` 属性存在，但「只针对 page 与 scroll-view 下的 image 有效，安卓默认懒加载不支持修改」。
- `@load` 返回 `UniImageLoadEvent`（detail.width / detail.height 为 number）；`@error` 返回 `UniImageErrorEvent`（detail.errMsg）。
- **「不可以嵌套组件」**——image 不能有子组件，占位层必须做兄弟节点覆盖式结构。
- src 支持 /static、file://、http(s) 网络路径。
- 无 alt / crossorigin / referrerpolicy / decoding / object-fit / object-position 能力。

### uni-app x 场景映射（原生直通 + 扩展能力，逐条判定）

| 能力 | 来源 | 映射方案 | 判定 |
| --- | --- | --- | --- |
| mode 裁剪缩放模式 | 原生 | **直通**：prop 同名 `mode`，类型为原生 14 值联合类型（type ImageMode 内联 SFC），值不做任何映射 | 直通 |
| fit / position | Vant | 原生 mode 已覆盖全部缩放语义，不再造 fit 映射层；position（object-position）无原生对应 | 裁剪 |
| src / width / height | 原生+ | src 直通；width / height 支持 number \| string（number → 'Npx'），根节点 inline style | 实现 |
| radius | Sard+Vant | 根节点 border-radius + overflow hidden 裁剪 | 实现 |
| shape | Sard | 'circle' → border-radius 50%，'square' → 按 radius | 实现 → Q7 |
| round | Vant | 与 shape 语义重复（都是圆），二者取其一 | → Q7 |
| lazy-load | 原生 | 布尔属性直通透传（原生命名，page / scroll-view 下生效；Q2=A 已确认透传原生） | 直通 |
| loading('eager'\|'lazy') | Sard | HTML 语义包装，与原生 lazy-load 布尔同义换名 | 不采用（保持原生直通） |
| fade 淡入动画 | Sard | 加载完成后 UniElement.animate opacity 0→1（LESSONS #6：动画一律 animate API）；status!=='success' 时 image 节点 opacity 0 防首帧闪现 | 实现 |
| fade-show | 原生 | Android 专有属性，与自定义 fade 冲突 | 裁剪 |
| show-loading / loading-icon / loading 插槽 | Vant | 兄弟覆盖层（根 relative + mask absolute inset 0，原生 image 不可以嵌套组件）；图标 photo 默认，mxi-icon 渲染 | 实现 |
| show-error / error-icon / error 插槽 | Vant | 同上；图标 photo-fail 默认 | 实现 |
| icon-size | Vant | mxi-icon size prop（默认 '32'） | 实现 |
| background | Sard | 裁剪 prop——主题走 $mxi-image-background 变量，运行时覆盖走 customStyle（本库一贯出口） | 裁剪 |
| custom-load | Sard | web 端加载器钩子，uvue 场景无对应 | 裁剪 |
| click | 原生+ | 根节点 @click 透传（mxi-cell 同款） | 实现 |
| load / error | 原生 | @load / @error 原样透传（UniImageLoadEvent / UniImageErrorEvent） | 直通 |
| default 插槽 | Vant | 渲染为 image 之后兄弟节点（不能嵌套进 image） | 保留（Q5=A 已确认） |
| alt / crossorigin / referrerpolicy / decoding / block / icon-prefix | Vant | web 专有或 uvue 无对应（Q4=A 已确认裁剪） | 裁剪 |

### 组件间依赖

- mxi-image 内部渲染 `<mxi-icon>`（loading / error 占位图标），沿用 mxi-cell 先例（easycom 自动解析）；`IconName` 类型相对路径 `import { IconName } from '../mxi-icon/icons.uts'`。
- photo / photo-fail 均在 mxi-icon 257 图标集内（已 grep 确认）。

### 布局与关键结构（伪代码）

```
mxi-image 模板：
<view class="mxi-image" :class="imageClass" :style="rootStyle" @click="onClick">
  <image ref="imgRef" class="mxi-image__img"
         :src="src" :mode="mode" :lazy-load="lazyLoad"
         :style="imgStyle"
         @load="onLoad" @error="onError"/>
  <view class="mxi-image__mask" v-if="status == 'loading' && showLoading || status == 'error' && showError">
    <slot name="loading" v-if="status == 'loading'">
      <mxi-icon :name="loadingIcon" :size="iconSize" custom-class="mxi-image__icon-text"/>
    </slot>
    <slot name="error" v-else>
      <mxi-icon :name="errorIcon" :size="iconSize" custom-class="mxi-image__icon-text"/>
    </slot>
  </view>
  <slot></slot>                                          ← default 插槽（Q5=A 保留）
</view>

类型与状态机（组合式，逻辑内联 SFC）：
type ImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix'
               | 'top' | 'bottom' | 'center' | 'left' | 'right'
               | 'top left' | 'top right' | 'bottom left' | 'bottom right'
type ImageShape = 'circle' | 'square'

props: src / mode(ImageMode, 默认见 Q6) / lazyLoad(false) / fade(true) /
       width / height(number|string|null) / radius(number|string|null) /
       shape(ImageShape, 默认见 Q7) / showLoading(true) / showError(true) /
       loadingIcon(IconName='photo') / errorIcon(IconName='photo-fail') /
       iconSize('32') / customClass / customStyle

status: ref<'loading' | 'success' | 'error'>('loading')
@load  → status='success' + emit('load', event)；fade 时（watch flush post 取 imgRef）
         imgRef.animate([{opacity:0},{opacity:1}], {duration:300, easing:'ease-out'})
@error → status='error' + emit('error', event)
watch(() => props.src) → status 重置 'loading'（换图重进占位态）
imgStyle：status !== 'success' 时 { opacity: '0' }（防加载完成瞬间首帧闪现，
         success 后移除 + animate 起始帧 0 覆盖，帧内无闪烁窗口）
rootStyle：width / height（number→px）、radius、shape circle→50%

样式要点：
- 根：position relative + overflow hidden（圆角裁剪；uvue 默认 hidden 仍显式声明）
- image 层：width / height 100% 铺满根
- mask 层：absolute inset 0 + flex 居中 + $mxi-image-background 背景
- 占位图标色：custom-class 挂根样式表色类 .mxi-image__icon-text { color: $mxi-image-icon-color }
  （LESSONS #13：mxi-icon color prop 是运行时字符串，无法接 SCSS 变量）
```

### 主题变量草案（vars.scss 新增段，全部 !default）

```
/* ========== Image 图片 ========== */
$mxi-image-background: #f7f8fa !default;   /* 加载 / 失败占位背景（Vant 占位背景同值，Sard 为 fill-color-tertiary 同观感） */
$mxi-image-icon-color: #dcdee0 !default;   /* 占位图标色（对齐 Vant gray-4） */
```

（淡入时长为运行时 animate 参数，SCSS 变量无法进入，组件内常量 300ms 对齐 Sard --s-image-duration；mode / 尺寸 / 圆角均为 props 不设变量，故仅两枚。）

### 演示页区块规划（pages-sub/image/，对齐 Sard demo 结构）

1. 基础用法（width / height + 网络图与本地 /static 图）
2. 图片模式（mode 全值网格对照，Sard demo 同款两列布局）
3. 图片形状（shape circle / radius 圆角）
4. 懒加载（scroll-view 长列表图；web 端实际表现如实记录）
5. 加载中提示（自定义 loading-icon / show-loading=false / loading 插槽）
6. 加载失败提示（错误 src 演示 error-icon / show-error=false / error 插槽）
7. 淡入动画（fade true / false 对照）
8. 点击事件（console.log 输出）

登记四处：`demo-components.uts`（基础组件组）/ `router.config.uts`（name: image）/ `pages.json` / demo-navbar（图片 / Image）。

## 疑问清单

### Q1 fit=scale-down 处理（影响：fit 五值完整性）

- 方案 A（推荐）：scale-down 以 aspectFit 近似（两者均保持纵横比完整显示，仅「图小于容器时是否放大」有差异，文档标注近似语义）
- 方案 B：裁剪 scale-down，仅保留四值（fit 类型收窄为 'contain' | 'cover' | 'fill' | 'none'）
- 方案 C：fit 直接透传 CSS object-fit（仅 Web 生效，App 端原生渲染无效，破坏跨端，不建议）

回答：这里为啥不使用原生图片组件 image的mode属性值？

**技术辨析（2026-10-23，针对上述反问）**：

Q1 讨论的并非「用不用原生 mode」——组件内部实现正是把 fit 经 computed 映射到原生 image 的 mode 属性渲染（fill→scaleToFill / contain→aspectFit / cover→aspectFill / none→center）。真正的分歧点是：**对外 prop 暴露 Vant 的 fit 命名，还是原生的 mode 命名**。三层理由支撑对外用 fit：

1. **API 对标契约（本项目既定原则）**：已发布组件（button / icon / badge / loading / cell）的 props 命名与语义全部对齐 Vant，Vant Image 对外就是 fit（五值），使用者对照 Vant 文档迁移零心智成本；对外叫 mode 则是 unix-ui 特有 API，违背「功能与体验对齐 Vant」的组件库定位。
2. **fit 与 mode 不是二选一，而是「fit 对外、mode 对内」**：fit 四值与 mode 缩放类值一一对应（见上方映射表），映射 computed 就是实现本体；mode 只是实现细节不外露——与 mxi-cell 用 view + mxi-icon 组合而非裸露原生结构同理。
3. **mode 全量暴露的额外代价**：原生 mode 14 值中，九宫格九向（不缩放裁剪某区域）与 widthFix / heightFix（宽或高固定、另一向自适应）是 Vant Image 没有的能力域：
   - 九宫格值与 Vant position（cover 下的 object-position）语义不同，混入 fit 会造成裁剪语义混淆（Q4=A 已裁剪 position）；
   - widthFix / heightFix 与本组件 width / height props 及根尺寸策略（Q5=A 默认 100% × 240px）冲突——mode=widthFix 时 image 高度自适应，但根节点仍定高，需使用者额外接管根尺寸，且不在 Vant Image 能力范围；
   - 暴露即需全端验证 14 值矩阵（演示页 / 文档 / App 真机），成本翻倍。
   确需九宫格裁剪或 widthFix 的场景直接用原生 image 即可，mxi-image 的定位是「Vant Image 体验对齐」，不是原生 image 全能力封装。
4. **scale-down 为何单列**：scale-down = min(none, contain)（图大按 contain 缩、图小保持原尺寸不放大），原生 mode 无对应值——这也侧面说明 fit 与 mode 不是同一套词汇、不能直接透传，因此才有近似映射 / 裁剪的方案选择。

### Q1 最终方案选择

- 方案 A（原推荐）：对外 fit（Vant 对齐、内部映射 mode），scale-down 以 aspectFit 近似并文档标注
- 方案 B：对外 fit，裁剪 scale-down（fit 类型收窄为 'contain' | 'cover' | 'fill' | 'none'，其余同 A）
- 方案 E（2026-10-23 用户指令定案）：**暂不考虑 Vant 优先，参考 Sard UI 结合 Vant，定位「原生元素基础上的功能扩展」——对外 mode 直通原生 14 值，fit / position 整体裁剪，不造映射层**

回答：**方案 E**（用户指令原文：「这个暂时不考虑vant，先参考 https://sard.wzt.zone/components/image#imageprops 在结合 vant。我的需求是在原生元素的基础上扩展一下功能」）。本节上方 fit 映射辨析作为历史决策保留追溯；「需求分析」「伪代码」「主题变量」「演示页」各节已按方案 E 重写。

### Q2 lazy-load 策略（影响：懒加载行为与实现复杂度）

- 方案 A（推荐）：透传原生 `lazy-load` 属性（官方能力，限 page / scroll-view 下生效；安卓默认懒加载不可改；文档标注平台限制）
- 方案 B：基于 uni.createIntersectionObserver 自实现跨端懒加载（复杂度高、App 端兼容风险、超出 Vant 对标范围）

回答：A。

### Q3 loading 占位形态（影响：加载观感与组件依赖）

- 方案 A（推荐）：对齐 Vant——静态 photo / photo-fail 图标 + #f7f8fa 占位背景（showLoading / showError / loading-icon / error-icon / icon-size 全保留，loading / error 插槽自定义）
- 方案 B：loading 占位复用 mxi-loading 转圈（观感偏离 Vant，且引入组件间动态依赖；error 仍需图标）

回答：A。

### Q4 平台专有 props 裁剪（影响：props 清单）

- 方案 A（推荐）：全部裁剪 position / alt / crossorigin / referrerpolicy / decoding / block / icon-prefix（uvue 无对应能力或语义扭曲；样式定制出口统一 customClass + customStyle）
- 方案 B：position 映射 mode 九宫格值（「不缩放裁剪」与 object-position 语义不同，易误导使用者）

回答：A。

### Q5 默认尺寸与 default 插槽（影响：零配置观感与插槽清单）

背景：uni-app x image 无 CSS 尺寸时原生默认 320×240；Vant 靠 img 天然流式布局达成自适应，uvue 结构下根节点（flex view）默认撑满父容器宽、高度取决于内部 image 默认值，占位背景才不至于塌陷。

- 方案 A（推荐）：未传 width / height 时根节点默认 `width: 100%` + `height: 240px`（对齐原生 image 默认高，零配置占位可见、不塌陷）；default 插槽保留（渲染为 image 之后兄弟节点，由使用者自行定位样式）
- 方案 B：不设默认尺寸（根节点高度随 image 原生默认 320×240，宽高行为不可预期），default 插槽裁剪（loading / error 两插槽足够覆盖自定义场景）

回答：A。

### Q6 mode 默认值（影响：零配置观感）（新增，2026-10-23 方向调整后）

背景：原生 image 默认 scaleToFill（拉伸填满，图与容器比例不一致时变形）；Sard「加强版」把默认改为 aspectFill（裁剪填满、比例不变形，业务观感更优）；Vant fit 默认 fill（同原生拉伸语义）。

- 方案 A（推荐）：默认 aspectFill（对齐 Sard——增强组件的默认应优于原生，拉伸变形在真实业务中几乎不可用；需要原生行为时显式传 'scaleToFill'）
- 方案 B：默认 scaleToFill（与原生 image 默认完全一致，「扩展而非修改」语义更纯粹）

回答：A。

### Q7 圆形语义 API 取舍（影响：props 命名）（新增，2026-10-23 方向调整后）

背景：Sard 用 shape('circle' | 'square')，Vant 用 round(boolean)，二者都是「圆」语义，取其一避免双 API 并存。

- 方案 A（推荐）：采用 Sard shape（首要参考方；枚举可扩展，'square' 显式默认、与 radius 配合语义清晰；round 不做）
- 方案 B：采用 Vant round 布尔（与已发布组件的布尔 prop 风格一致；shape 不做）

回答：B。

## 实施记录

### 落码清单（2026-10-23）

| 文件 | 变更 |
| --- | --- |
| `core/components/mxi-image/mxi-image.uvue` | 新建：原生 image 增强封装——mode 直通（ImageMode 14 值内联联合类型）、lazyLoad 透传、fade 淡入、width / height（number \| string \| null，number 自动补 px）、radius / round、showLoading / showError 占位开关（兄弟覆盖层 + mxi-icon photo / photo-fail 默认图标）、loading / error 插槽、default 插槽、click / load / error 透传 |
| `core/theme/vars.scss` | 新增 Image 变量段（2 枚，全部 !default）：$mxi-image-background #f7f8fa、$mxi-image-icon-color #dcdee0 |
| `playground/pages-sub/image/image.uvue` | 新建：演示页八区块（基础用法 / mode 全值网格 / 圆角圆形 / 懒加载 / 加载中提示 / 加载失败提示 / 淡入动画 / 点击事件），加载中与淡入区块配「重新加载」破缓存按钮观察占位与过渡 |
| `playground/pages.json` | 注册 `image/image` 页（标题「图片 Image」） |
| `playground/router/router.config.uts` | 新增 image 路由（name: image） |
| `playground/pages/index/demo-components.uts` | 基础组件组 icon 之后登记「图片 / Image」条目 |

### 关键实现决策

- **Q1=E 落地**：对外 `mode` prop 与原生 image 同名直通（type ImageMode 14 值内联 SFC），fit / position 不存在、无映射层；演示页 mode 全值网格对照（widthFix / heightFix 定高容器表现标注以平台为准）。
- **Q6=A 落地**：mode 默认 `aspectFill`（对齐 Sard，裁剪填满不变形）；需要原生行为显式传 'scaleToFill'。
- **Q7=B 落地**：圆形语义采用 Vant `round` 布尔（border-radius 50%，优先于 radius），shape 枚举不做。
- **fade 淡入实施优化**：文档伪代码原计划 `UniElement.animate`，实施改用 **ucss transition**（`.mxi-image__img--fade`：opacity 300ms ease-out）——状态驱动 inline style（status != 'success' 时 `opacity: 0`，成功后移除触发过渡），比 animate 关键帧少两类风险（App 端 UniAnimationKeyframe 的 opacity 字段兼容性、加载完成瞬间到动画启动之间的首帧闪烁窗口），且 ucss transition 原生支持、跨端一致（经验沉淀 LESSONS #16）。
- **占位覆盖层结构**：根节点 relative + mask absolute 四边归零（原生 image「不可以嵌套组件」），mask 背景 $mxi-image-background、flex 居中；占位图标色经 custom-class 挂 `.mxi-image__icon-text` 色类（LESSONS #13）；mask v-if 条件 `(status == 'loading' && showLoading) || (status == 'error' && showError)`。
- **默认尺寸（Q5=A）**：根 class 默认 `width: 100%; height: 240px`，width / height props 传值时以 inline style 覆盖。
- **事件透传**：click（根节点 MouseEvent）/ load（UniImageLoadEvent 原样）/ error（UniImageErrorEvent 原样）；watch(src) 重置 loading 支持换图重进占位态（演示页破缓存按钮依赖此机制）。
- **组件间依赖**：mxi-image 模板内渲染 mxi-icon（loading / error 占位图标），`IconName` 相对路径导入；photo / photo-fail 均在图标集内。

### 验证记录（DoD）

- [x] `pnpm sync:uni-modules` 同步 + `pnpm sync:uni-modules:check` 一致性通过
- [x] HBuilderX CLI `cli launch web` 编译成功（dev server 端口 5174，pages.json 变更已 kill 旧进程重启编译）
- [x] 浏览器实测（Chrome）六项全 PASS：基础渲染（基础用法 3 图 / mode 网格 14 图 / 圆角 3 图 / 懒加载 10 图）、console 无 JS 运行时错误（404 仅预期 nonexistent.jpg）、`.mxi-image` 节点 41 个与预期一致、「重新加载」破缓存后观察到灰色占位态（3 个含图标/文字 + 1 个 show-loading=false 纯空白）随后图片恢复、真实点击图片 console 输出 `[image demo] image clicked`、首页基础组件组出现「图片 / Image」条目且搜索 image 过滤生效
- [x] `pnpm build:docs` 免跑：本轮 docs 零变更（双语文档按用户要求暂缓）
- [x] 无遗留调试代码（演示页 console.log 为点击演示功能本身，保留）

### 遗留

- App 端真机验证（全局既有遗留项，本轮新增关注点：ucss transition 的 opacity 淡入在 App 端表现、lazy-load 安卓默认懒加载行为、widthFix / heightFix 在定高容器下的平台表现）。
- packages/docs 双语文档与侧栏：待用户通知后同步（本轮范围明确排除）。
- 新增组件登记链路四处齐备（demo-components.uts / router.config.uts / pages.json / 演示页 demo-navbar props）。
