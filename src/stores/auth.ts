import { defineStore } from 'pinia'
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

export interface RegisteredUser {
  username: string
  password: string
  role: 'operator' | 'viewer'
  createdAt: string
}

export interface User {
  username: string
  role: 'admin' | 'operator' | 'viewer'
  token?: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // 获取注册用户列表
  const getRegisteredUsers = (): RegisteredUser[] => {
    try {
      const usersJson = localStorage.getItem('satops_registered_users')
      return usersJson ? JSON.parse(usersJson) : []
    } catch {
      return []
    }
  }

  // 保存注册用户列表
  const saveRegisteredUsers = (users: RegisteredUser[]) => {
    localStorage.setItem('satops_registered_users', JSON.stringify(users))
  }

  // 从本地存储加载登录状态
  const loadAuth = () => {
    const savedUser = localStorage.getItem('satops_user')
    const savedToken = localStorage.getItem('satops_token')
    
    if (savedUser && savedToken) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  // 注册新用户
  const register = async (username: string, password: string, confirmPassword: string): Promise<boolean> => {
    try {
      if (!username || !password || !confirmPassword) {
        ElMessage.error('请填写完整信息')
        return false
      }

      if (username.trim().toLowerCase() === 'admin') {
        ElMessage.error('不能注册管理员账号')
        return false
      }

      if (password.length < 3) {
        ElMessage.error('密码长度至少3位')
        return false
      }

      if (password !== confirmPassword) {
        ElMessage.error('两次输入的密码不一致')
        return false
      }

      const registeredUsers = getRegisteredUsers()
      
      // 检查用户名是否已存在
      if (registeredUsers.some(u => u.username.toLowerCase() === username.trim().toLowerCase())) {
        ElMessage.error('用户名已存在')
        return false
      }

      // 创建新用户（默认为 viewer 角色）
      const newUser: RegisteredUser = {
        username: username.trim(),
        password: password, // 实际应用中应该加密
        role: 'viewer',
        createdAt: new Date().toISOString()
      }

      registeredUsers.push(newUser)
      saveRegisteredUsers(registeredUsers)

      ElMessage.success('注册成功，请登录')
      return true
    } catch (error: any) {
      console.error('注册错误:', error)
      ElMessage.error('注册失败: ' + (error.message || '未知错误'))
      return false
    }
  }

  // 登录
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      if (!username || !password) {
        ElMessage.error('用户名和密码不能为空')
        return false
      }

      const usernameLower = username.toLowerCase().trim()
      let role: 'admin' | 'operator' | 'viewer' = 'viewer'
      let isValid = false

      // 检查是否是管理员账号
      if (usernameLower === 'admin' && password === 'admin') {
        role = 'admin'
        isValid = true
      } else {
        // 检查注册用户
        const registeredUsers = getRegisteredUsers()
        const foundUser = registeredUsers.find(
          u => u.username.toLowerCase() === usernameLower && u.password === password
        )

        if (foundUser) {
          role = foundUser.role
          isValid = true
        } else {
          ElMessage.error('用户名或密码错误，或账号未注册')
          return false
        }
      }

      if (!isValid) {
        ElMessage.error('用户名或密码错误')
        return false
      }

      const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      user.value = {
        username: username.trim(),
        role,
        token
      }
      
      isAuthenticated.value = true
      
      // 保存到本地存储
      localStorage.setItem('satops_user', JSON.stringify(user.value))
      localStorage.setItem('satops_token', token)
      
      ElMessage.success('登录成功')
      return true
    } catch (error: any) {
      console.error('登录错误:', error)
      ElMessage.error('登录失败: ' + (error.message || '未知错误'))
      return false
    }
  }

  // 登出
  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('satops_user')
    localStorage.removeItem('satops_token')
    ElMessage.success('已退出登录')
  }

  // 初始化时加载认证状态
  loadAuth()

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout,
    loadAuth,
    getRegisteredUsers,
    saveRegisteredUsers
  }
})
