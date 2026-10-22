# Icon

A font-based icon set with 257 built-in icons (names fully aligned with [Vant](https://vant-ui.github.io/vant/#/en-US/icon)), supporting custom color & size and click events. The API mirrors Vant Icon.

## Import

Components follow the easycom convention and can be used without import. See [Getting Started](/en/guide/getting-started) for details.

## Usage

### Basic Usage

`name` is a string union type `IconName` (IDE autocompletes all icon names; invalid names fail at compile time). The font file is bundled with the package (declarative `@font-face` loading) — zero configuration, works offline.

```html
<mxi-icon name="chat-o" />
```

### Custom Color

Use the `color` prop to customize the icon color (CSS color values are supported). When empty, the color is inherited from outer styles.

```html
<mxi-icon name="star" size="24" color="#1989fa" />
<mxi-icon name="star" size="24" color="#07c160" />
```

### Custom Size

Use the `size` prop to customize the icon size. Pure numbers are treated as `px`; unit strings are used as-is. When empty, the font size is inherited from outer styles.

```html
<mxi-icon name="chat-o" size="16" />
<mxi-icon name="chat-o" size="24" />
<mxi-icon name="chat-o" size="32" />
```

### Direct Tag Styling

Like the official uni-icons, the component renders a single `text` root node: without `color` / `size`, no inline styles are written, so `custom-class` / `custom-style` apply directly to the icon text — color, font-size and other text styles can be freely overridden.

```html
<mxi-icon name="fire-o" custom-class="my-icon" />
<mxi-icon name="fire-o" custom-style="color: #1989fa;" />
```

```scss
/* In page or global styles */
.my-icon {
	color: #ee0a24;
}
```

### Click Event

The `click` event is emitted when the icon is tapped.

```html
<mxi-icon name="like" @click="onTap" />
```

### Custom Icons

Two ways to plug in your own icon font:

- Override the root node's `font-family` via `custom-class` (together with your own font and codepoints, `!important` if needed);
- Put arbitrary content into the `icon` slot (same as the Loading component).

```html
<!-- Option 1: override font-family -->
<mxi-icon name="star" custom-class="my-font-icon" />

<!-- Option 2: icon slot -->
<mxi-icon name="like" size="24">
	<template #icon>
		<text style="font-size: 24px;">✿</text>
	</template>
</mxi-icon>
```

### Icon Set

257 icons in total, organized into three groups: basic (10), outline (139) and filled (108). Full list:

<details>
<summary>Basic（10）</summary>

`arrow`, `arrow-left`, `arrow-up`, `arrow-down`, `success`, `cross`, `plus`, `minus`, `fail`, `circle`

</details>

<details>
<summary>Outline（139）</summary>

`location-o`, `like-o`, `star-o`, `phone-o`, `setting-o`, `fire-o`, `coupon-o`, `cart-o`, `shopping-cart-o`, `cart-circle-o`, `friends-o`, `comment-o`, `gem-o`, `gift-o`, `point-gift-o`, `send-gift-o`, `service-o`, `bag-o`, `todo-list-o`, `balance-list-o`, `close`, `clock-o`, `question-o`, `passed`, `add-o`, `gold-coin-o`, `info-o`, `play-circle-o`, `pause-circle-o`, `stop-circle-o`, `warning-o`, `phone-circle-o`, `music-o`, `smile-o`, `thumb-circle-o`, `comment-circle-o`, `browsing-history-o`, `underway-o`, `more-o`, `video-o`, `shop-o`, `shop-collect-o`, `share-o`, `chat-o`, `smile-comment-o`, `vip-card-o`, `award-o`, `diamond-o`, `volume-o`, `cluster-o`, `wap-home-o`, `photo-o`, `gift-card-o`, `expand-o`, `medal-o`, `good-job-o`, `manager-o`, `label-o`, `bookmark-o`, `bill-o`, `hot-o`, `hot-sale-o`, `new-o`, `new-arrival-o`, `goods-collect-o`, `eye-o`, `delete-o`, `font-o`, `contact-o`, `notes-o`, `records-o`, `cash-back-record-o`, `newspaper-o`, `discount-o`, `completed-o`, `user-o`, `description-o`, `balance-o`, `refund-o`, `birthday-cake-o`, `orders-o`, `tv-o`, `envelop-o`, `flag-o`, `flower-o`, `filter-o`, `bar-chart-o`, `chart-trending-o`, `brush-o`, `bullhorn-o`, `hotel-o`, `cashier-o`, `warn-o`, `calendar-o`, `bulb-o`, `user-circle-o`, `desktop-o`, `apps-o`, `home-o`, `back-top`, `search`, `points`, `edit`, `qr`, `qr-invalid`, `closed-eye`, `down`, `scan`, `revoke`, `free-postage`, `certificate`, `logistics`, `after-sale`, `exchange`, `upgrade`, `ellipsis`, `sign`, `failure`, `ecard-pay`, `peer-pay`, `balance-pay`, `credit-pay`, `debit-pay`, `cash-on-deliver`, `other-pay`, `tosend`, `pending-payment`, `paid`, `aim`, `idcard`, `replay`, `shrink`, `shield-o`, `guide-o`, `cash-o`, `link-o`, `miniprogram-o`, `list-switch`, `list-switching`

</details>

<details>
<summary>Filled（108）</summary>

`location`, `like`, `star`, `phone`, `setting`, `fire`, `coupon`, `cart`, `shopping-cart`, `cart-circle`, `friends`, `comment`, `gem`, `gift`, `point-gift`, `send-gift`, `service`, `bag`, `todo-list`, `balance-list`, `clear`, `clock`, `question`, `checked`, `add`, `gold-coin`, `info`, `play-circle`, `pause-circle`, `stop-circle`, `warning`, `phone-circle`, `music`, `smile`, `thumb-circle`, `comment-circle`, `browsing-history`, `underway`, `more`, `video`, `shop`, `shop-collect`, `share`, `chat`, `smile-comment`, `vip-card`, `award`, `diamond`, `volume`, `cluster`, `wap-home`, `photo`, `gift-card`, `expand`, `medal`, `good-job`, `manager`, `label`, `bookmark`, `bill`, `hot`, `hot-sale`, `new`, `new-arrival`, `goods-collect`, `eye`, `delete`, `font`, `contact`, `notes`, `records`, `cash-back-record`, `newspaper`, `discount`, `completed`, `user`, `description`, `wechat`, `wechat-pay`, `wechat-moments`, `qq`, `alipay`, `weibo`, `photograph`, `youzan-shield`, `umbrella-circle`, `bell`, `printer`, `map-marked`, `card`, `add-square`, `live`, `lock`, `audio`, `graphic`, `column`, `invitation`, `play`, `pause`, `stop`, `weapp-nav`, `ascending`, `descending`, `bars`, `wap-nav`, `enlarge`, `photo-fail`, `sort`

</details>

## API

### Props

| Prop | Description | Type | Default |
| --- | --- | --- | --- |
| name | Icon name | IconName | required |
| color | Icon color, CSS color values supported; inherited when empty | string | - |
| size | Icon size, pure numbers are treated as `px`; inherited when empty | string | - |
| custom-class | Custom class name of the root node | string.ClassString | - |
| custom-style | Custom inline style of the root node | string | - |

### Events

| Event | Description | Arguments |
| --- | --- | --- |
| click | Emitted when the icon is clicked | event: MouseEvent |

### Slots

| Name | Description |
| --- | --- |
| icon | Custom icon content (replaces the default glyph) |

## Theming

This component has no default theme variables: icon color and size follow outer styles (props / direct tag styling), consistent with the official uni-icons' no-default-style design; the font name is fixed as `mxi-icon` — no multi-font switching scenario, so no variable is introduced.

See [Theming](/en/guide/theming) for all variables and how to override them.
