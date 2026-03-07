<template>
  <div class="map-container">
    <div ref="mapContainer" class="map"></div>
    <div class="map-controls position-absolute top-3 right-3 z-10">
      <div class="d-flex flex-column gap-2">
        <button @click="zoomIn" class="btn btn-light btn-sm border shadow-sm" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <span class="fw-bold">+</span>
        </button>
        <button @click="zoomOut" class="btn btn-light btn-sm border shadow-sm" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <span class="fw-bold">-</span>
        </button>
        <button @click="resetView" class="btn btn-light btn-sm border shadow-sm" style="width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
          <span style="font-size: 10px;">重置</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { mapConfig } from '../config/map'

export default {
  name: 'AMap',
  props: {
    center: {
      type: Array,
      default: () => mapConfig.center
    },
    zoom: {
      type: Number,
      default: mapConfig.zoom
    },
    mapStyle: {
      type: String,
      default: mapConfig.mapStyle
    }
  },
  emits: ['map-loaded', 'map-click'],
  setup(props, { emit }) {
    const mapContainer = ref(null)
    let map = null
    let markers = []

    // 初始化地图
    const initMap = async () => {
      try {
        console.log('开始初始化地图...')
        console.log('API密钥:', mapConfig.key)
        console.log('地图容器:', mapContainer.value)
        
        if (!mapContainer.value) {
          console.error('地图容器不存在')
          return
        }

        if (mapConfig.key === '您的高德地图API密钥') {
          console.warn('使用默认API密钥,地图可能无法正常显示,请替换为真实的API密钥')
          // 显示错误提示
          const errorDiv = document.createElement('div')
          errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            z-index: 1000;
          `
          errorDiv.innerHTML = `
            <h3 style="color: #f56c6c; margin-bottom: 10px;">地图加载失败</h3>
            <p style="color: #606266; margin-bottom: 15px;">请在 src/config/map.js 中配置真实的高德地图API密钥</p>
            <p style="font-size: 12px; color: #909399;">获取API密钥: <a href="https://lbs.amap.com/dev/key/app" target="_blank">https://lbs.amap.com/dev/key/app</a></p>
          `
          mapContainer.value.appendChild(errorDiv)
          return
        }

        // 加载高德地图
        const AMap = await AMapLoader.load({
          key: mapConfig.key,
          version: '2.0',
          plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye'],
          AMapUI: {
            version: '1.1',
            plugins: []
          }
        })

        console.log('高德地图加载成功')

        // 创建地图实例
        map = new AMap.Map(mapContainer.value, {
          center: props.center,
          zoom: props.zoom,
          mapStyle: props.mapStyle,
          resizeEnable: true
        })

        console.log('地图实例创建成功')

        // 添加控件
        map.addControl(new AMap.ToolBar())
        map.addControl(new AMap.Scale())
        map.addControl(new AMap.HawkEye())

        // 触发地图加载完成事件
        emit('map-loaded', map)

        // 监听地图点击事件
        map.on('click', (e) => {
          emit('map-click', e)
        })

      } catch (error) {
        console.error('地图初始化失败:', error)
        // 显示错误信息
        if (mapContainer.value) {
          const errorDiv = document.createElement('div')
          errorDiv.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.9);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            text-align: center;
            z-index: 1000;
          `
          errorDiv.innerHTML = `
            <h3 style="color: #f56c6c; margin-bottom: 10px;">地图加载失败</h3>
            <p style="color: #606266; margin-bottom: 15px;">错误信息: ${error.message || '未知错误'}</p>
            <p style="font-size: 12px; color: #909399;">请检查API密钥是否正确</p>
          `
          mapContainer.value.appendChild(errorDiv)
        }
      }
    }

    // 缩放控制
    const zoomIn = () => {
      if (map) {
        map.zoomIn()
      }
    }

    const zoomOut = () => {
      if (map) {
        map.zoomOut()
      }
    }

    // 重置视图
    const resetView = () => {
      if (map) {
        map.setCenter(props.center)
        map.setZoom(props.zoom)
      }
    }

    // 添加标记
    const addMarker = (position, options = {}) => {
      if (!map) return null

      const marker = new window.AMap.Marker({
        position: position,
        ...options
      })

      marker.setMap(map)
      markers.push(marker)
      return marker
    }

    // 清除所有标记
    const clearMarkers = () => {
      markers.forEach(marker => {
        marker.setMap(null)
      })
      markers = []
    }

    // 监听属性变化
    watch(() => props.center, (newCenter) => {
      if (map) {
        map.setCenter(newCenter)
      }
    })

    watch(() => props.zoom, (newZoom) => {
      if (map) {
        map.setZoom(newZoom)
      }
    })

    watch(() => props.mapStyle, (newStyle) => {
      if (map) {
        map.setMapStyle(newStyle)
      }
    })

    // 生命周期钩子
    onMounted(() => {
      initMap()
    })

    onUnmounted(() => {
      if (map) {
        map.destroy()
      }
    })

    return {
      mapContainer,
      zoomIn,
      zoomOut,
      resetView,
      addMarker,
      clearMarkers
    }
  }
}
</script>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.map {
  width: 100%;
  height: 100%;
}
</style>