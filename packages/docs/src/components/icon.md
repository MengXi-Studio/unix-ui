---
title: Icon
subtitle: 图标
demo: pages-sub/icon/icon
---

## 介绍

基于字体图标的图标集，内置 257 个图标，支持颜色与大小自定义、点击事件。

## 代码演示

### 基础用法 {#demo-basic}

`name` 为字符串联合类型 `IconName`（IDE 自动提示全部图标名，写错编译期报错）。字体文件随包内置（`@font-face` 声明式加载），零配置、离线可用。

```vue
<mxi-icon name="chat-o" />
```

### 自定义颜色 {#demo-color}

通过 `color` 属性自定义图标颜色，支持 CSS 色值；为空时继承外部样式。

```vue
<mxi-icon name="star" size="24" color="#1989fa" />
<mxi-icon name="star" size="24" color="#07c160" />
```

### 自定义大小 {#demo-size}

通过 `size` 属性自定义图标大小，支持纯数字（自动补 `px`）或带单位字符串；为空时继承外部字号。

```vue
<mxi-icon name="chat-o" size="16" />
<mxi-icon name="chat-o" size="24" />
<mxi-icon name="chat-o" size="32" />
```

### 标签样式直达

与官方 uni-icons 一致，组件为单 `text` 根节点：未传 `color` / `size` 时无内联样式，`custom-class` / `custom-style` 直接作用于图标文本，可任意覆盖颜色、字号等文字样式。

```vue
<mxi-icon name="fire-o" custom-class="my-icon" />
<mxi-icon name="fire-o" custom-style="color: #1989fa;" />
```

```scss
/* 页面或全局样式中 */
.my-icon {
	color: #ee0a24;
}
```

### 点击事件

点击图标时触发 `click` 事件。

```vue
<mxi-icon name="like" @click="onTap" />
```

### 自定义图标 {#demo-slot}

两种方式接入自有字体图标：

- `custom-class` 覆盖根节点 `font-family`（配合自有字体与码点，必要时配合 `!important`）；
- `icon` 插槽放置任意内容（与 Loading 组件一致）。

```vue
<!-- 方式一：覆盖 font-family -->
<mxi-icon name="star" custom-class="my-font-icon" />

<!-- 方式二：icon 插槽 -->
<mxi-icon name="like" size="24">
	<template #icon>
		<text style="font-size: 24px;">✿</text>
	</template>
</mxi-icon>
```

### 图标集合

共 257 个图标，按基础（10）、线性（139）、填充（108）三组组织，完整名单如下：

<details>
<summary>基础图标（10）</summary>

`arrow`、`arrow-left`、`arrow-up`、`arrow-down`、`success`、`cross`、`plus`、`minus`、`fail`、`circle`

</details>

<details>
<summary>线性图标（139）</summary>

`location-o`、`like-o`、`star-o`、`phone-o`、`setting-o`、`fire-o`、`coupon-o`、`cart-o`、`shopping-cart-o`、`cart-circle-o`、`friends-o`、`comment-o`、`gem-o`、`gift-o`、`point-gift-o`、`send-gift-o`、`service-o`、`bag-o`、`todo-list-o`、`balance-list-o`、`close`、`clock-o`、`question-o`、`passed`、`add-o`、`gold-coin-o`、`info-o`、`play-circle-o`、`pause-circle-o`、`stop-circle-o`、`warning-o`、`phone-circle-o`、`music-o`、`smile-o`、`thumb-circle-o`、`comment-circle-o`、`browsing-history-o`、`underway-o`、`more-o`、`video-o`、`shop-o`、`shop-collect-o`、`share-o`、`chat-o`、`smile-comment-o`、`vip-card-o`、`award-o`、`diamond-o`、`volume-o`、`cluster-o`、`wap-home-o`、`photo-o`、`gift-card-o`、`expand-o`、`medal-o`、`good-job-o`、`manager-o`、`label-o`、`bookmark-o`、`bill-o`、`hot-o`、`hot-sale-o`、`new-o`、`new-arrival-o`、`goods-collect-o`、`eye-o`、`delete-o`、`font-o`、`contact-o`、`notes-o`、`records-o`、`cash-back-record-o`、`newspaper-o`、`discount-o`、`completed-o`、`user-o`、`description-o`、`balance-o`、`refund-o`、`birthday-cake-o`、`orders-o`、`tv-o`、`envelop-o`、`flag-o`、`flower-o`、`filter-o`、`bar-chart-o`、`chart-trending-o`、`brush-o`、`bullhorn-o`、`hotel-o`、`cashier-o`、`warn-o`、`calendar-o`、`bulb-o`、`user-circle-o`、`desktop-o`、`apps-o`、`home-o`、`back-top`、`search`、`points`、`edit`、`qr`、`qr-invalid`、`closed-eye`、`down`、`scan`、`revoke`、`free-postage`、`certificate`、`logistics`、`after-sale`、`exchange`、`upgrade`、`ellipsis`、`sign`、`failure`、`ecard-pay`、`peer-pay`、`balance-pay`、`credit-pay`、`debit-pay`、`cash-on-deliver`、`other-pay`、`tosend`、`pending-payment`、`paid`、`aim`、`idcard`、`replay`、`shrink`、`shield-o`、`guide-o`、`cash-o`、`link-o`、`miniprogram-o`、`list-switch`、`list-switching`

</details>

<details>
<summary>填充图标（108）</summary>

`location`、`like`、`star`、`phone`、`setting`、`fire`、`coupon`、`cart`、`shopping-cart`、`cart-circle`、`friends`、`comment`、`gem`、`gift`、`point-gift`、`send-gift`、`service`、`bag`、`todo-list`、`balance-list`、`clear`、`clock`、`question`、`checked`、`add`、`gold-coin`、`info`、`play-circle`、`pause-circle`、`stop-circle`、`warning`、`phone-circle`、`music`、`smile`、`thumb-circle`、`comment-circle`、`browsing-history`、`underway`、`more`、`video`、`shop`、`shop-collect`、`share`、`chat`、`smile-comment`、`vip-card`、`award`、`diamond`、`volume`、`cluster`、`wap-home`、`photo`、`gift-card`、`expand`、`medal`、`good-job`、`manager`、`label`、`bookmark`、`bill`、`hot`、`hot-sale`、`new`、`new-arrival`、`goods-collect`、`eye`、`delete`、`font`、`contact`、`notes`、`records`、`cash-back-record`、`newspaper`、`discount`、`completed`、`user`、`description`、`wechat`、`wechat-pay`、`wechat-moments`、`qq`、`alipay`、`weibo`、`photograph`、`youzan-shield`、`umbrella-circle`、`bell`、`printer`、`map-marked`、`card`、`add-square`、`live`、`lock`、`audio`、`graphic`、`column`、`invitation`、`play`、`pause`、`stop`、`weapp-nav`、`ascending`、`descending`、`bars`、`wap-nav`、`enlarge`、`photo-fail`、`sort`

</details>

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 图标名称 | IconName | 必填 |
| color | 图标颜色，支持 CSS 色值，为空时继承外部样式 | string | - |
| size | 图标大小，纯数字自动补 `px`，为空时继承外部样式 | string | - |
| custom-class | 自定义根节点类名 | string.ClassString | - |
| custom-style | 自定义根节点内联样式 | string | - |

### Events

| 事件名 | 说明 | 回调参数 |
| --- | --- | --- |
| click | 点击图标时触发 | event: MouseEvent |

### Slots

| 名称 | 说明 |
| --- | --- |
| icon | 自定义图标内容（替换默认字形） |

## 主题定制

本组件无默认主题变量：图标颜色与大小跟随外部样式（props / 标签样式直达），与官方 uni-icons 的无默认样式设计一致；字体名固定为 `mxi-icon`，无多字体切换场景，未做变量化。

完整变量与覆盖方式见[主题定制](/guide/theming)。
