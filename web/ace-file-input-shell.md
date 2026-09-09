---
title: ng-if 下 Ace file_input 初始化失效导致上传控件"壳"残留
date: 2026-09-01T05:06:44.000Z
category:
  - code
  - frontend
tags:
  - AngularJS
  - jQuery
  - Ace Admin
  - 文件上传
  - 踩坑
---

# ng-if 下 Ace file_input 初始化失效导致上传控件"壳"残留

[[toc]]

## 背景

Ace Admin（Bootstrap 3 时代的 jQuery 后台模板）的文件上传组件 `ace_file_input_flat()` 会把原生 `<input type="file">` 包成带"选择文件 / 文件名 / 删除"UI 的控件。初始化时它创建 `.ace-file-input` → `.validDiv` → `.fileFlatDivOuter` 等 DOM 包裹层，**只有被 ACE 初始化过的 input 才有这些包裹层**。

ACE 通常会批量扫描页面上的文件上传 input 并统一初始化。

## 现象（稳定复现，非瞬时竞态）

- 同一上传区域里，**无附件数据的行**显示出一个灰色"选择文件"按钮（俗称"壳"），而**有数据的行**正常渲染。
- 多次打开页面，哪些行空白、哪些行有壳表现不一致，但每次都是**稳定复现的持续状态**，不是某次渲染的随机差异。

## 根因

"壳"是**原生 `<input type="file" disabled>` 按钮外露**，不是 ACE 初始化产生的按钮无人清理。两个必要条件同时成立：

1. **漏初始化**：这些 input 放在 `ng-if` 分支内。ACE 批量初始化跑在 AngularJS 的 link 阶段，而 `ng-if` 的内容要等到 `$digest` 的 `$watch` 回调里才 transclude 进 DOM。于是扫描时这些 input 还没插入，被漏掉，**永远不被 ACE 初始化**。
2. **无数据**：该行没有对应的附件记录，文件列表为空，不会触发 ACE 初始化，input 从头到尾没被 ACE 碰过。

结果就是这些行始终是裸露的浏览器原生 file input（带 `disabled` 却仍显示"选择文件"按钮），即看到的"壳"。

> 对比：有数据的行会走正常初始化流程 → 首次自动 ACE 初始化 → 有 `.ace-file-input` 包裹层，正常。

## 修复

清理"无数据行"的壳时，原逻辑只删 ACE 容器：

```js
// 旧：无数据的行是裸 input，closest('.ace-file-input') 找不到 → remove() 空操作，壳清不掉
$('input[name="' + name + '"][data-index="' + index + '"]').closest('.ace-file-input').remove();
```

改为兜底删裸 input：

```js
var $input = $('input[name="' + name + '"][data-index="' + index + '"]');
var $aceInput = $input.closest('.ace-file-input');
if ($aceInput.length) {
    $aceInput.remove();   // 已初始化的行：删 ACE 容器
} else if ($input.length) {
    $input.remove();      // 未初始化的行：ng-if 中漏初始化，裸 input 直接删
}
```

## 教训 / 对比

现代组件库（Element Plus `el-upload`、antd `Upload`、vue-upload-component）已内建这些 UI 与销毁逻辑，**不存在手动 `closest('.ace-file-input')` 清理的坑**。这类问题本质是 jQuery 命令式组件 + AngularJS 声明式生命周期错位导致的——属于遗留 AngularJS/jQuery 系统的典型坑，新项目不应再引入 Ace Admin。
