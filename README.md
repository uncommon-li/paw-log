# Paw Log 🐾

Paw Log 是一个宠物健康记录应用，用来集中管理宠物档案、健康事件和待办提醒。项目基于 Next.js 构建，并通过 Capacitor 支持 iOS / Android 原生应用打包。

## 主要功能

- 宠物档案：记录宠物名称、品种、性别、生日、体重单位、毛色、芯片号、头像和备注。
- 健康记录：支持疫苗、就诊、用药、体重、牙科、手术和普通备注等记录类型。
- 提醒事项：根据疫苗到期、复诊、补药、洁牙、术后随访等日期生成提醒。
- 今日看板：优先展示今日/逾期用药，并汇总宠物和其他待办提醒。
- 本地存储：使用浏览器/应用本地存储保存数据，适合作为个人宠物健康日志。
- 移动端支持：内置 Capacitor 配置，可同步到 iOS 和 Android 工程。

## 技术栈

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS 4
- Zustand
- React Hook Form + Zod
- Radix UI
- Recharts
- Capacitor 8

## 环境要求

- Node.js >= 20.9.0
- npm（项目包含 `package-lock.json`）

如需构建移动端，还需要本机安装对应平台工具链：

- iOS：Xcode
- Android：Android Studio / Android SDK

## 快速开始

安装依赖：

```bash
npm install
```

启动开发服务器：

```bash
npm run dev
```

然后在浏览器打开：

[http://localhost:3000](http://localhost:3000)

首页会自动跳转到 `/dashboard`。

## 常用命令

```bash
# 启动开发服务器
npm run dev

# 构建 Web 版本
npm run build

# 启动生产服务
npm run start

# 运行 ESLint
npm run lint

# 构建并同步 Capacitor 原生工程
npm run cap:sync

# 构建并打开 iOS 工程
npm run cap:ios

# 构建并打开 Android 工程
npm run cap:android
```

## 项目结构

```text
app/                    Next.js App Router 页面
src/components/         通用 UI、布局、宠物和提醒组件
src/store/              Zustand 状态管理
src/types/              宠物、健康记录、提醒等类型定义
src/lib/                日期、存储、路径和工具函数
android/                Capacitor Android 工程
ios/                    Capacitor iOS 工程
capacitor.config.ts     Capacitor 应用配置
next.config.ts          Next.js 配置
```

## 数据说明

当前应用以本地优先方式运行，宠物档案、健康记录和提醒数据保存在本机浏览器或移动应用的本地存储中。清理浏览器站点数据、卸载应用或更换设备可能导致数据不可用；如需长期备份，请在后续版本中补充导出/同步能力。

## 部署

Web 版本可以部署到支持 Next.js 静态/服务端构建的平台。项目的移动端构建使用 Capacitor，`webDir` 配置为 `out`，同步原生工程前请先运行对应构建命令。

## 开发提示

本项目使用较新的 Next.js 版本。修改 Next.js 相关配置或 App Router 行为前，请优先查看项目依赖中 `node_modules/next/dist/docs/` 下的对应文档，避免沿用旧版本约定。


