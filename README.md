# 地理信息数据平台

## 项目描述

地理信息数据平台是一个基于Vue 3和高德地图API构建的现代化Web应用，旨在提供直观、高效的地理信息可视化和数据分析功能。该平台集成了地图展示、数据统计、分析工具等核心功能，为用户提供全方位的地理信息服务。

## 项目预览

![地理信息数据平台预览](https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20geographic%20information%20system%20dashboard%20with%20map%20visualization%20and%20data%20charts&image_size=landscape_16_9)

### 在线预览

项目已部署在 GitHub Pages 上，您可以通过以下链接访问：

[地理信息数据平台在线预览](https://Anny-beep.github.io/git-test)

### 本地预览

```bash
npm run dev
```

然后在浏览器中访问 `http://localhost:5173` 查看项目。

## 功能特性

- **地图可视化**：基于高德地图API实现的交互式地图，支持缩放、平移、标记等功能，支持万级点位渲染
- **数据统计分析**：展示区域人口分布、经济发展指标等数据图表
- **数据中心**：集中管理和展示各类地理相关数据
- **分析工具**：提供路径规划、区域分析、地形分析、网络分析等专业工具
- **系统设置**：支持个性化配置和系统参数调整
- **响应式设计**：基于Bootstrap 5实现的响应式布局，适配不同屏幕尺寸的设备
- **现代化UI**：使用Bootstrap 5组件，提供美观、专业的用户界面
- **性能优化**：实现了首屏渲染优化和万级点位渲染支持

## 技术栈

- **前端框架**：Vue 3 (Composition API)
- **状态管理**：Pinia 3.0
- **地图API**：高德地图 JS API 2.0 (@amap/amap-jsapi-loader)
- **UI框架**：Bootstrap 5
- **数据可视化**：ECharts 6.0
- **构建工具**：Vite 6.0
- **包管理器**：npm

## 依赖项

| 依赖项 | 版本 | 用途 |
|-------|------|------|
| vue | ^3.5.13 | 前端框架 |
| pinia | ^3.0.4 | 状态管理 |
| @amap/amap-jsapi-loader | ^1.0.1 | 高德地图API加载器 |
| bootstrap | ^5.3.8 | UI框架 |
| echarts | ^6.0.0 | 数据可视化 |
| @popperjs/core | ^2.11.8 | 弹出层定位库（Bootstrap依赖） |
| terser | ^5.28.1 | 代码压缩工具（构建依赖） |

## 项目结构

```
git-test/
├── src/
│   ├── components/        # 组件目录
│   │   ├── AMap.vue       # 地图组件
│   │   ├── AnalysisTools.vue  # 分析工具组件
│   │   ├── DataCenter.vue     # 数据中心组件
│   │   ├── DataChart.vue      # 数据图表组件
│   │   ├── FooterLinks.vue    # 页脚链接组件
│   │   └── Settings.vue       # 设置组件
│   ├── config/            # 配置目录
│   │   └── map.js         # 地图配置
│   ├── stores/            # 状态管理目录
│   │   └── dataStore.js   # 数据存储
│   ├── App.vue            # 应用主组件
│   ├── main.js            # 应用入口
│   └── style.css          # 全局样式
├── .gitignore             # Git忽略文件
├── README.md              # 项目说明
├── index.html             # HTML模板
├── package-lock.json      # 依赖锁定文件
├── package.json           # 项目配置
└── vite.config.js         # Vite配置
```

## 安装与运行

### 前提条件

- Node.js 14.0 或更高版本
- npm 6.0 或更高版本

### 安装步骤

1. 克隆项目到本地

```bash
git clone <项目仓库地址>
cd git-test
```

2. 安装依赖

```bash
npm install
```

3. 配置高德地图API密钥

编辑 `src/config/map.js` 文件，将 `key` 值替换为您自己的高德地图API密钥：

```javascript
// 高德地图配置
export const mapConfig = {
  // 请替换为您自己的高德地图API密钥
  key: '您的高德地图API密钥',
  // 地图初始中心点
  center: [116.397428, 39.90923],
  // 地图初始缩放级别
  zoom: 13,
  // 地图默认样式
  mapStyle: 'amap://styles/normal'
}
```

4. 启动开发服务器

```bash
npm run dev
```

5. 构建生产版本

```bash
npm run build
```

## 核心功能模块

### 1. 地图可视化

- 基于高德地图API实现的交互式地图
- 支持缩放、平移、标记等基本操作
- 示例标记点展示
- 地图控件（缩放按钮、重置按钮）
- 响应式地图容器，适配不同屏幕尺寸
- **万级点位渲染**：支持高效渲染10000+点位，使用MarkerClusterer和MassMarks技术
- **性能优化**：根据数据量自动选择最佳渲染方式，确保地图流畅运行

### 2. 数据统计分析

- 区域人口分布图表
- 经济发展指标图表
- 数据可视化展示
- 数据统计卡片，显示总量、平均值、最大值、最小值
- 数据表格展示，支持响应式布局

### 3. 数据中心

- 集中管理地理相关数据
- 数据导入和导出功能
- 数据分类和筛选
- 数据概览卡片，展示数据总量、类型分布等
- 数据管理表格，支持查看、编辑、删除操作
- 数据可视化预览卡片

### 4. 分析工具

- **路径规划**：支持驾车、步行、骑行、公交等多种出行方式
- **区域分析**：支持人口分布、经济活力、设施密度、环境质量等分析类型
- **地形分析**：支持高程分析、坡度分析、坡向分析、可视域分析
- **网络分析**：支持服务范围、最近设施、等时圈、可达性分析
- 最近分析记录管理

### 5. 系统设置

- **地图设置**：API密钥配置、默认中心点、缩放级别、地图样式、控件设置
- **系统设置**：平台名称、系统语言、主题设置（浅色、深色、跟随系统）、性能设置
- **用户设置**：用户信息管理、密码修改、通知设置
- **API设置**：API服务管理、请求频率限制、超时设置
- 设置导入/导出功能
- 设置重置功能

## Bootstrap UI 实现

项目使用 Bootstrap 5 实现现代化的用户界面，主要包括：

- **响应式布局**：使用 Bootstrap 网格系统，适配不同屏幕尺寸
- **导航组件**：使用 Bootstrap 导航栏，支持移动端折叠菜单
- **卡片组件**：使用 Bootstrap 卡片展示数据和功能模块
- **表单控件**：使用 Bootstrap 表单控件，提供统一的用户输入体验
- **按钮组件**：使用 Bootstrap 按钮，提供一致的操作样式
- **表格组件**：使用 Bootstrap 表格，展示数据列表
- **徽章和标签**：使用 Bootstrap 徽章和标签，显示状态和分类
- **工具提示**：使用 Bootstrap 工具提示，提供额外信息

## 性能优化

### 1. 首屏渲染优化

- **组件懒加载**：使用 `defineAsyncComponent` 实现组件的按需加载
- **代码分割**：配置 Vite 的 `manualChunks` 进行代码分割，将第三方依赖分为多个chunk
- **资源优化**：按需加载 Bootstrap JS，减少初始加载时间
- **构建配置优化**：启用 Terser 压缩，移除 console 和 debugger 语句

### 2. 万级点位渲染优化

- **多层次渲染方案**：根据点位数量自动选择最佳渲染方式
  - 普通标记：小于1000个点位
  - 标记集群：1000-10000个点位
  - 海量点：大于等于10000个点位
- **技术实现**：使用高德地图的 MarkerClusterer 和 MassMarks 技术
- **性能监测**：添加了性能计时，可实时查看渲染耗时
- **用户体验**：确保在万级点位下地图仍然流畅运行

## 开发指南

### 代码规范

- 使用 Vue 3 Composition API
- 组件命名使用 PascalCase
- 变量和函数命名使用 camelCase
- 常量命名使用 UPPER_CASE
- 代码缩进使用 2 个空格
- 每行代码长度不超过 80 个字符

### 开发流程

1. 克隆项目并安装依赖
2. 配置高德地图API密钥
3. 启动开发服务器：`npm run dev`
4. 进行代码开发和修改
5. 运行构建命令：`npm run build`
6. 测试构建结果

### 贡献指南

1. Fork 项目仓库
2. 创建功能分支
3. 提交代码修改
4. 推送至远程分支
5. 创建 Pull Request

## 常见问题解答

### 1. 地图加载失败怎么办？

- 检查 `src/config/map.js` 中的 API 密钥是否正确
- 确保网络连接正常
- 检查浏览器控制台是否有错误信息

### 2. 如何添加新的分析工具？

- 在 `AnalysisTools.vue` 组件中添加新的工具类别
- 实现相应的表单和结果展示逻辑
- 在 `settingsNav` 数组中添加新的导航项

### 3. 如何修改主题样式？

- 在 `Settings.vue` 组件中修改主题设置
- 或者直接修改 `src/style.css` 文件中的样式

### 4. 如何添加新的数据可视化图表？

- 在 `DataChart.vue` 组件中添加新的图表类型
- 或者集成第三方图表库（如 ECharts、Chart.js 等）

### 5. 如何部署生产版本？

- 运行 `npm run build` 命令构建生产版本
- 将 `dist` 目录中的文件部署到 Web 服务器
- 确保服务器配置了正确的 MIME 类型

## 许可证

MIT

## 联系方式

- **邮箱**：281541758@qq.com
- **项目地址**：[https://github.com/Anny-beep/git-test](https://github.com/Anny-beep/git-test)
- **在线预览**：[https://Anny-beep.github.io/git-test](https://Anny-beep.github.io/git-test)

如有问题或建议，请联系项目维护者。

© 2026 地理信息数据平台 - 基于高德地图 API 构建