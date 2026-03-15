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
          plugins: ['AMap.ToolBar', 'AMap.Scale', 'AMap.HawkEye', 'AMap.MarkerClusterer', 'AMap.MassMarks'],
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
    
    // 批量添加标记（支持万级点位）
    const addMarkers = (markerDataList, options = {}) => {
      if (!map) return null
      
      // 如果数据量小于1000，使用普通Marker
      if (markerDataList.length < 1000) {
        return addNormalMarkers(markerDataList, options)
      }
      // 如果数据量大于等于1000，使用MarkerClusterer或MassMarks
      else if (markerDataList.length < 10000) {
        return addMarkerClusterer(markerDataList, options)
      }
      // 如果数据量大于等于10000，使用MassMarks
      else {
        return addMassMarks(markerDataList, options)
      }
    }
    
    // 添加普通标记
    const addNormalMarkers = (markerDataList, options = {}) => {
      const addedMarkers = []
      
      markerDataList.forEach(markerData => {
        const marker = new window.AMap.Marker({
          position: markerData.position || [markerData.lng, markerData.lat],
          title: markerData.title,
          icon: markerData.icon || options.icon,
          ...options
        })
        
        marker.setMap(map)
        markers.push(marker)
        addedMarkers.push(marker)
      })
      
      return addedMarkers
    }
    
    // 添加标记集群
    const addMarkerClusterer = (markerDataList, options = {}) => {
      const markerList = []
      
      // 创建标记
      markerDataList.forEach(markerData => {
        const marker = new window.AMap.Marker({
          position: markerData.position || [markerData.lng, markerData.lat],
          title: markerData.title,
          icon: markerData.icon || options.icon
        })
        markerList.push(marker)
        markers.push(marker)
      })
      
      // 创建集群
      const clusterer = new window.AMap.MarkerClusterer(map, markerList, {
        gridSize: options.gridSize || 80,
        maxZoom: options.maxZoom || 18,
        zoomOnClick: options.zoomOnClick !== false,
        styles: options.styles || [
          {
            url: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            size: new window.AMap.Size(32, 32),
            offset: new window.AMap.Pixel(-16, -16)
          }
        ]
      })
      
      return clusterer
    }
    
    // 添加海量点
    const addMassMarks = (markerDataList, options = {}) => {
      // 转换数据格式
      const massData = markerDataList.map(markerData => ({
        lnglat: markerData.position || [markerData.lng, markerData.lat],
        name: markerData.title,
        ...markerData
      }))
      
      // 创建海量点
      const massMarks = new window.AMap.MassMarks(massData, {
        zIndex: options.zIndex || 5,
        opacity: options.opacity || 0.8,
        size: options.size || new window.AMap.Size(10, 10),
        anchor: options.anchor || new window.AMap.Pixel(5, 5),
        cursor: options.cursor || 'pointer',
        style: options.style || [
          {
            url: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
            size: new window.AMap.Size(10, 10),
            anchor: new window.AMap.Pixel(5, 5)
          }
        ]
      })
      
      massMarks.setMap(map)
      
      // 监听点击事件
      massMarks.on('click', (e) => {
        console.log('海量点点击:', e)
        // 可以在这里添加点击事件处理逻辑
      })
      
      return massMarks
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

    // 更新地图图层
    const updateLayers = (layers) => {
      console.log('图层控制功能已移除')
    }
    
    // 更新数据叠加
    const updateDataOverlays = (datasets) => {
      console.log('数据叠加功能已移除')
    }
    
    return {
      mapContainer,
      zoomIn,
      zoomOut,
      resetView,
      addMarker,
      addMarkers,
      clearMarkers,
      updateLayers,
      updateDataOverlays
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