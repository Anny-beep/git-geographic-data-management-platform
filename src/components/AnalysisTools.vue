<template>
  <div class="analysis-tools">
    <div class="page-header text-center mb-5 pb-3 border-bottom">
      <h1 class="display-6">分析工具</h1>
      <p class="text-muted">使用专业工具分析地理信息数据</p>
    </div>

    <!-- 工具分类 -->
    <div class="tool-categories mb-5">
      <div class="row g-4">
        <div 
          class="category-card col-md-3 col-sm-6" 
          v-for="category in toolCategories" 
          :key="category.value"
          :class="{ active: activeCategory === category.value }"
          @click="activeCategory = category.value"
        >
          <div class="card h-100 border-2 hover-shadow">
            <div class="card-body text-center p-4">
              <div class="category-icon fs-1 mb-3">{{ category.icon }}</div>
              <div class="category-content">
                <h3 class="h5 mb-2">{{ category.label }}</h3>
                <p class="text-muted small">{{ category.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 工具详情 -->
    <div class="tool-details card shadow-sm rounded-lg mb-5">
      <div class="card-header bg-light">
        <h2 class="h5 mb-0">{{ currentCategory?.label || '选择分析工具' }}</h2>
      </div>
      <div class="card-body">
        <!-- 路径规划工具 -->
        <div v-if="activeCategory === 'route'" class="tool-panel">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="tool-form card bg-light p-4 rounded-lg">
                <div class="form-group mb-3">
                  <label class="form-label">起点</label>
                  <input type="text" v-model="routeStart" class="form-control" placeholder="输入起点地址" />
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">终点</label>
                  <input type="text" v-model="routeEnd" class="form-control" placeholder="输入终点地址" />
                </div>
                <div class="form-group mb-4">
                  <label class="form-label">出行方式</label>
                  <select v-model="routeMode" class="form-select">
                    <option value="drive">驾车</option>
                    <option value="walk">步行</option>
                    <option value="bike">骑行</option>
                    <option value="transit">公交</option>
                  </select>
                </div>
                <button class="btn btn-primary w-100" @click="calculateRoute">
                  计算路线
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="tool-result card bg-light p-4 rounded-lg">
                <h3 class="h6 mb-3">路线规划结果</h3>
                <div v-if="routeResult" class="result-content bg-white p-3 rounded border">
                  <div class="result-item d-flex justify-content-between py-2 border-bottom" v-for="(item, key) in routeResult" :key="key">
                    <span class="result-label text-muted">{{ key === 'distance' ? '总距离:' : key === 'duration' ? '预计时间:' : key === 'mode' ? '出行方式:' : '路线详情:' }}</span>
                    <span class="result-value font-weight-medium">{{ item }}</span>
                  </div>
                </div>
                <div v-else class="result-placeholder d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded border border-dashed">
                  <span class="fs-1 mb-3">🗺️</span>
                  <p class="text-muted text-center">点击"计算路线"查看规划结果</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 区域分析工具 -->
        <div v-else-if="activeCategory === 'area'" class="tool-panel">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="tool-form card bg-light p-4 rounded-lg">
                <div class="form-group mb-3">
                  <label class="form-label">分析区域</label>
                  <input type="text" v-model="areaName" class="form-control" placeholder="输入区域名称" />
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">分析类型</label>
                  <select v-model="areaAnalysisType" class="form-select">
                    <option value="population">人口分布</option>
                    <option value="economy">经济活力</option>
                    <option value="facility">设施密度</option>
                    <option value="environment">环境质量</option>
                  </select>
                </div>
                <div class="form-group mb-4">
                  <label class="form-label">分析半径</label>
                  <input type="number" v-model="areaRadius" class="form-control" placeholder="输入分析半径(米)" />
                </div>
                <button class="btn btn-primary w-100" @click="analyzeArea">
                  分析区域
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="tool-result card bg-light p-4 rounded-lg">
                <h3 class="h6 mb-3">区域分析结果</h3>
                <div v-if="areaResult" class="result-content bg-white p-3 rounded border">
                  <div class="result-item d-flex justify-content-between py-2 border-bottom" v-for="(item, key) in areaResult" :key="key">
                    <span class="result-label text-muted">{{ key === 'area' ? '分析区域:' : key === 'type' ? '分析类型:' : key === 'radius' ? '分析半径:' : key === 'score' ? '分析结果:' : '评价:' }}</span>
                    <span class="result-value font-weight-medium">{{ item }}{{ key === 'radius' ? ' 米' : key === 'score' ? ' 分' : '' }}</span>
                  </div>
                </div>
                <div v-else class="result-placeholder d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded border border-dashed">
                  <span class="fs-1 mb-3">📊</span>
                  <p class="text-muted text-center">点击"分析区域"查看分析结果</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 地形分析工具 -->
        <div v-else-if="activeCategory === 'terrain'" class="tool-panel">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="tool-form card bg-light p-4 rounded-lg">
                <div class="form-group mb-3">
                  <label class="form-label">分析区域</label>
                  <input type="text" v-model="terrainArea" class="form-control" placeholder="输入地形区域" />
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">分析类型</label>
                  <select v-model="terrainAnalysisType" class="form-select">
                    <option value="elevation">高程分析</option>
                    <option value="slope">坡度分析</option>
                    <option value="aspect">坡向分析</option>
                    <option value="viewshed">可视域分析</option>
                  </select>
                </div>
                <div class="form-group mb-4">
                  <label class="form-label">精度设置</label>
                  <select v-model="terrainAccuracy" class="form-select">
                    <option value="low">低精度</option>
                    <option value="medium">中精度</option>
                    <option value="high">高精度</option>
                  </select>
                </div>
                <button class="btn btn-primary w-100" @click="analyzeTerrain">
                  分析地形
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="tool-result card bg-light p-4 rounded-lg">
                <h3 class="h6 mb-3">地形分析结果</h3>
                <div v-if="terrainResult" class="result-content bg-white p-3 rounded border">
                  <div class="result-item d-flex justify-content-between py-2 border-bottom" v-for="(item, key) in terrainResult" :key="key">
                    <span class="result-label text-muted">{{ key === 'area' ? '分析区域:' : key === 'type' ? '分析类型:' : key === 'accuracy' ? '精度设置:' : key === 'data' ? '分析结果:' : '分析时间:' }}</span>
                    <span class="result-value font-weight-medium">{{ item }}</span>
                  </div>
                </div>
                <div v-else class="result-placeholder d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded border border-dashed">
                  <span class="fs-1 mb-3">⛰️</span>
                  <p class="text-muted text-center">点击"分析地形"查看分析结果</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 网络分析工具 -->
        <div v-else-if="activeCategory === 'network'" class="tool-panel">
          <div class="row g-4">
            <div class="col-md-6">
              <div class="tool-form card bg-light p-4 rounded-lg">
                <div class="form-group mb-3">
                  <label class="form-label">分析中心点</label>
                  <input type="text" v-model="networkCenter" class="form-control" placeholder="输入中心点" />
                </div>
                <div class="form-group mb-3">
                  <label class="form-label">分析类型</label>
                  <select v-model="networkAnalysisType" class="form-select">
                    <option value="service">服务范围</option>
                    <option value="closest">最近设施</option>
                    <option value="isochrone">等时圈</option>
                    <option value="accessibility">可达性分析</option>
                  </select>
                </div>
                <div class="form-group mb-4">
                  <label class="form-label">分析参数</label>
                  <input type="number" v-model="networkParameter" class="form-control" placeholder="输入分析参数" />
                </div>
                <button class="btn btn-primary w-100" @click="analyzeNetwork">
                  分析网络
                </button>
              </div>
            </div>
            <div class="col-md-6">
              <div class="tool-result card bg-light p-4 rounded-lg">
                <h3 class="h6 mb-3">网络分析结果</h3>
                <div v-if="networkResult" class="result-content bg-white p-3 rounded border">
                  <div class="result-item d-flex justify-content-between py-2 border-bottom" v-for="(item, key) in networkResult" :key="key">
                    <span class="result-label text-muted">{{ key === 'center' ? '中心点:' : key === 'type' ? '分析类型:' : key === 'parameter' ? '分析参数:' : key === 'data' ? '分析结果:' : '覆盖范围:' }}</span>
                    <span class="result-value font-weight-medium">{{ item }}</span>
                  </div>
                </div>
                <div v-else class="result-placeholder d-flex flex-column align-items-center justify-content-center p-5 bg-white rounded border border-dashed">
                  <span class="fs-1 mb-3">🌐</span>
                  <p class="text-muted text-center">点击"分析网络"查看分析结果</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 默认提示 -->
        <div v-else class="tool-panel">
          <div class="empty-state d-flex flex-column align-items-center justify-content-center py-10 text-center">
            <div class="empty-icon fs-1 mb-3">🔍</div>
            <h3 class="h5 mb-2">选择分析工具</h3>
            <p class="text-muted">从上方选择一个分析工具类别开始分析</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近分析记录 -->
    <div class="recent-analyses card shadow-sm rounded-lg">
      <div class="card-header bg-light">
        <h2 class="h5 mb-0">最近分析记录</h2>
      </div>
      <div class="card-body">
        <div class="analysis-records">
          <div class="record-item card bg-light mb-3 p-3" v-for="(record, index) in recentAnalyses" :key="index">
            <div class="d-flex align-items-center gap-3">
              <div class="record-icon fs-3 rounded-circle bg-white w-12 h-12 d-flex align-items-center justify-content-center">
                {{ record.icon }}
              </div>
              <div class="record-content flex-1">
                <div class="record-title font-weight-medium">{{ record.title }}</div>
                <div class="record-meta d-flex gap-3 text-muted small">
                  <span class="record-time">{{ record.time }}</span>
                  <span class="record-category">{{ record.category }}</span>
                </div>
              </div>
              <button class="record-action btn btn-primary btn-sm" @click="viewAnalysisRecord(record)">查看</button>
            </div>
          </div>
          <div v-if="recentAnalyses.length === 0" class="empty-records bg-light p-4 rounded text-center text-muted">
            <p>暂无分析记录</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'AnalysisTools',
  setup() {
    const activeCategory = ref('')

    // 工具分类
    const toolCategories = [
      {
        value: 'route',
        label: '路径规划',
        description: '规划最优出行路线',
        icon: '🗺️'
      },
      {
        value: 'area',
        label: '区域分析',
        description: '分析特定区域的各项指标',
        icon: '📊'
      },
      {
        value: 'terrain',
        label: '地形分析',
        description: '分析地形地貌特征',
        icon: '⛰️'
      },
      {
        value: 'network',
        label: '网络分析',
        description: '分析空间网络关系',
        icon: '🌐'
      }
    ]

    // 当前选中的分类
    const currentCategory = computed(() => {
      return toolCategories.find(category => category.value === activeCategory.value)
    })

    // 路径规划参数
    const routeStart = ref('北京市中心')
    const routeEnd = ref('朝阳区')
    const routeMode = ref('drive')
    const routeResult = ref(null)

    // 区域分析参数
    const areaName = ref('北京市海淀区')
    const areaAnalysisType = ref('population')
    const areaRadius = ref(1000)
    const areaResult = ref(null)

    // 地形分析参数
    const terrainArea = ref('香山公园')
    const terrainAnalysisType = ref('elevation')
    const terrainAccuracy = ref('medium')
    const terrainResult = ref(null)

    // 网络分析参数
    const networkCenter = ref('北京市中心')
    const networkAnalysisType = ref('service')
    const networkParameter = ref(5)
    const networkResult = ref(null)

    // 最近分析记录
    const recentAnalyses = ref([
      {
        title: '北京市中心到朝阳区路线规划',
        category: '路径规划',
        time: '2026-02-04 14:30',
        icon: '🗺️'
      },
      {
        title: '海淀区人口分布分析',
        category: '区域分析',
        time: '2026-02-04 13:15',
        icon: '📊'
      },
      {
        title: '香山公园地形分析',
        category: '地形分析',
        time: '2026-02-04 11:45',
        icon: '⛰️'
      }
    ])

    // 添加分析记录
    const addAnalysisRecord = (title, category, icon) => {
      const newRecord = {
        title,
        category,
        time: new Date().toLocaleString('zh-CN'),
        icon
      }
      recentAnalyses.value.unshift(newRecord)
      // 只保留最近10条记录
      if (recentAnalyses.value.length > 10) {
        recentAnalyses.value = recentAnalyses.value.slice(0, 10)
      }
    }

    // 查看分析记录
    const viewAnalysisRecord = (record) => {
      console.log('查看分析记录:', record)
      alert(`查看分析记录:\n标题: ${record.title}\n类别: ${record.category}\n时间: ${record.time}`)
    }

    // 路径规划计算
    const calculateRoute = () => {
      if (!routeStart.value || !routeEnd.value) {
        alert('请输入起点和终点')
        return
      }

      console.log('计算路线:', {
        start: routeStart.value,
        end: routeEnd.value,
        mode: routeMode.value
      })

      // 模拟路径规划结果
      const modeMap = {
        drive: '驾车',
        walk: '步行',
        bike: '骑行',
        transit: '公交'
      }

      routeResult.value = {
        distance: '12.5 公里',
        duration: '约 30 分钟',
        mode: modeMap[routeMode.value],
        steps: '北京市中心 → 建国门 → 国贸 → 朝阳区'
      }

      // 添加到分析记录
      addAnalysisRecord(`${routeStart.value}到${routeEnd.value}路线规划`, '路径规划', '🗺️')
    }

    // 区域分析
    const analyzeArea = () => {
      if (!areaName.value) {
        alert('请输入分析区域')
        return
      }

      console.log('分析区域:', {
        area: areaName.value,
        type: areaAnalysisType.value,
        radius: areaRadius.value
      })

      // 模拟区域分析结果
      const typeMap = {
        population: '人口分布',
        economy: '经济活力',
        facility: '设施密度',
        environment: '环境质量'
      }

      const score = Math.floor(Math.random() * 20) + 80
      let evaluation
      if (score >= 90) evaluation = '优秀'
      else if (score >= 80) evaluation = '良好'
      else evaluation = '一般'

      areaResult.value = {
        area: areaName.value,
        type: typeMap[areaAnalysisType.value],
        radius: areaRadius.value,
        score,
        evaluation
      }

      // 添加到分析记录
      addAnalysisRecord(`${areaName.value}${typeMap[areaAnalysisType.value]}分析`, '区域分析', '📊')
    }

    // 地形分析
    const analyzeTerrain = () => {
      if (!terrainArea.value) {
        alert('请输入分析区域')
        return
      }

      console.log('分析地形:', {
        area: terrainArea.value,
        type: terrainAnalysisType.value,
        accuracy: terrainAccuracy.value
      })

      // 模拟地形分析结果
      const typeMap = {
        elevation: '高程分析',
        slope: '坡度分析',
        aspect: '坡向分析',
        viewshed: '可视域分析'
      }

      const accuracyMap = {
        low: '低精度',
        medium: '中精度',
        high: '高精度'
      }

      let data
      if (terrainAnalysisType.value === 'elevation') {
        data = `平均海拔 ${Math.floor(Math.random() * 500) + 100} 米`
      } else if (terrainAnalysisType.value === 'slope') {
        data = `平均坡度 ${Math.floor(Math.random() * 30) + 5}°`
      } else if (terrainAnalysisType.value === 'aspect') {
        data = `主要坡向 东南方向`
      } else {
        data = `可视范围 ${Math.floor(Math.random() * 5) + 3} 公里`
      }

      terrainResult.value = {
        area: terrainArea.value,
        type: typeMap[terrainAnalysisType.value],
        accuracy: accuracyMap[terrainAccuracy.value],
        data,
        time: `${Math.floor(Math.random() * 5) + 1} 秒`
      }

      // 添加到分析记录
      addAnalysisRecord(`${terrainArea.value}${typeMap[terrainAnalysisType.value]}`, '地形分析', '⛰️')
    }

    // 网络分析
    const analyzeNetwork = () => {
      if (!networkCenter.value) {
        alert('请输入分析中心点')
        return
      }

      console.log('分析网络:', {
        center: networkCenter.value,
        type: networkAnalysisType.value,
        parameter: networkParameter.value
      })

      // 模拟网络分析结果
      const typeMap = {
        service: '服务范围',
        closest: '最近设施',
        isochrone: '等时圈',
        accessibility: '可达性分析'
      }

      let data, coverage
      if (networkAnalysisType.value === 'service') {
        data = `覆盖 ${Math.floor(Math.random() * 50) + 10} 个设施`
        coverage = `${networkParameter.value} 公里半径`
      } else if (networkAnalysisType.value === 'closest') {
        data = `最近设施距离 ${Math.floor(Math.random() * 500) + 100} 米`
        coverage = '周边 5 公里'
      } else if (networkAnalysisType.value === 'isochrone') {
        data = `${networkParameter.value} 分钟可达范围`
        coverage = `覆盖面积 ${Math.floor(Math.random() * 10) + 5} 平方公里`
      } else {
        data = `可达性评分 ${Math.floor(Math.random() * 20) + 80} 分`
        coverage = '综合评估'
      }

      networkResult.value = {
        center: networkCenter.value,
        type: typeMap[networkAnalysisType.value],
        parameter: networkParameter.value,
        data,
        coverage
      }

      // 添加到分析记录
      addAnalysisRecord(`${networkCenter.value}${typeMap[networkAnalysisType.value]}`, '网络分析', '🌐')
    }

    return {
      activeCategory,
      toolCategories,
      currentCategory,
      routeStart,
      routeEnd,
      routeMode,
      routeResult,
      areaName,
      areaAnalysisType,
      areaRadius,
      areaResult,
      terrainArea,
      terrainAnalysisType,
      terrainAccuracy,
      terrainResult,
      networkCenter,
      networkAnalysisType,
      networkParameter,
      networkResult,
      recentAnalyses,
      calculateRoute,
      analyzeArea,
      analyzeTerrain,
      analyzeNetwork,
      viewAnalysisRecord
    }
  }
}
</script>

<style scoped>
.analysis-tools {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.category-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-card.active .card {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.record-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.record-item:hover {
  transform: translateX(4px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-tools {
    padding: 10px;
  }
}
</style>