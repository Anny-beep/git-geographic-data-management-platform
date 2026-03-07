<template>
  <div class="settings">
    <div class="page-header text-center mb-5 pb-3 border-bottom">
      <h1 class="display-6">系统设置</h1>
      <p class="text-muted">配置平台的各项参数和功能</p>
    </div>

    <!-- 设置导航 -->
    <div class="settings-nav mb-5">
      <ul class="nav nav-tabs">
        <li class="nav-item" v-for="nav in settingsNav" :key="nav.value">
          <a 
            class="nav-link" 
            :class="{ active: activeSettingsTab === nav.value }"
            @click.prevent="activeSettingsTab = nav.value"
          >
            <span class="nav-icon me-2">{{ nav.icon }}</span>
            <span class="nav-label">{{ nav.label }}</span>
          </a>
        </li>
      </ul>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content card shadow-sm rounded-lg">
      <div class="card-header bg-light">
        <h2 class="h5 mb-0">{{ currentNav?.label || '系统设置' }}</h2>
      </div>
      <div class="card-body">
        <!-- 地图设置 -->
        <div v-if="activeSettingsTab === 'map'" class="settings-panel">
          <form class="settings-form">
            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">API 配置</h3>
              <div class="form-group mb-3">
                <label class="form-label">高德地图 API 密钥</label>
                <input 
                  type="text" 
                  v-model="mapSettings.apiKey" 
                  class="form-control"
                  placeholder="输入高德地图 API 密钥"
                />
                <p class="form-text text-muted mt-1">获取 API 密钥: <a href="https://lbs.amap.com/dev/key/app" target="_blank">https://lbs.amap.com/dev/key/app</a></p>
              </div>
            </div>

            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">默认设置</h3>
              <div class="form-group mb-3">
                <label class="form-label">默认中心点</label>
                <div class="coordinate-inputs row g-2">
                  <div class="col">
                    <input 
                      type="number" 
                      v-model="mapSettings.center[0]" 
                      class="form-control"
                      placeholder="经度"
                      step="0.000001"
                    />
                  </div>
                  <div class="col">
                    <input 
                      type="number" 
                      v-model="mapSettings.center[1]" 
                      class="form-control"
                      placeholder="纬度"
                      step="0.000001"
                    />
                  </div>
                </div>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">默认缩放级别</label>
                <input 
                  type="number" 
                  v-model="mapSettings.zoom" 
                  class="form-control"
                  min="1" 
                  max="20"
                  step="1"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">默认地图样式</label>
                <select v-model="mapSettings.mapStyle" class="form-select">
                  <option value="amap://styles/normal">标准地图</option>
                  <option value="amap://styles/dark">暗色地图</option>
                  <option value="amap://styles/light">浅色地图</option>
                  <option value="amap://styles/whitesmoke">白烟地图</option>
                </select>
              </div>
            </div>

            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">控件设置</h3>
              <div class="form-group mb-2">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    v-model="mapSettings.controls.toolBar" 
                    class="form-check-input"
                    id="toolBar"
                  />
                  <label class="form-check-label" for="toolBar">工具栏</label>
                </div>
              </div>
              <div class="form-group mb-2">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    v-model="mapSettings.controls.scale" 
                    class="form-check-input"
                    id="scale"
                  />
                  <label class="form-check-label" for="scale">比例尺</label>
                </div>
              </div>
              <div class="form-group mb-2">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    v-model="mapSettings.controls.hawkEye" 
                    class="form-check-input"
                    id="hawkEye"
                  />
                  <label class="form-check-label" for="hawkEye">鹰眼</label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- 系统设置 -->
        <div v-else-if="activeSettingsTab === 'system'" class="settings-panel">
          <form class="settings-form">
            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">基本设置</h3>
              <div class="form-group mb-3">
                <label class="form-label">平台名称</label>
                <input 
                  type="text" 
                  v-model="systemSettings.platformName" 
                  class="form-control"
                  placeholder="输入平台名称"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">系统语言</label>
                <select v-model="systemSettings.language" class="form-select">
                  <option value="zh-CN">简体中文</option>
                  <option value="en-US">English</option>
                </select>
              </div>
            </div>

            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">外观设置</h3>
              <div class="form-group">
                <label class="form-label">主题设置</label>
                <div class="theme-options row g-3">
                  <div 
                    class="theme-option col-md-4 col-sm-12 border rounded-lg p-3 text-center cursor-pointer"
                    :class="{ active: systemSettings.theme === 'light' }"
                    @click="systemSettings.theme = 'light'"
                  >
                    <div class="theme-preview light w-16 h-16 mx-auto mb-2 rounded border"></div>
                    <span>浅色主题</span>
                  </div>
                  <div 
                    class="theme-option col-md-4 col-sm-12 border rounded-lg p-3 text-center cursor-pointer"
                    :class="{ active: systemSettings.theme === 'dark' }"
                    @click="systemSettings.theme = 'dark'"
                  >
                    <div class="theme-preview dark w-16 h-16 mx-auto mb-2 rounded border"></div>
                    <span>深色主题</span>
                  </div>
                  <div 
                    class="theme-option col-md-4 col-sm-12 border rounded-lg p-3 text-center cursor-pointer"
                    :class="{ active: systemSettings.theme === 'auto' }"
                    @click="systemSettings.theme = 'auto'"
                  >
                    <div class="theme-preview auto w-16 h-16 mx-auto mb-2 rounded border"></div>
                    <span>跟随系统</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">性能设置</h3>
              <div class="form-group mb-3">
                <label class="form-label">数据缓存</label>
                <select v-model="systemSettings.cache" class="form-select">
                  <option value="enabled">启用</option>
                  <option value="disabled">禁用</option>
                </select>
              </div>
              <div class="form-group mb-3">
                <label class="form-label">缓存大小限制 (MB)</label>
                <input 
                  type="number" 
                  v-model="systemSettings.cacheSize" 
                  class="form-control"
                  min="10" 
                  max="500"
                  step="10"
                />
              </div>
            </div>
          </form>
        </div>

        <!-- 用户设置 -->
        <div v-else-if="activeSettingsTab === 'user'" class="settings-panel">
          <form class="settings-form">
            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">用户信息</h3>
              <div class="form-group mb-3">
                <label class="form-label">用户名</label>
                <input 
                  type="text" 
                  v-model="userSettings.username" 
                  class="form-control"
                  placeholder="输入用户名"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">电子邮箱</label>
                <input 
                  type="email" 
                  v-model="userSettings.email" 
                  class="form-control"
                  placeholder="输入电子邮箱"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">联系电话</label>
                <input 
                  type="tel" 
                  v-model="userSettings.phone" 
                  class="form-control"
                  placeholder="输入联系电话"
                />
              </div>
            </div>

            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">密码设置</h3>
              <div class="form-group mb-3">
                <label class="form-label">当前密码</label>
                <input 
                  type="password" 
                  v-model="userSettings.currentPassword" 
                  class="form-control"
                  placeholder="输入当前密码"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">新密码</label>
                <input 
                  type="password" 
                  v-model="userSettings.newPassword" 
                  class="form-control"
                  placeholder="输入新密码"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">确认新密码</label>
                <input 
                  type="password" 
                  v-model="userSettings.confirmPassword" 
                  class="form-control"
                  placeholder="确认新密码"
                />
              </div>
            </div>

            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">通知设置</h3>
              <div class="form-group mb-2">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    v-model="userSettings.notifications.email" 
                    class="form-check-input"
                    id="emailNotification"
                  />
                  <label class="form-check-label" for="emailNotification">邮件通知</label>
                </div>
              </div>
              <div class="form-group mb-2">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    v-model="userSettings.notifications.sms" 
                    class="form-check-input"
                    id="smsNotification"
                  />
                  <label class="form-check-label" for="smsNotification">短信通知</label>
                </div>
              </div>
              <div class="form-group mb-2">
                <div class="form-check">
                  <input 
                    type="checkbox" 
                    v-model="userSettings.notifications.system" 
                    class="form-check-input"
                    id="systemNotification"
                  />
                  <label class="form-check-label" for="systemNotification">系统通知</label>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- API 设置 -->
        <div v-else-if="activeSettingsTab === 'api'" class="settings-panel">
          <form class="settings-form">
            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">API 服务</h3>
              <div class="api-service-item card bg-white p-3 mb-3 border" v-for="(service, index) in apiSettings.services" :key="index">
                <div class="service-header d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom">
                  <h4 class="h6 mb-0">{{ service.name }}</h4>
                  <span 
                    class="service-status badge" 
                    :class="service.enabled ? 'bg-success' : 'bg-danger'"
                  >
                    {{ service.enabled ? '已启用' : '已禁用' }}
                  </span>
                </div>
                <div class="service-config">
                  <div class="form-group mb-3">
                    <label class="form-label">API 地址</label>
                    <input 
                      type="text" 
                      v-model="service.url" 
                      class="form-control"
                      placeholder="输入 API 地址"
                    />
                  </div>
                  <div class="form-group mb-3">
                    <label class="form-label">API 密钥</label>
                    <input 
                      type="text" 
                      v-model="service.apiKey" 
                      class="form-control"
                      placeholder="输入 API 密钥"
                    />
                  </div>
                  <div class="form-group">
                    <div class="form-check">
                      <input 
                        type="checkbox" 
                        v-model="service.enabled" 
                        class="form-check-input"
                        :id="`service-${index}`"
                      />
                      <label class="form-check-label" :for="`service-${index}`">启用此服务</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-section card bg-light p-4 rounded-lg mb-4">
              <h3 class="h6 mb-3 pb-2 border-bottom">API 限制</h3>
              <div class="form-group mb-3">
                <label class="form-label">请求频率限制 (次/分钟)</label>
                <input 
                  type="number" 
                  v-model="apiSettings.rateLimit" 
                  class="form-control"
                  min="1" 
                  max="1000"
                  step="1"
                />
              </div>
              <div class="form-group mb-3">
                <label class="form-label">超时设置 (秒)</label>
                <input 
                  type="number" 
                  v-model="apiSettings.timeout" 
                  class="form-control"
                  min="1" 
                  max="60"
                  step="1"
                />
              </div>
            </div>
          </form>
        </div>

        <!-- 默认提示 -->
        <div v-else class="settings-panel">
          <div class="empty-state d-flex flex-column align-items-center justify-content-center py-10 text-center">
            <div class="empty-icon fs-1 mb-3">⚙️</div>
            <h3 class="h5 mb-2">选择设置类别</h3>
            <p class="text-muted">从上方选择一个设置类别进行配置</p>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="settings-actions d-flex flex-wrap gap-3 justify-content-center mt-5 pt-4 border-top">
          <button class="btn btn-primary" @click="saveSettings">
            <span>💾</span> 保存设置
          </button>
          <button class="btn btn-secondary" @click="resetSettings">
            <span>🔄</span> 重置为默认值
          </button>
          <button class="btn btn-success" @click="importSettings">
            <span>📥</span> 导入设置
          </button>
          <button class="btn btn-danger" @click="exportSettings">
            <span>📤</span> 导出设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue'
import { mapConfig } from '../config/map'

export default {
  name: 'Settings',
  setup() {
    const activeSettingsTab = ref('map')

    // 设置导航
    const settingsNav = [
      {
        value: 'map',
        label: '地图设置',
        icon: '🗺️'
      },
      {
        value: 'system',
        label: '系统设置',
        icon: '⚙️'
      },
      {
        value: 'user',
        label: '用户设置',
        icon: '👤'
      },
      {
        value: 'api',
        label: 'API 设置',
        icon: '🔌'
      }
    ]

    // 当前导航
    const currentNav = ref(settingsNav[0])

    // 地图设置
    const mapSettings = ref({
      apiKey: mapConfig.key,
      center: [...mapConfig.center],
      zoom: mapConfig.zoom,
      mapStyle: mapConfig.mapStyle,
      controls: {
        toolBar: true,
        scale: true,
        hawkEye: true
      }
    })

    // 系统设置
    const systemSettings = ref({
      platformName: '地理信息数据平台',
      language: 'zh-CN',
      theme: 'light',
      cache: 'enabled',
      cacheSize: 100
    })

    // 用户设置
    const userSettings = ref({
      username: 'admin',
      email: 'admin@example.com',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      notifications: {
        email: true,
        sms: false,
        system: true
      }
    })

    // API 设置
    const apiSettings = ref({
      services: [
        {
          name: '高德地图 API',
          url: 'https://restapi.amap.com',
          apiKey: mapConfig.key,
          enabled: true
        },
        {
          name: '自定义数据 API',
          url: '',
          apiKey: '',
          enabled: false
        }
      ],
      rateLimit: 60,
      timeout: 30
    })

    // 从本地存储加载设置
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('geoPlatformSettings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)
          
          // 加载地图设置
          if (parsedSettings.mapSettings) {
            mapSettings.value = { ...mapSettings.value, ...parsedSettings.mapSettings }
            // 确保center是数组
            if (parsedSettings.mapSettings.center) {
              mapSettings.value.center = [...parsedSettings.mapSettings.center]
            }
          }
          
          // 加载系统设置
          if (parsedSettings.systemSettings) {
            systemSettings.value = { ...systemSettings.value, ...parsedSettings.systemSettings }
          }
          
          // 加载用户设置
          if (parsedSettings.userSettings) {
            userSettings.value = { ...userSettings.value, ...parsedSettings.userSettings }
          }
          
          // 加载API设置
          if (parsedSettings.apiSettings) {
            apiSettings.value = { ...apiSettings.value, ...parsedSettings.apiSettings }
          }
          
          console.log('设置已从本地存储加载')
        }
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    }

    // 保存设置到本地存储
    const saveSettingsToLocalStorage = () => {
      try {
        const settings = {
          mapSettings: mapSettings.value,
          systemSettings: systemSettings.value,
          userSettings: {
            ...userSettings.value,
            // 不保存密码信息
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          },
          apiSettings: apiSettings.value
        }
        
        localStorage.setItem('geoPlatformSettings', JSON.stringify(settings, null, 2))
        console.log('设置已保存到本地存储')
      } catch (error) {
        console.error('保存设置失败:', error)
        throw error
      }
    }

    // 保存设置
    const saveSettings = () => {
      try {
        // 验证密码设置
        if (userSettings.value.newPassword) {
          if (userSettings.value.newPassword !== userSettings.value.confirmPassword) {
            alert('两次输入的密码不一致')
            return
          }
        }
        
        // 保存到本地存储
        saveSettingsToLocalStorage()
        
        // 应用主题设置
        applyTheme()
        
        alert('设置已保存')
      } catch (error) {
        console.error('保存设置失败:', error)
        alert('保存设置失败，请重试')
      }
    }

    // 重置设置
    const resetSettings = () => {
      if (confirm('确定要重置为默认设置吗？')) {
        try {
          // 重置地图设置
          mapSettings.value = {
            apiKey: '您的高德地图API密钥',
            center: [116.397428, 39.90923],
            zoom: 13,
            mapStyle: 'amap://styles/normal',
            controls: {
              toolBar: true,
              scale: true,
              hawkEye: true
            }
          }
          
          // 重置系统设置
          systemSettings.value = {
            platformName: '地理信息数据平台',
            language: 'zh-CN',
            theme: 'light',
            cache: 'enabled',
            cacheSize: 100
          }
          
          // 重置用户设置
          userSettings.value = {
            username: 'admin',
            email: 'admin@example.com',
            phone: '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
            notifications: {
              email: true,
              sms: false,
              system: true
            }
          }
          
          // 重置API设置
          apiSettings.value = {
            services: [
              {
                name: '高德地图 API',
                url: 'https://restapi.amap.com',
                apiKey: '您的高德地图API密钥',
                enabled: true
              },
              {
                name: '自定义数据 API',
                url: '',
                apiKey: '',
                enabled: false
              }
            ],
            rateLimit: 60,
            timeout: 30
          }
          
          // 保存重置后的设置
          saveSettingsToLocalStorage()
          
          // 应用主题设置
          applyTheme()
          
          alert('设置已重置为默认值')
        } catch (error) {
          console.error('重置设置失败:', error)
          alert('重置设置失败，请重试')
        }
      }
    }

    // 导出设置
    const exportSettings = () => {
      try {
        const settings = {
          mapSettings: mapSettings.value,
          systemSettings: systemSettings.value,
          userSettings: {
            ...userSettings.value,
            // 不导出密码信息
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          },
          apiSettings: apiSettings.value
        }
        
        const blob = new Blob([JSON.stringify(settings, null, 2)], {
          type: 'application/json'
        })
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `settings-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
        
        alert('设置已导出')
      } catch (error) {
        console.error('导出设置失败:', error)
        alert('导出设置失败，请重试')
      }
    }

    // 导入设置
    const importSettings = () => {
      try {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = '.json'
        
        input.onchange = (e) => {
          const file = e.target.files[0]
          if (file) {
            const reader = new FileReader()
            
            reader.onload = (event) => {
              try {
                const importedSettings = JSON.parse(event.target.result)
                
                // 验证导入的数据结构
                if (!importedSettings.mapSettings || !importedSettings.systemSettings) {
                  alert('导入的设置文件格式不正确')
                  return
                }
                
                // 应用导入的设置
                if (importedSettings.mapSettings) {
                  mapSettings.value = { ...mapSettings.value, ...importedSettings.mapSettings }
                  if (importedSettings.mapSettings.center) {
                    mapSettings.value.center = [...importedSettings.mapSettings.center]
                  }
                }
                
                if (importedSettings.systemSettings) {
                  systemSettings.value = { ...systemSettings.value, ...importedSettings.systemSettings }
                }
                
                if (importedSettings.userSettings) {
                  userSettings.value = { ...userSettings.value, ...importedSettings.userSettings }
                }
                
                if (importedSettings.apiSettings) {
                  apiSettings.value = { ...apiSettings.value, ...importedSettings.apiSettings }
                }
                
                // 保存导入的设置
                saveSettingsToLocalStorage()
                
                // 应用主题设置
                applyTheme()
                
                alert('设置已导入')
              } catch (error) {
                console.error('解析设置文件失败:', error)
                alert('解析设置文件失败，请确保文件格式正确')
              }
            }
            
            reader.onerror = () => {
              alert('读取文件失败')
            }
            
            reader.readAsText(file)
          }
        }
        
        input.click()
      } catch (error) {
        console.error('导入设置失败:', error)
        alert('导入设置失败，请重试')
      }
    }

    // 应用主题设置
    const applyTheme = () => {
      const theme = systemSettings.value.theme
      
      // 移除现有的主题类
      document.body.classList.remove('theme-light', 'theme-dark')
      
      if (theme === 'dark') {
        document.body.classList.add('theme-dark')
      } else if (theme === 'auto') {
        // 检测系统主题
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        if (prefersDark) {
          document.body.classList.add('theme-dark')
        } else {
          document.body.classList.add('theme-light')
        }
      } else {
        document.body.classList.add('theme-light')
      }
    }

    // 监听设置变化
    watch(
      [mapSettings, systemSettings, userSettings, apiSettings],
      () => {
        // 可以在这里添加实时预览逻辑
      },
      { deep: true }
    )

    // 初始化
    onMounted(() => {
      // 加载保存的设置
      loadSettings()
      
      // 应用主题
      applyTheme()
      
      // 监听系统主题变化
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (systemSettings.value.theme === 'auto') {
          applyTheme()
        }
      })
    })

    return {
      activeSettingsTab,
      settingsNav,
      currentNav,
      mapSettings,
      systemSettings,
      userSettings,
      apiSettings,
      saveSettings,
      resetSettings,
      exportSettings,
      importSettings
    }
  }
}
</script>

<style scoped>
.settings {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.theme-option {
  transition: all 0.3s ease;
}

.theme-option:hover {
  border-color: #007bff;
}

.theme-option.active {
  border-color: #007bff;
  background-color: #e3f2fd;
}

.theme-preview.light {
  background: white;
}

.theme-preview.dark {
  background: #333;
}

.theme-preview.auto {
  background: linear-gradient(90deg, white 50%, #333 50%);
}

.cursor-pointer {
  cursor: pointer;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .settings {
    padding: 10px;
  }
}
</style>