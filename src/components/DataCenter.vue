<template>
  <div class="data-center">
    <div class="page-header text-center mb-5 pb-3 border-bottom">
      <h1 class="display-6">数据中心</h1>
      <p class="text-muted">管理和分析地理信息数据</p>
    </div>

    <!-- 数据概览 -->
    <div class="data-overview mb-5">
      <div class="row g-4">
        <div class="col-md-3 col-sm-6" v-for="(stat, index) in dataOverview" :key="index">
          <div class="overview-card card shadow-sm rounded-lg p-4">
            <div class="d-flex align-items-center gap-4">
              <div class="overview-icon rounded-circle d-flex align-items-center justify-content-center" :style="{ backgroundColor: stat.color + '20', width: '48px', height: '48px' }">
                <span :style="{ color: stat.color, fontSize: '20px' }">{{ stat.icon }}</span>
              </div>
              <div class="overview-content">
                <div class="overview-value h5 font-weight-bold">{{ stat.value }}</div>
                <div class="overview-label text-muted small">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据管理 -->
    <div class="data-management card shadow-sm rounded-lg mb-5">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <h2 class="h5 mb-0">数据管理</h2>
        <div class="section-actions d-flex gap-2">
          <button class="btn btn-primary btn-sm" @click="importData">
            <span>+</span> 导入数据
          </button>
          <button class="btn btn-secondary btn-sm" @click="exportData">
            <span>⬇</span> 导出数据
          </button>
        </div>
      </div>

      <div class="card-body">
        <div class="data-tabs mb-4">
          <ul class="nav nav-tabs">
            <li class="nav-item" v-for="tab in dataTabs" :key="tab.value">
              <a 
                class="nav-link" 
                :class="{ active: activeDataTab === tab.value }"
                @click.prevent="activeDataTab = tab.value"
              >
                {{ tab.label }}
              </a>
            </li>
          </ul>
        </div>

        <div class="data-table-container">
          <div class="table-responsive">
            <table class="data-table table table-hover">
              <thead class="bg-light">
                <tr>
                  <th>数据名称</th>
                  <th>数据类型</th>
                  <th>数据量</th>
                  <th>更新时间</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in dataList" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.size }}</td>
                  <td>{{ item.updateTime }}</td>
                  <td>
                    <span 
                      class="status-badge badge" 
                      :class="{
                        'bg-success': item.status === 'normal',
                        'bg-warning': item.status === 'warning',
                        'bg-danger': item.status === 'error'
                      }"
                    >
                      {{ item.statusText }}
                    </span>
                  </td>
                  <td>
                    <div class="action-buttons d-flex gap-2">
                      <button class="action-btn btn btn-primary btn-sm" @click="viewData(item)">查看</button>
                      <button class="action-btn btn btn-warning btn-sm" @click="editData(item, index)">编辑</button>
                      <button class="action-btn btn btn-danger btn-sm" @click="deleteData(item, index)">删除</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据可视化 -->
    <div class="data-visualization card shadow-sm rounded-lg">
      <div class="card-header bg-light">
        <h2 class="h5 mb-0">数据可视化</h2>
      </div>
      <div class="card-body">
        <div class="visualization-cards row g-4">
          <div class="visualization-card col-md-4 col-sm-12">
            <div class="card h-100">
              <div class="card-body p-0">
                <div class="p-3 border-bottom">
                  <h3 class="h6 mb-0">数据类型分布</h3>
                </div>
                <div class="p-4">
                  <div 
                    ref="typeChartRef" 
                    class="chart-container border rounded-lg p-3 bg-light"
                    style="width: 100%; height: 250px;"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="visualization-card col-md-4 col-sm-12">
            <div class="card h-100">
              <div class="card-body p-0">
                <div class="p-3 border-bottom">
                  <h3 class="h6 mb-0">数据状态分布</h3>
                </div>
                <div class="p-4">
                  <div 
                    ref="statusChartRef" 
                    class="chart-container border rounded-lg p-3 bg-light"
                    style="width: 100%; height: 250px;"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="visualization-card col-md-4 col-sm-12">
            <div class="card h-100">
              <div class="card-body p-0">
                <div class="p-3 border-bottom">
                  <h3 class="h6 mb-0">数据更新趋势</h3>
                </div>
                <div class="p-4">
                  <div 
                    ref="updateChartRef" 
                    class="chart-container border rounded-lg p-3 bg-light"
                    style="width: 100%; height: 250px;"
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useDataStore } from '../stores/dataStore'
import * as echarts from 'echarts'
import { debounce, throttle } from '../utils/debounce'

export default {
  name: 'DataCenter',
  setup() {
    const activeDataTab = ref('all')
    const dataStore = useDataStore()
    const typeChartRef = ref(null)
    const statusChartRef = ref(null)
    const updateChartRef = ref(null)
    let typeChart = null
    let statusChart = null
    let updateChart = null

    // 数据概览
    const dataOverview = computed(() => dataStore.dataOverview)

    // 数据标签页
    const dataTabs = computed(() => dataStore.dataTabs)

    // 筛选后的数据列表
    const filteredDataList = computed(() => {
      return dataStore.filteredDataList(activeDataTab.value)
    })

    // 数据类型分布
    const dataByTypeArray = computed(() => {
      const dataByType = dataStore.dataByType
      return Object.entries(dataByType).map(([type, count]) => ({
        type,
        count
      })).sort((a, b) => b.count - a.count)
    })

    // 总数据量
    const totalDataCount = computed(() => {
      return dataByTypeArray.value.reduce((sum, item) => sum + item.count, 0)
    })

    // 数据状态分布
    const dataStatusArray = computed(() => {
      const statusMap = {}
      dataStore.dataList.forEach(item => {
        if (!statusMap[item.status]) {
          statusMap[item.status] = {
            status: item.status,
            statusText: item.statusText,
            count: 0
          }
        }
        statusMap[item.status].count++
      })
      return Object.values(statusMap)
    })

    // 数据更新趋势
    const dataUpdateArray = computed(() => {
      const dateMap = {}
      dataStore.dataList.forEach(item => {
        if (!dateMap[item.updateTime]) {
          dateMap[item.updateTime] = 0
        }
        dateMap[item.updateTime]++
      })
      return Object.entries(dateMap)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    })

    // 最大更新计数
    const maxUpdateCount = computed(() => {
      return Math.max(...dataUpdateArray.value.map(item => item.count), 1)
    })

    // 获取类型颜色
    const getTypeColor = (type) => {
      const colorMap = {
        '人口数据': '#409eff',
        '经济数据': '#67c23a',
        '交通数据': '#e6a23c',
        '环境数据': '#f56c6c',
        '规划数据': '#909399',
        '地理数据': '#722ed1',
        '表格数据': '#13c2c2'
      }
      return colorMap[type] || '#909399'
    }

    // 获取状态颜色
    const getStatusColor = (status) => {
      const colorMap = {
        'normal': '#67c23a',
        'warning': '#e6a23c',
        'error': '#f56c6c'
      }
      return colorMap[status] || '#909399'
    }

    // 初始化类型分布图表
    const initTypeChart = () => {
      if (typeChartRef.value) {
        typeChart = echarts.init(typeChartRef.value)
        updateTypeChart()
      }
    }

    // 更新类型分布图表（使用防抖优化）
    const updateTypeChart = debounce(() => {
      if (!typeChart) return
      
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: {
            color: '#333'
          }
        },
        series: [
          {
            name: '数据类型',
            type: 'pie',
            radius: '60%',
            data: dataByTypeArray.value.map(item => ({
              name: item.type,
              value: item.count
            })),
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            },
            itemStyle: {
              color: function(params) {
                return getTypeColor(params.name)
              }
            }
          }
        ]
      }
      
      typeChart.setOption(option)
    }, 300)

    // 初始化状态分布图表
    const initStatusChart = () => {
      if (statusChartRef.value) {
        statusChart = echarts.init(statusChartRef.value)
        updateStatusChart()
      }
    }

    // 更新状态分布图表（使用防抖优化）
    const updateStatusChart = debounce(() => {
      if (!statusChart) return
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dataStatusArray.value.map(item => item.statusText),
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '数据量',
            type: 'bar',
            data: dataStatusArray.value.map(item => ({
              value: item.count,
              itemStyle: {
                color: getStatusColor(item.status)
              }
            })),
            barWidth: '60%'
          }
        ]
      }
      
      statusChart.setOption(option)
    }, 300)

    // 初始化更新趋势图表
    const initUpdateChart = () => {
      if (updateChartRef.value) {
        updateChart = echarts.init(updateChartRef.value)
        updateUpdateChart()
      }
    }

    // 更新更新趋势图表（使用防抖优化）
    const updateUpdateChart = debounce(() => {
      if (!updateChart) return
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: dataUpdateArray.value.map(item => item.date),
          axisLabel: {
            interval: 0,
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '更新数量',
            type: 'line',
            data: dataUpdateArray.value.map(item => item.count),
            smooth: true,
            itemStyle: {
              color: '#409eff'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(64, 158, 255, 0.5)'
                },
                {
                  offset: 1,
                  color: 'rgba(64, 158, 255, 0.1)'
                }
              ])
            }
          }
        ]
      }
      
      updateChart.setOption(option)
    }, 300)

    // 监听数据变化
    watch(
      () => dataByTypeArray.value,
      () => updateTypeChart(),
      { deep: true }
    )

    watch(
      () => dataStatusArray.value,
      () => updateStatusChart(),
      { deep: true }
    )

    watch(
      () => dataUpdateArray.value,
      () => updateUpdateChart(),
      { deep: true }
    )

    // 组件挂载后初始化图表
    onMounted(() => {
      initTypeChart()
      initStatusChart()
      initUpdateChart()

      // 响应式调整
      window.addEventListener('resize', () => {
        typeChart?.resize()
        statusChart?.resize()
        updateChart?.resize()
      })
    })

    // 导入数据功能（使用节流优化）
    const importData = throttle(async () => {
      // 创建文件输入元素
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.csv,.json,.xlsx,.geojson'
      
      input.onchange = async (e) => {
        const file = e.target.files[0]
        if (file) {
          console.log('导入文件:', file)
          
          try {
            const result = await dataStore.importData(file)
            alert(result.message)
          } catch (error) {
            console.error('文件解析错误:', error)
            alert(error.message)
          }
        }
      }
      
      input.click()
    }, 1000)

    // 导出数据功能（使用节流优化）
    const exportData = throttle(() => {
      dataStore.exportData()
      alert('数据导出成功')
    }, 1000)

    // 查看数据功能
    const viewData = (item) => {
      console.log('查看数据:', item)
      alert(`查看数据: ${item.name}\n类型: ${item.type}\n大小: ${item.size}\n更新时间: ${item.updateTime}\n状态: ${item.statusText}`)
    }

    // 编辑数据功能（使用节流优化）
    const editData = throttle((item, index) => {
      console.log('编辑数据:', item, index)
      const newName = prompt('请输入新的数据名称:', item.name)
      if (newName && newName.trim() !== '') {
        const updatedData = {
          name: newName.trim()
        }
        
        // 允许编辑其他字段
        const newType = prompt('请输入新的数据类型:', item.type)
        if (newType && newType.trim() !== '') {
          updatedData.type = newType.trim()
        }
        
        const newSize = prompt('请输入新的文件大小:', item.size)
        if (newSize && newSize.trim() !== '') {
          updatedData.size = newSize.trim()
        }
        
        updatedData.status = 'normal'
        updatedData.statusText = '正常'
        
        const success = dataStore.updateData(index, updatedData)
        if (success) {
          alert('数据编辑成功')
        } else {
          alert('数据编辑失败')
        }
      }
    }, 500)

    // 删除数据功能（使用节流优化）
    const deleteData = throttle((item, index) => {
      if (confirm(`确定要删除数据: ${item.name}吗？`)) {
        const success = dataStore.deleteData(index)
        if (success) {
          alert('数据删除成功')
        } else {
          alert('数据删除失败')
        }
      }
    }, 500)

    return {
      activeDataTab,
      dataOverview,
      dataTabs,
      dataList: filteredDataList,
      dataByTypeArray,
      totalDataCount,
      dataStatusArray,
      dataUpdateArray,
      maxUpdateCount,
      getTypeColor,
      getStatusColor,
      typeChartRef,
      statusChartRef,
      updateChartRef,
      importData,
      exportData,
      viewData,
      editData,
      deleteData
    }
  }
}
</script>

<style scoped>
.data-center {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.overview-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.visualization-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.visualization-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .data-center {
    padding: 10px;
  }
}
</style>