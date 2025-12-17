# v1.0.0 配置指南

> **版本**: v1.0.0  
> **创建时间**: 2025-12-17  
> **文档类型**: 配置说明

---

## 📋 配置总览

本文档记录 v1.0.0 版本的关键配置信息，方便快速了解和修改项目配置。

---

## 🎯 核心配置文件

### 1. package.json

**位置**: `/package.json`

**关键配置**:
```json
{
  "name": "openbook-baoyi",
  "version": "1.0.0",
  "scripts": {
    "start": "docusaurus start --port 3005",
    "build": "docusaurus build",
    "serve": "docusaurus serve --port 3005"
  },
  "dependencies": {
    "@docusaurus/core": "^3.9.2",
    "@docusaurus/preset-classic": "^3.9.2",
    "react": "^18.3.1"
  }
}
```

**说明**:
- 开发端口：3005（避免与其他项目冲突）
- Docusaurus 版本：3.9.2
- React 版本：18.3.1

---

### 2. docusaurus.config.js

**位置**: `/docusaurus.config.js`

**站点基础配置**:
```javascript
const config = {
  title: '宝易开源电子书',
  tagline: '知识分享，共同成长',
  favicon: 'img/favicon.ico',
  url: 'https://your-docusaurus-site.example.com',
  baseUrl: '/',
  
  // 国际化
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },
}
```

**主题配置**:
```javascript
themeConfig: {
  navbar: {
    title: '宝易开源电子书',
    items: [
      {
        type: 'docSidebar',
        sidebarId: 'tutorialSidebar',
        position: 'left',
        label: '教程',
      },
      {to: '/blog', label: '博客', position: 'left'},
      {
        href: 'https://github.com/facebook/docusaurus',
        label: 'GitHub',
        position: 'right',
      },
    ],
  },
  
  // 深色模式
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
    respectPrefersColorScheme: true,
  },
}
```

---

### 3. sidebars.js

**位置**: `/sidebars.js`

**配置**:
```javascript
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: '教程',
      items: ['intro'],
    },
  ],
};
```

**说明**:
- 自动生成侧边栏
- 支持多层级分类
- 支持折叠展开

---

## 🎨 样式配置

### custom.css

**位置**: `/src/css/custom.css`

**主题颜色**:
```css
:root {
  --ifm-color-primary: #2e8555;
  --ifm-color-primary-dark: #29784c;
  --ifm-color-primary-darker: #277148;
  --ifm-color-primary-darkest: #205d3b;
  --ifm-color-primary-light: #33925d;
  --ifm-color-primary-lighter: #359962;
  --ifm-color-primary-lightest: #3cad6e;
}

[data-theme='dark'] {
  --ifm-color-primary: #25c2a0;
  --ifm-color-primary-dark: #21af90;
  --ifm-color-primary-darker: #1fa588;
  --ifm-color-primary-darkest: #1a8870;
  --ifm-color-primary-light: #29d5b0;
  --ifm-color-primary-lighter: #32d8b4;
  --ifm-color-primary-lightest: #4fddbf;
}
```

**说明**:
- 支持浅色和深色两套主题
- 可自定义主题色
- 使用 CSS 变量便于维护

---

## 📝 博客配置

### 博客作者

**位置**: `/blog/authors.yml`

**配置**:
```yaml
baoyi:
  name: 宝易
  title: 作者
  url: https://github.com/baoyi
  image_url: https://github.com/baoyi.png
```

**说明**:
- 支持多个作者
- 可配置头像和链接
- 自动显示在博客文章中

---

## 🚀 启动配置

### 开发环境

**启动命令**:
```bash
npm start
```

**访问地址**:
- http://localhost:3005

**说明**:
- 热重载支持
- 自动打开浏览器
- 实时预览修改

---

### 生产构建

**构建命令**:
```bash
npm run build
```

**输出目录**:
- `/build`

**预览命令**:
```bash
npm run serve
```

**说明**:
- 生成静态 HTML
- 优化性能
- 可直接部署

---

## 📂 目录结构

```
openbook-baoyi/
├── docs/                    # 文档内容
│   ├── intro.md            # 介绍页
│   └── tutorial-basics/    # 教程目录
├── blog/                    # 博客文章
│   ├── authors.yml         # 作者配置
│   └── 2025-12-16-welcome/ # 示例文章
├── src/                     # 自定义组件
│   ├── pages/              # 自定义页面
│   │   └── index.js        # 首页
│   └── css/                # 样式文件
│       └── custom.css      # 自定义样式
├── static/                  # 静态资源
│   └── img/                # 图片资源
├── docusaurus.config.js     # 主配置文件
├── sidebars.js             # 侧边栏配置
└── package.json            # 依赖管理
```

---

## 🔧 常用修改

### 修改站点标题

编辑 `docusaurus.config.js`:
```javascript
title: '你的站点标题',
tagline: '你的标语',
```

### 修改导航栏

编辑 `docusaurus.config.js` 中的 `navbar.items`:
```javascript
items: [
  {
    type: 'docSidebar',
    sidebarId: 'tutorialSidebar',
    position: 'left',
    label: '你的标签',
  },
]
```

### 修改主题色

编辑 `src/css/custom.css`:
```css
:root {
  --ifm-color-primary: #你的颜色;
}
```

### 添加新文档

1. 在 `docs/` 目录下创建 `.md` 文件
2. 添加 frontmatter：
```markdown
---
sidebar_position: 1
---

# 文档标题
```

### 添加新博客

1. 在 `blog/` 目录下创建文件夹或 `.md` 文件
2. 添加 frontmatter：
```markdown
---
slug: welcome
title: 欢迎
authors: [baoyi]
tags: [hello]
---

博客内容
```

---

## 🔗 相关文档

- [技术决策记录](./TECH_DECISIONS.md)
- [需求文档](./v1.0.0_REQUIREMENTS.md)
- [Docusaurus 官方文档](https://docusaurus.io/zh-CN/)
