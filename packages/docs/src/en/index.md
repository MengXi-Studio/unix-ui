---
layout: home

title: '@meng-xi/unix-ui'
titleTemplate: unix-ui Component Library

hero:
  name: '@meng-xi/unix-ui'
  text: UI components for uni-app x
  tagline: A full-featured UI component library for uni-app x with a built-in theme and easycom auto-import
  image:
    src: /logo.svg
    alt: unix-ui
  actions:
    - theme: brand
      text: Quick Start
      link: /en/guide/getting-started
    - theme: alt
      text: Introduction
      link: /en/guide/introduction
    - theme: alt
      text: GitHub
      link: https://github.com/MengXi-Studio/unix-ui

features:
  - icon: 🧩
    title: easycom Auto Import
    details: Follows the uni_modules component plugin spec — use components directly in templates without import or registration; an easycom custom rule is provided for npm installs
  - icon: 🎨
    title: Themeable
    details: A default theme ships with the components and works out of the box; defining $mxi-* variables in the project root uni.scss overrides it globally at compile time, with !default giving user values priority
  - icon: 📱
    title: Multi-Platform
    details: Supports App (Android / iOS / HarmonyOS), Web and Mini Programs, compatible with vapor mode; platform differences are isolated via conditional compilation
  - icon: ⚡
    title: Native Rendering
    details: UTS + uvue compile to native code; 0.5px hairline borders use scale(0.5) and loading animations run on UniElement.animate — no Web-only capabilities involved
  - icon: 💪
    title: Strongly Typed UTS
    details: Props defined with type + withDefaults, Events declared as named tuples, strict typing with no implicit conversion — errors are caught at compile time
  - icon: 📐
    title: Consistent Component API
    details: Component naming, props / events and visual specs follow one unified interaction convention — zero learning cost
---
