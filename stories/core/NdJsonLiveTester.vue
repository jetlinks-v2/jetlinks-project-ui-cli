<template>
  <div class="ndjson-live-tester">
    <a-row :gutter="16">
      <a-col :xs="24" :lg="14">
        <a-card title="请求" :bordered="false">
          <a-form layout="vertical" :model="form">
            <a-form-item>
              <a-input-group compact class="ndjson-live-tester-request-line">
                <a-select v-model:value="form.method" :options="methodOptions" class="ndjson-live-tester-method" />
                <a-input v-model:value="form.url" class="ndjson-live-tester-url" placeholder="https://api.example.com/api/stream" />
                <a-button @click="openOptionsModal">
                  处理 Options
                </a-button>
                <a-button type="primary" :loading="status === 'running'" @click="sendRequest">
                  Send
                </a-button>
                <a-button danger :disabled="status !== 'running'" @click="cancelRequest">
                  Cancel
                </a-button>
                <a-button @click="clearLogs">
                  Clear
                </a-button>
              </a-input-group>
            </a-form-item>

            <a-row :gutter="12" class="ndjson-live-tester-options">
              <a-col :xs="24" :md="6">
                <a-form-item label="HTTP code">
                  <a-input-number v-model:value="form.code" :min="100" :max="599" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="6">
                <a-form-item label="langKey">
                  <a-input v-model:value="form.langKey" placeholder="lang" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="6">
                <a-form-item label="lang">
                  <a-input v-model:value="form.lang" placeholder="zh-CN" />
                </a-form-item>
              </a-col>
              <a-col :xs="24" :md="6">
                <a-form-item label="filter_url">
                  <a-input v-model:value="form.filterUrl" placeholder="/api/public,/api/auth" />
                </a-form-item>
              </a-col>
            </a-row>

            <a-card size="small" title="Headers" class="ndjson-live-tester-section">
              <template #extra>
                <a-button size="small" type="link" @click="addHeader">
                  添加 Header
                </a-button>
              </template>
              <a-table
                :columns="headerColumns"
                :data-source="headers"
                :pagination="false"
                row-key="id"
                size="small"
              >
                <template #bodyCell="{ column, record }">
                  <a-switch v-if="column.key === 'enabled'" v-model:checked="record.enabled" size="small" />
                  <a-input v-else-if="column.key === 'key'" v-model:value="record.key" placeholder="Header name" />
                  <a-input v-else-if="column.key === 'value'" v-model:value="record.value" placeholder="Header value" />
                  <a-button v-else danger type="link" size="small" @click="removeHeader(record.id)">
                    删除
                  </a-button>
                </template>
              </a-table>
            </a-card>

            <a-form-item v-if="form.method === 'POST'" label="body">
              <a-textarea v-model:value="form.body" :rows="6" />
            </a-form-item>

            <a-alert
              v-if="validationMessage"
              type="error"
              show-icon
              :message="validationMessage"
              class="ndjson-live-tester-alert"
            />
          </a-form>
        </a-card>

        <a-modal
          v-model:open="optionsVisible"
          title="自定义 NdJsonOptions"
          width="760px"
          ok-text="保存"
          cancel-text="关闭"
        >
          <a-alert
            type="info"
            show-icon
            message="填写一个 JavaScript 对象表达式，可包含 handleRequest、handleResponse、requestOptions 等 NdJsonOptions。"
            class="ndjson-live-tester-alert"
          />
          <a-textarea v-model:value="customOptionsText" :rows="14" class="ndjson-live-tester-code" />
          <template #footer>
            <a-space>
              <a-button @click="previewOptions">
                预览 Options
              </a-button>
              <a-button type="primary" @click="optionsVisible = false">
                保存
              </a-button>
            </a-space>
          </template>
        </a-modal>
      </a-col>

      <a-col :xs="24" :lg="10">
        <a-card title="流式日志" :bordered="false">
          <div class="ndjson-live-tester-status">
            <a-badge :status="statusBadge" />
            <span>{{ statusText }}</span>
          </div>
          <pre class="ndjson-live-tester-logs">{{ formattedLogs }}</pre>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { useNdJsonLiveTester } from './useNdJsonLiveTester';

const methodOptions = [
  { label: 'GET', value: 'GET' },
  { label: 'POST', value: 'POST' },
];

const headerColumns = [
  { title: '启用', key: 'enabled', width: 72 },
  { title: 'Key', key: 'key' },
  { title: 'Value', key: 'value' },
  { title: '操作', key: 'action', width: 72 },
];

const {
  form,
  customOptionsText,
  optionsVisible,
  headers,
  status,
  statusText,
  statusBadge,
  formattedLogs,
  validationMessage,
  sendRequest,
  cancelRequest,
  clearLogs,
  openOptionsModal,
  previewOptions,
  addHeader,
  removeHeader,
} = useNdJsonLiveTester();
</script>

<style scoped>
.ndjson-live-tester {
  width: min(1280px, 100%);
  padding: 16px;
}

.ndjson-live-tester-request-line {
  display: flex;
}

.ndjson-live-tester-method {
  width: 108px;
}

.ndjson-live-tester-url {
  flex: 1;
  min-width: 260px;
}

.ndjson-live-tester-options {
  margin-top: 8px;
}

.ndjson-live-tester-section {
  margin-bottom: 16px;
}

.ndjson-live-tester-alert {
  margin-bottom: 16px;
}

.ndjson-live-tester-code {
  font-family: Consolas, Monaco, 'Courier New', monospace;
}

.ndjson-live-tester-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 500;
}

.ndjson-live-tester-logs {
  min-height: 520px;
  max-height: 680px;
  margin: 0;
  padding: 12px;
  overflow: auto;
  white-space: pre-wrap;
  word-break: break-word;
  background: #141414;
  color: #f5f5f5;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.6;
}
</style>
