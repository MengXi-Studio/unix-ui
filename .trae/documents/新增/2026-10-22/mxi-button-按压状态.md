# mxi-button 按压状态 实施方案

## 需求

为 mxi-button 补齐按压（active）反馈：按下时按钮出现视觉变化，松开后恢复；disabled / loading 状态不出现按压态。（已核实：组件当前完全无按压反馈——无伪类、无 touch 处理、无状态类）

## 需求分析

- 组件：`packages/core/components/mxi-button/mxi-button.uvue`（根节点 view 增加动态 `hover-class`）
- 主题变量：`packages/core/theme/vars.scss` 新增 `$mxi-button-active-opacity`（`!default`）
- 演示页：现有演示页已穷举 props，按压态为行为反馈不需新变体；验证时按压观察
- 文档：`packages/docs/src/components/button.md`（zh）与 `src/en/components/button.md`（en）补充按压反馈说明
- 影响面：无 breaking change，仅新增视觉反馈层

## 伪代码设计

- 根节点：`:hover-class="hoverClass"`；`hover-start-time` / `hover-stay-time` 用 view 默认值（50ms / 400ms），不暴露为 props（避免过度设计）
- `hoverClass` computed：
  - `disabled || loading` → `'none'`（uni-app x 约定 `"none"` 表示无点击态）
  - 其余 → `'mxi-button--active'`
- 样式：`.mxi-button--active { opacity: $mxi-button-active-opacity; }`
- vars.scss：`$mxi-button-active-opacity: 0.8 !default;`
- 覆盖面：opacity 方案对实色 / 朴素 / 渐变自定义色 / hairline 变体统一生效，无需分变体处理

## 疑问清单

（无未决疑问。已定设计决策：视觉形态取整按钮 opacity 降档——对齐 Vant 的透明度按压方案，且全变体统一生效；不新增 props；按压时长用 view 默认值；hover-class 为 view 官方属性，官方文档属性表兼容性列无平台限制）

## 实施记录

### 方案落地形态

与伪代码设计一致，无偏差：根节点 `:hover-class="hoverClass"`（按压时长用 view 默认 50ms / 400ms，未暴露 props）；`hoverClass` computed 在 disabled / loading 时返回 `'none'`，其余返回 `'mxi-button--active'`；样式 `.mxi-button--active { opacity: $mxi-button-active-opacity }`；vars.scss 新增 `$mxi-button-active-opacity: 0.8 !default`。

### 变更文件清单

- `packages/core/components/mxi-button/mxi-button.uvue`（hover-class 绑定 + hoverClass computed + --active 样式）
- `packages/core/theme/vars.scss`（新增 $mxi-button-active-opacity）
- `packages/playground/uni_modules/mxi-ui-x/`（sync 产物）+ `changelog.md`（登记「未发布」段）
- `packages/docs/src/components/button.md` 与 `src/en/components/button.md`（按压反馈示例 + 主题变量行）

### 验证方式与结果

- `pnpm sync:uni-modules:check` 一致性通过
- dev server（5174）HMR 加载组件变更，浏览器实测（http://localhost:5174/pages-sub/button/button）：
  - primary 按钮 mousedown → 50ms 后挂载 `mxi-button--active`，computed opacity = 0.8（默认主题变量值精确命中）
  - mouseup → 400ms stay-time 后按压类移除、opacity 恢复 1
  - disabled 按钮 hover-class 属性正确绑定为 `"none"`，按压无点击态
  - 控制台无错误（仅 uni-app x dev 模式 info 行）
- `pnpm build:docs` 通过（VitePress 死链检查无报错）
- 备注：浏览器截图能力暂不可用（标签页离屏被节流），按压态以类名与 computed opacity 数值证据验收；首次验证时曾因读取早于 hover-start-time(50ms) 误判未挂载，延时后复测通过

### 遗留 TODO

无
