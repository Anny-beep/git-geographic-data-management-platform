<template>
  <div class="app">
    <!-- 顶部导航栏 -->
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#">
          <h1 class="h4 mb-0">地理信息数据平台</h1>
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeNavItem === 'home' }" 
                @click.stop="handleNavClick('home')"
              >
                地图首页
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeNavItem === 'data' }" 
                @click.stop="handleNavClick('data')"
              >
                数据中心
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeNavItem === 'tools' }" 
                @click.stop="handleNavClick('tools')"
              >
                分析工具
              </a>
            </li>
            <li class="nav-item">
              <a 
                class="nav-link" 
                :class="{ active: activeNavItem === 'settings' }" 
                @click.stop="handleNavClick('settings')"
              >
                系统设置
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- 主要内容区域 -->
    <main class="app-main pt-20">
      <div class="container-fluid">
        <!-- 地图首页 -->
        <div v-if="activeNavItem === 'home'" class="home-page">
          <div class="row g-4">
            <!-- 左侧地图区域 -->
            <div class="col-lg-8">
              <div class="card h-100">
                <div class="card-header bg-light d-flex justify-content-between align-items-center">
                  <h2 class="h5 mb-0">地图可视化</h2>
                  <div class="map-tools d-flex gap-2">
                    <button @click="toggleLayerControl" class="btn btn-outline-primary btn-sm">
                      图层控制
                    </button>
                    <button @click="toggleDataOverlay" class="btn btn-outline-primary btn-sm">
                      数据叠加
                    </button>
                  </div>
                </div>
                <div class="card-body p-0" style="height: calc(100vh - 250px);">
                  <AMap
                    ref="mapRef"
                    :center="mapCenter"
                    :zoom="mapZoom"
                    @map-loaded="onMapLoaded"
                    @map-click="onMapClick"
                  />
                </div>
              </div>
            </div>

            <!-- 右侧数据面板 -->
            <div class="col-lg-4">
              <div class="card mb-4">
                <div class="card-header bg-light">
                  <h2 class="h5 mb-0">数据统计分析</h2>
                </div>
                <div class="card-body">
                  <DataChart title="区域人口分布" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据中心 -->
        <DataCenter v-else-if="activeNavItem === 'data'" />

        <!-- 分析工具 -->
        <AnalysisTools v-else-if="activeNavItem === 'tools'" />

        <!-- 系统设置 -->
        <Settings v-else-if="activeNavItem === 'settings'" />
      </div>
    </main>

    <!-- 底部信息 -->
    <footer class="app-footer bg-white border-top mt-5">
      <div class="container">
        <div class="footer-content py-4 d-flex flex-column flex-md-row justify-content-between align-items-center">
          <p class="text-muted mb-2 mb-md-0">&copy; 2026 地理信息数据平台 - 基于高德地图 API 构建</p>
          <FooterLinks />
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import AMap from './components/AMap.vue'
import DataChart from './components/DataChart.vue'
import DataCenter from './components/DataCenter.vue'
import AnalysisTools from './components/AnalysisTools.vue'
import Settings from './components/Settings.vue'
import FooterLinks from './components/FooterLinks.vue'
import { mapConfig } from './config/map'

export default {
  name: 'App',
  components: {
    AMap,
    DataChart,
    DataCenter,
    AnalysisTools,
    Settings,
    FooterLinks
  },
  setup() {
    const mapRef = ref(null)
    const mapCenter = ref(mapConfig.center)
    const mapZoom = ref(mapConfig.zoom)
    const layerControlVisible = ref(false)
    const dataOverlayVisible = ref(false)
    const activeNavItem = ref('home')

    // 导航菜单点击处理
    const handleNavClick = (item) => {
      activeNavItem.value = item
      console.log('导航到:', item)
    }

    // 地图加载完成回调
    const onMapLoaded = (map) => {
      console.log('地图加载完成:', map)
      // 可以在这里添加初始化数据标记等操作
      addSampleMarkers(map)
    }

    // 地图点击事件回调
    const onMapClick = (e) => {
      console.log('地图点击:', e)
      // 可以在这里处理地图点击事件，如显示信息窗口等
    }

    // 添加示例标记
    const addSampleMarkers = (map) => {
      // 示例标记点数据
      const markers = [
        { position: [116.397428, 39.90923], title: '北京市中心' },
        { position: [116.417428, 39.91923], title: '朝阳区' },
        { position: [116.377428, 39.90923], title: '西城区' },
        { position: [116.397428, 39.92923], title: '海淀区' }
      ]

      markers.forEach(markerData => {
        if (mapRef.value) {
          mapRef.value.addMarker(markerData.position, {
            title: markerData.title,
            icon: new window.AMap.Icon({
              size: new window.AMap.Size(32, 32),
              image: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
              imageSize: new window.AMap.Size(32, 32)
            })
          })
        }
      })
    }

    // 切换图层控制
    const toggleLayerControl = () => {
      layerControlVisible.value = !layerControlVisible.value
      console.log('图层控制:', layerControlVisible.value)
    }

    // 切换数据叠加
    const toggleDataOverlay = () => {
      dataOverlayVisible.value = !dataOverlayVisible.value
      console.log('数据叠加:', dataOverlayVisible.value)
    }

    onMounted(() => {
      console.log('应用初始化完成')
    })

    return {
      mapRef,
      mapCenter,
      mapZoom,
      activeNavItem,
      onMapLoaded,
      onMapClick,
      toggleLayerControl,
      toggleDataOverlay,
      handleNavClick
    }
  }
}
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  color: #333;
  background-color: #f5f7fa;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* 浅色主题 */
body.theme-light {
  color: #333;
  background-color: #f5f7fa;
}

body.theme-light .navbar {
  background-color: #ffffff !important;
  color: #333;
}

body.theme-light .card {
  background-color: #ffffff;
  border-color: #e0e0e0;
}

body.theme-light .card-header {
  background-color: #f8f9fa;
  color: #333;
}

body.theme-light .form-control {
  background-color: #ffffff;
  color: #333;
  border-color: #ced4da;
}

body.theme-light .form-control:focus {
  border-color: #80bdff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

body.theme-light .btn {
  color: #333;
  background-color: #ffffff;
  border-color: #ced4da;
}

body.theme-light .btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

body.theme-light .app-footer {
  background-color: #ffffff;
  color: #333;
  border-top-color: #e0e0e0;
}

/* 深色主题 */
body.theme-dark {
  color: #e0e0e0;
  background-color: #121212;
}

body.theme-dark .navbar {
  background-color: #1e1e1e !important;
  color: #e0e0e0;
}

body.theme-dark .navbar-brand {
  color: #e0e0e0 !important;
}

body.theme-dark .nav-link {
  color: #e0e0e0 !important;
}

body.theme-dark .nav-link.active {
  color: #ffffff !important;
}

body.theme-dark .card {
  background-color: #1e1e1e;
  border-color: #333333;
}

body.theme-dark .card-header {
  background-color: #252525;
  color: #e0e0e0;
}

body.theme-dark .form-control {
  background-color: #252525;
  color: #e0e0e0;
  border-color: #444444;
}

body.theme-dark .form-control:focus {
  border-color: #666666;
  box-shadow: 0 0 0 0.2rem rgba(102, 102, 102, 0.25);
}

body.theme-dark .btn {
  color: #e0e0e0;
  background-color: #252525;
  border-color: #444444;
}

body.theme-dark .btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

body.theme-dark .app-footer {
  background-color: #1e1e1e;
  color: #e0e0e0;
  border-top-color: #333333;
}

/* 深色主题 - 文本样式 */
body.theme-dark h1,
body.theme-dark h2,
body.theme-dark h3,
body.theme-dark h4,
body.theme-dark h5,
body.theme-dark h6 {
  color: #ffffff;
}

body.theme-dark p {
  color: #e0e0e0;
}

body.theme-dark a {
  color: #64b5f6;
}

body.theme-dark a:hover {
  color: #90caf9;
}

body.theme-dark .text-muted {
  color: #a0a0a0 !important;
}

body.theme-dark .form-label {
  color: #e0e0e0;
}

body.theme-dark .form-text {
  color: #a0a0a0;
}

body.theme-dark .card-body {
  color: #e0e0e0;
}

body.theme-dark .navbar {
  background-color: #1e1e1e !important;
  color: #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

body.theme-dark .navbar-brand {
  color: #ffffff !important;
  font-weight: 600;
}

body.theme-dark .nav-link {
  color: #e0e0e0 !important;
  transition: color 0.3s ease;
}

body.theme-dark .nav-link:hover {
  color: #ffffff !important;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

body.theme-dark .nav-link.active {
  color: #ffffff !important;
  background-color: rgba(0, 123, 255, 0.2);
  border-radius: 4px;
}

body.theme-dark .navbar-toggler {
  border-color: #444444;
}

body.theme-dark .navbar-toggler-icon {
  filter: invert(1);
}

body.theme-dark .badge {
  color: #ffffff;
}

body.theme-dark .alert {
  color: #e0e0e0;
}

body.theme-dark .navbar-toggler-icon {
  filter: invert(1);
}

body.theme-dark .page-header h1 {
  color: #ffffff;
}

body.theme-dark .page-header p {
  color: #a0a0a0;
}

body.theme-dark .form-section h3 {
  color: #ffffff;
}

body.theme-dark .theme-option {
  color: #e0e0e0;
  border-color: #333333;
}

body.theme-dark .theme-option.active {
  border-color: #007bff;
  background-color: rgba(0, 123, 255, 0.1);
}

body.theme-dark .empty-state h3 {
  color: #ffffff;
}

body.theme-dark .empty-state p {
  color: #a0a0a0;
}

body.theme-dark .settings-actions .btn {
  color: #e0e0e0;
}

body.theme-dark .settings-actions .btn:hover {
  color: #ffffff;
}

body.theme-dark .data-overview .overview-label {
  color: #a0a0a0;
}

body.theme-dark .data-overview .overview-value {
  color: #ffffff;
}

body.theme-dark .data-table th {
  color: #e0e0e0;
  background-color: #252525;
}

body.theme-dark .data-table td {
  color: #e0e0e0;
  background-color: #1e1e1e;
}

body.theme-dark .data-table tr:hover {
  background-color: #252525;
}

body.theme-dark .visualization-card h3 {
  color: #ffffff;
}

body.theme-dark .visualization-card p {
  color: #a0a0a0;
}

/* 深色主题 - 设置页面样式 */
body.theme-dark .settings-panel {
  color: #e0e0e0;
}

body.theme-dark .form-section {
  background-color: #1e1e1e !important;
  border-color: #333333 !important;
}

body.theme-dark .form-section h3 {
  color: #ffffff;
  border-bottom-color: #333333;
}

body.theme-dark .api-service-item {
  background-color: #252525 !important;
  border-color: #444444 !important;
}

body.theme-dark .service-header {
  border-bottom-color: #444444;
}

body.theme-dark .service-header h4 {
  color: #ffffff;
}

body.theme-dark .form-check-label {
  color: #e0e0e0;
}

body.theme-dark .form-control::placeholder {
  color: #666666;
}

body.theme-dark .form-select {
  background-color: #252525;
  color: #e0e0e0;
  border-color: #444444;
}

body.theme-dark .form-select option {
  background-color: #252525;
  color: #e0e0e0;
}

/* 深色主题 - 其他页面样式 */
body.theme-dark .page-header {
  border-bottom-color: #333333;
}

body.theme-dark .data-management {
  background-color: #1e1e1e;
  border-color: #333333;
}

body.theme-dark .data-management .card-header {
  background-color: #252525;
  color: #e0e0e0;
}

body.theme-dark .data-tabs .nav-tabs {
  border-bottom-color: #333333;
}

body.theme-dark .data-tabs .nav-link {
  color: #e0e0e0 !important;
  border-color: transparent;
}

body.theme-dark .data-tabs .nav-link.active {
  color: #ffffff !important;
  background-color: #252525;
  border-color: #333333 #333333 #252525;
}

body.theme-dark .data-overview .overview-card {
  background-color: #1e1e1e;
  border-color: #333333;
}

body.theme-dark .data-visualization {
  background-color: #1e1e1e;
  border-color: #333333;
}

body.theme-dark .data-visualization .card-header {
  background-color: #252525;
  color: #e0e0e0;
}

body.theme-dark .visualization-card .card {
  background-color: #252525;
  border-color: #444444;
}

body.theme-dark .visualization-card .card-header {
  background-color: #2d2d2d;
  color: #e0e0e0;
  border-bottom-color: #444444;
}

/* 深色主题 - 边框和分割线 */
body.theme-dark .border {
  border-color: #333333 !important;
}

body.theme-dark .border-top {
  border-top-color: #333333 !important;
}

body.theme-dark .border-bottom {
  border-bottom-color: #333333 !important;
}

body.theme-dark .rounded {
  border-color: #333333 !important;
}

body.theme-dark .rounded-lg {
  border-color: #333333 !important;
}

/* 深色主题 - 提示文字和占位符 */
body.theme-dark .placeholder {
  color: #666666;
}

body.theme-dark .text-muted {
  color: #a0a0a0 !important;
}

body.theme-dark .form-text {
  color: #a0a0a0 !important;
}

body.theme-dark .empty-state p {
  color: #a0a0a0;
}

body.theme-dark .overview-label {
  color: #a0a0a0 !important;
}

/* 深色主题 - 按钮样式优化 */
body.theme-dark .btn {
  color: #e0e0e0;
  background-color: #252525;
  border-color: #444444;
  transition: all 0.3s ease;
}

body.theme-dark .btn:hover {
  color: #ffffff;
  background-color: #333333;
  border-color: #555555;
}

body.theme-dark .btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
}

body.theme-dark .btn-primary:hover {
  background-color: #0069d9;
  border-color: #0062cc;
}

body.theme-dark .btn-secondary {
  color: #e0e0e0;
  background-color: #252525;
  border-color: #444444;
}

body.theme-dark .btn-secondary:hover {
  background-color: #333333;
  border-color: #555555;
}

body.theme-dark .btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745;
}

body.theme-dark .btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

body.theme-dark .btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545;
}

body.theme-dark .btn-danger:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

/* 深色主题 - 卡片样式优化 */
body.theme-dark .card {
  background-color: #1e1e1e;
  border-color: #333333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

body.theme-dark .card-header {
  background-color: #252525;
  color: #e0e0e0;
  border-bottom-color: #333333;
}

body.theme-dark .card-body {
  color: #e0e0e0;
}

body.theme-dark .card-footer {
  background-color: #252525;
  color: #e0e0e0;
  border-top-color: #333333;
}

/* 应用容器 */
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 主要内容区域 */
.app-main {
  flex: 1;
  padding: 20px;
  padding-top: 80px; /* 为固定导航栏留出空间 */
}

/* 地图容器高度 */
.map-container {
  height: 100%;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .app-main {
    padding: 15px;
    padding-top: 70px;
  }
}
</style>