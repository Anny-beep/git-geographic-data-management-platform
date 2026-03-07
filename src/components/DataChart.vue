<template>
  <div class="chart-container">
    <div class="card">
      <div class="card-header bg-light d-flex justify-content-between align-items-center">
        <h3 class="h6 mb-0">{{ title }}</h3>
        <select v-model="selectedDataType" class="form-select form-select-sm w-auto">
          <option v-for="type in dataTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>
      <div class="card-body">
        <div class="data-stats mb-4">
          <div class="row g-3">
            <div class="col-md-3 col-sm-6" v-for="(stat, index) in statistics" :key="index">
              <div class="stat-item bg-light rounded p-3 text-center shadow-sm">
                <div class="stat-value h4 text-primary font-weight-bold">{{ stat.value }}</div>
                <div class="stat-label text-muted small">{{ stat.label }}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="data-table">
          <div class="table-responsive">
            <table class="table table-hover table-sm">
              <thead class="bg-light">
                <tr>
                  <th v-for="column in tableColumns" :key="column.key" class="text-center">
                    {{ column.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in tableData" :key="index">
                  <td v-for="column in tableColumns" :key="column.key" class="text-center">
                    {{ item[column.key] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'DataChart',
  props: {
    title: {
      type: String,
      default: '地理数据统计'
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const selectedDataType = ref('population')

    // 数据类型选项
    const dataTypes = [
      { label: '人口分布', value: 'population' },
      { label: '经济指标', value: 'economy' },
      { label: '交通流量', value: 'traffic' },
      { label: '环境监测', value: 'environment' }
    ]

    // 表格列定义
    const tableColumns = [
      { key: 'name', label: '区域名称' },
      { key: 'value', label: '数据值' },
      { key: 'unit', label: '单位' },
      { key: 'updateTime', label: '更新时间' }
    ]

    // 模拟表格数据
    const tableData = computed(() => {
      if (props.data.length > 0) {
        return props.data
      }

      // 根据选择的数据类型返回不同的数据
      switch (selectedDataType.value) {
        case 'population':
          return [
            { name: '北京市', value: '2189', unit: '万人', updateTime: '2023-12-31' },
            { name: '上海市', value: '2487', unit: '万人', updateTime: '2023-12-31' },
            { name: '广州市', value: '1530', unit: '万人', updateTime: '2023-12-31' },
            { name: '深圳市', value: '1756', unit: '万人', updateTime: '2023-12-31' },
            { name: '杭州市', value: '1220', unit: '万人', updateTime: '2023-12-31' }
          ]
        case 'economy':
          return [
            { name: '北京市', value: '41611', unit: '亿元', updateTime: '2023-12-31' },
            { name: '上海市', value: '43214', unit: '亿元', updateTime: '2023-12-31' },
            { name: '广州市', value: '28232', unit: '亿元', updateTime: '2023-12-31' },
            { name: '深圳市', value: '32388', unit: '亿元', updateTime: '2023-12-31' },
            { name: '杭州市', value: '18753', unit: '亿元', updateTime: '2023-12-31' }
          ]
        case 'traffic':
          return [
            { name: '北京市', value: '892', unit: '万辆/日', updateTime: '2023-12-31' },
            { name: '上海市', value: '956', unit: '万辆/日', updateTime: '2023-12-31' },
            { name: '广州市', value: '783', unit: '万辆/日', updateTime: '2023-12-31' },
            { name: '深圳市', value: '721', unit: '万辆/日', updateTime: '2023-12-31' },
            { name: '杭州市', value: '589', unit: '万辆/日', updateTime: '2023-12-31' }
          ]
        case 'environment':
          return [
            { name: '北京市', value: '78', unit: '分', updateTime: '2023-12-31' },
            { name: '上海市', value: '82', unit: '分', updateTime: '2023-12-31' },
            { name: '广州市', value: '85', unit: '分', updateTime: '2023-12-31' },
            { name: '深圳市', value: '88', unit: '分', updateTime: '2023-12-31' },
            { name: '杭州市', value: '90', unit: '分', updateTime: '2023-12-31' }
          ]
        default:
          return [
            { name: '北京市', value: '2189', unit: '万人', updateTime: '2023-12-31' },
            { name: '上海市', value: '2487', unit: '万人', updateTime: '2023-12-31' },
            { name: '广州市', value: '1530', unit: '万人', updateTime: '2023-12-31' },
            { name: '深圳市', value: '1756', unit: '万人', updateTime: '2023-12-31' },
            { name: '杭州市', value: '1220', unit: '万人', updateTime: '2023-12-31' }
          ]
      }
    })

    // 统计数据
    const statistics = computed(() => {
      const data = tableData.value
      const total = data.reduce((sum, item) => sum + parseFloat(item.value), 0)
      const average = total / data.length
      const max = Math.max(...data.map(item => parseFloat(item.value)))
      const min = Math.min(...data.map(item => parseFloat(item.value)))

      return [
        { label: '总量', value: total.toFixed(1) },
        { label: '平均值', value: average.toFixed(1) },
        { label: '最大值', value: max.toFixed(1) },
        { label: '最小值', value: min.toFixed(1) }
      ]
    })

    // 监听数据类型变化
    watch(selectedDataType, (newType) => {
      console.log('切换数据类型:', newType)
      // 数据类型变化时，tableData和statistics会自动更新
    })

    return {
      selectedDataType,
      dataTypes,
      tableColumns,
      tableData,
      statistics
    }
  }
}
</script>

<style scoped>
.chart-container {
  margin-top: 10px;
}

.stat-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>