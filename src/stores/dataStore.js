import { defineStore } from 'pinia'

// 数据管理的store
export const useDataStore = defineStore('data', {
  state: () => ({
    // 数据概览
    dataOverview: [
      { icon: '📊', value: '1,245', label: '数据集', color: '#409eff' },
      { icon: '📍', value: '8,762', label: '地理点位', color: '#67c23a' },
      { icon: '📅', value: '32', label: '最近更新', color: '#e6a23c' },
      { icon: '🔍', value: '98%', label: '数据质量', color: '#f56c6c' }
    ],

    // 数据标签页
    dataTabs: [
      { label: '全部数据', value: 'all' },
      { label: '人口数据', value: 'population' },
      { label: '经济数据', value: 'economy' },
      { label: '交通数据', value: 'traffic' },
      { label: '环境数据', value: 'environment' }
    ],

    // 数据列表
    dataList: [
      {
        name: '北京市人口分布',
        type: '人口数据',
        size: '1.2 MB',
        updateTime: '2026-02-01',
        status: 'normal',
        statusText: '正常'
      },
      {
        name: '上海市经济指标',
        type: '经济数据',
        size: '856 KB',
        updateTime: '2026-02-02',
        status: 'normal',
        statusText: '正常'
      },
      {
        name: '广州市交通流量',
        type: '交通数据',
        size: '2.3 MB',
        updateTime: '2026-02-03',
        status: 'warning',
        statusText: '需要更新'
      },
      {
        name: '深圳市环境监测',
        type: '环境数据',
        size: '1.8 MB',
        updateTime: '2026-02-04',
        status: 'normal',
        statusText: '正常'
      },
      {
        name: '杭州市城市规划',
        type: '规划数据',
        size: '3.1 MB',
        updateTime: '2026-01-30',
        status: 'error',
        statusText: '数据异常'
      }
    ]
  }),

  getters: {
    // 筛选后的数据列表
    filteredDataList: (state) => (tab) => {
      if (tab === 'all') {
        return state.dataList
      } else {
        const typeMap = {
          population: '人口数据',
          economy: '经济数据',
          traffic: '交通数据',
          environment: '环境数据'
        }
        const targetType = typeMap[tab]
        return state.dataList.filter(item => item.type === targetType)
      }
    },

    // 按类型统计数据数量
    dataByType: (state) => {
      const stats = {}
      state.dataList.forEach(item => {
        if (!stats[item.type]) {
          stats[item.type] = 0
        }
        stats[item.type]++
      })
      return stats
    }
  },

  actions: {
    // 添加数据
    addData(data) {
      const newItem = {
        name: data.name,
        type: data.type,
        size: data.size || '0 KB',
        updateTime: data.updateTime || new Date().toISOString().split('T')[0],
        status: data.status || 'normal',
        statusText: data.statusText || '正常'
      }
      this.dataList.push(newItem)
      return newItem
    },

    // 更新数据
    updateData(index, data) {
      if (this.dataList[index]) {
        this.dataList[index] = {
          ...this.dataList[index],
          ...data,
          updateTime: new Date().toISOString().split('T')[0]
        }
        return true
      }
      return false
    },

    // 删除数据
    deleteData(index) {
      if (this.dataList[index]) {
        this.dataList.splice(index, 1)
        return true
      }
      return false
    },

    // 导入数据
    importData(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (event) => {
          try {
            if (file.name.endsWith('.json') || file.name.endsWith('.geojson')) {
              // 解析JSON文件
              const parsedData = JSON.parse(event.target.result)
              
              // 如果是GeoJSON格式，转换为数据集格式
              if (parsedData.type === 'FeatureCollection') {
                const newItem = {
                  name: file.name.replace('.geojson', ''),
                  type: '地理数据',
                  size: (JSON.stringify(parsedData).length / 1024).toFixed(2) + ' KB',
                  updateTime: new Date().toISOString().split('T')[0],
                  status: 'normal',
                  statusText: '正常'
                }
                this.addData(newItem)
                resolve({ success: true, message: `成功导入GeoJSON数据: ${file.name}`, data: newItem })
              } else if (Array.isArray(parsedData)) {
                // 如果是数据数组，批量添加
                const addedItems = []
                parsedData.forEach((item) => {
                  if (item.name && item.type) {
                    addedItems.push(this.addData(item))
                  }
                })
                resolve({ success: true, message: `成功导入JSON数据: ${file.name}\n添加了 ${addedItems.length} 个数据集`, data: addedItems })
              } else {
                resolve({ success: true, message: `成功导入文件: ${file.name}\n文件已就绪`, data: parsedData })
              }
            } else if (file.name.endsWith('.csv')) {
              // 解析CSV文件
              const csvContent = event.target.result
              const lines = csvContent.split('\n')
              const headers = lines[0].split(',')
              const data = []
              
              for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim()) {
                  const values = lines[i].split(',')
                  const row = {}
                  headers.forEach((header, index) => {
                    row[header.trim()] = values[index]?.trim()
                  })
                  data.push(row)
                }
              }
              
              if (data.length > 0) {
                const newItem = {
                  name: file.name.replace('.csv', ''),
                  type: '表格数据',
                  size: (csvContent.length / 1024).toFixed(2) + ' KB',
                  updateTime: new Date().toISOString().split('T')[0],
                  status: 'normal',
                  statusText: '正常'
                }
                this.addData(newItem)
                resolve({ success: true, message: `成功导入CSV数据: ${file.name}\n包含 ${data.length} 条记录`, data: newItem })
              } else {
                resolve({ success: true, message: `成功导入文件: ${file.name}\n文件为空`, data: [] })
              }
            } else {
              // 其他文件类型
              resolve({ success: true, message: `成功导入文件: ${file.name}\n文件大小: ${(file.size / 1024).toFixed(2)} KB`, data: null })
            }
          } catch (error) {
            console.error('文件解析错误:', error)
            reject(new Error(`文件解析失败: ${error.message}`))
          }
        }
        
        reader.onerror = () => {
          reject(new Error('文件读取失败'))
        }
        
        reader.readAsText(file)
      })
    },

    // 导出数据
    exportData() {
      const exportData = {
        timestamp: new Date().toISOString(),
        data: this.dataList,
        total: this.dataList.length,
        overview: this.dataOverview
      }
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `geodata-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      return exportData
    },

    // 清空所有数据
    clearData() {
      this.dataList = []
    },

    // 批量导入数据
    importMultipleData(files) {
      const promises = files.map(file => this.importData(file))
      return Promise.all(promises)
    }
  }
})
