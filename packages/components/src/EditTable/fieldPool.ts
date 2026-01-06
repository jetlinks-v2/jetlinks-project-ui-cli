/**
 * 字段注册池 - 复用字段注册对象，避免频繁创建/销毁
 */

interface FieldInfo {
  fieldName: string | number | undefined
  eventKey: string
  names: string | (string | number)[]
  validateRules: () => Promise<any>
  showErrorTip: (msg: string) => void
}

interface PooledField {
  field: FieldInfo
  isActive: boolean
  lastUsed: number
}

class FieldPool {
  private pool: Map<string, PooledField> = new Map()
  private maxSize = 200 // 池的最大大小
  private cleanupThreshold = 150 // 清理阈值
  private cleanupInterval: ReturnType<typeof setTimeout> | null = null

  constructor() {
    // 每 5 秒清理一次不活跃的字段
    this.startCleanup()
  }

  /**
   * 获取或创建字段
   */
  acquire(eventKey: string, fieldInfo: FieldInfo): FieldInfo {
    const pooled = this.pool.get(eventKey)

    if (pooled) {
      // 复用现有字段
      pooled.isActive = true
      pooled.lastUsed = Date.now()
      // 更新字段信息（可能数据变了）
      pooled.field = fieldInfo
      return pooled.field
    }

    // 创建新字段
    const newPooled: PooledField = {
      field: fieldInfo,
      isActive: true,
      lastUsed: Date.now()
    }

    this.pool.set(eventKey, newPooled)

    // 如果池太大，触发清理
    if (this.pool.size > this.maxSize) {
      this.cleanup()
    }

    return fieldInfo
  }

  /**
   * 释放字段（标记为不活跃，但不删除）
   */
  release(eventKey: string) {
    const pooled = this.pool.get(eventKey)
    if (pooled) {
      pooled.isActive = false
      pooled.lastUsed = Date.now()
    }
  }

  /**
   * 清理不活跃的字段
   */
  private cleanup() {
    const now = Date.now()
    const maxAge = 30000 // 30秒未使用的字段会被清理

    // 如果池大小超过阈值，开始清理
    if (this.pool.size < this.cleanupThreshold) {
      return
    }

    const toDelete: string[] = []

    for (const [key, pooled] of this.pool.entries()) {
      // 清理不活跃且长时间未使用的字段
      if (!pooled.isActive && now - pooled.lastUsed > maxAge) {
        toDelete.push(key)
      }
    }

    toDelete.forEach(key => this.pool.delete(key))

    if (toDelete.length > 0) {
      console.debug(`[FieldPool] Cleaned up ${toDelete.length} inactive fields`)
    }
  }

  /**
   * 启动定时清理
   */
  private startCleanup() {
    if (this.cleanupInterval) return

    this.cleanupInterval = setInterval(() => {
      this.cleanup()
    }, 5000)
  }

  /**
   * 停止定时清理
   */
  stopCleanup() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * 清空池
   */
  clear() {
    this.pool.clear()
  }

  /**
   * 获取池的统计信息
   */
  getStats() {
    let activeCount = 0
    let inactiveCount = 0

    for (const pooled of this.pool.values()) {
      if (pooled.isActive) {
        activeCount++
      } else {
        inactiveCount++
      }
    }

    return {
      total: this.pool.size,
      active: activeCount,
      inactive: inactiveCount
    }
  }
}

// 创建全局单例
export const fieldPool = new FieldPool()

// 开发环境下暴露到 window，方便调试
if (import.meta.env.DEV) {
  (window as any).__fieldPool__ = fieldPool
}
