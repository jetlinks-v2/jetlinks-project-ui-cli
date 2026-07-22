import { computed, reactive, ref, shallowRef } from 'vue';
import { createNdJson } from '../../packages/core/src/fetch';
import type { NdJson, NdJsonOptions } from '../../packages/core/src/fetch';
import {
  formatLog,
  normalizeError,
  parseFilterUrl,
  parseHeaders,
  parseOptionsExpression,
  parseJsonRecord,
  toHeaderObject,
} from './ndJsonLiveTesterUtils';
import type { HeaderItem, LogItem } from './ndJsonLiveTesterUtils';

type RequestMethod = 'GET' | 'POST';
type RequestStatus = 'idle' | 'running' | 'completed' | 'error' | 'canceled';
type LogType = LogItem['type'];
type RequestSubscription = { unsubscribe: () => void };

interface RequestForm {
  url: string;
  method: RequestMethod;
  code: number;
  langKey: string;
  lang: string;
  filterUrl: string;
  body: string;
}

export const useNdJsonLiveTester = () => {
  const form = reactive<RequestForm>({
    url: '/api/stream',
    method: 'GET',
    code: 200,
    langKey: 'lang',
    lang: '',
    filterUrl: '',
    body: '{\n  "message": "hello"\n}',
  });
  const customOptionsText = ref(`{
  handleRequest(config) {
    return config;
  }
}`);
  const optionsVisible = ref(false);
  const headers = ref<HeaderItem[]>([
    { id: 1, enabled: true, key: 'Accept', value: 'application/x-ndjson' },
  ]);
  const nextHeaderId = ref(2);

  const status = ref<RequestStatus>('idle');
  const validationMessage = ref('');
  const logs = ref<LogItem[]>([]);
  const subscription = shallowRef<RequestSubscription>();
  const client = shallowRef<NdJson>();

  const statusText = computed(() => status.value);
  const statusBadge = computed(() => statusBadgeMap[status.value]);
  const formattedLogs = computed(() => logs.value.map(formatLog).join('\n\n'));

  const sendRequest = () => {
    validationMessage.value = '';

    const config = buildRequestConfig(form, headers.value, customOptionsText.value, validationMessage);
    if (!config) {
      return;
    }

    cancelActiveRequest(false);
    applyLangConfig(form);

    status.value = 'running';
    logs.value = [];
    addLog(logs, 'request', config.summary);

    const nextClient = createNdJson(config.options);
    client.value = nextClient;

    const request = form.method === 'POST'
      ? nextClient.post(form.url.trim(), config.body, config.extra)
      : nextClient.get(form.url.trim(), '{}', config.extra);

    subscription.value = request.subscribe({
      next: data => addLog(logs, 'next', data),
      error: error => {
        status.value = 'error';
        addLog(logs, 'error', normalizeError(error));
        clearActiveRequest();
      },
      complete: () => {
        status.value = 'completed';
        addLog(logs, 'complete', '请求完成');
        clearActiveRequest();
      },
    });
  };

  const cancelActiveRequest = (markCanceled: boolean) => {
    subscription.value?.unsubscribe();
    client.value?.cancelAll();
    clearActiveRequest();

    if (markCanceled) {
      status.value = 'canceled';
      addLog(logs, 'cancel', '请求已取消');
    }
  };

  const clearActiveRequest = () => {
    subscription.value = undefined;
    client.value = undefined;
  };

  const cancelRequest = () => cancelActiveRequest(true);

  const clearLogs = () => {
    logs.value = [];
    validationMessage.value = '';
  };

  const openOptionsModal = () => {
    validationMessage.value = '';
    optionsVisible.value = true;
  };

  const previewOptions = () => {
    validationMessage.value = '';

    const config = buildRequestConfig(form, headers.value, customOptionsText.value, validationMessage, false);
    if (!config) {
      return;
    }

    addLog(logs, 'options', config.summary);
  };

  const addHeader = () => {
    headers.value = [
      ...headers.value,
      {
        id: nextHeaderId.value,
        enabled: true,
        key: '',
        value: '',
      },
    ];
    nextHeaderId.value += 1;
  };

  const removeHeader = (id: number) => {
    headers.value = headers.value.filter(item => item.id !== id);
  };

  return {
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
  };
};

const statusBadgeMap: Record<RequestStatus, 'default' | 'processing' | 'success' | 'error' | 'warning'> = {
  idle: 'default',
  running: 'processing',
  completed: 'success',
  error: 'error',
  canceled: 'warning',
};

const buildRequestConfig = (
  form: RequestForm,
  headerItems: HeaderItem[],
  customOptionsText: string,
  validationMessage: { value: string },
  validateBody = true,
) => {
  const url = form.url.trim();
  if (!url) {
    validationMessage.value = '请输入 url';
    return;
  }

  const emptyHeaderIndex = headerItems.findIndex(item => item.enabled && !item.key.trim());
  if (emptyHeaderIndex !== -1) {
    validationMessage.value = `第 ${emptyHeaderIndex + 1} 行 Header Key 不能为空`;
    return;
  }

  const headers = parseHeaders(headerItems);
  const customOptions = parseOptionsExpression(customOptionsText, validationMessage);
  if (!customOptions) {
    return;
  }

  const body = validateBody && form.method === 'POST'
    ? parseJsonRecord(form.body, 'body', validationMessage)
    : undefined;
  if (validateBody && form.method === 'POST' && !body) {
    return;
  }

  const options: NdJsonOptions = {
    ...customOptions,
    code: form.code,
    langKey: form.langKey.trim() || 'lang',
    filter_url: parseFilterUrl(form.filterUrl),
    handleRequest: config => {
      const nextConfig = {
        ...config,
        headers: {
          ...toHeaderObject(config.headers),
          ...headers,
        },
      };
      const customHandleRequest = customOptions.handleRequest;
      return typeof customHandleRequest === 'function'
        ? customHandleRequest(nextConfig)
        : nextConfig;
    },
  };

  const extra: RequestInit = {};

  return {
    body,
    extra,
    options,
    summary: {
      url,
      method: form.method,
      code: options.code,
      langKey: options.langKey,
      filter_url: options.filter_url,
      headers,
      body: validateBody ? body : '(发送请求时处理 body)',
      customOptions: Object.keys(customOptions),
    },
  };
};

const applyLangConfig = (form: RequestForm) => {
  const langKey = form.langKey.trim() || 'lang';
  const lang = form.lang.trim();
  if (lang) {
    localStorage.setItem(langKey, lang);
  } else {
    localStorage.removeItem(langKey);
  }
};

const addLog = (logs: { value: LogItem[] }, type: LogType, data: unknown) => {
  logs.value = [
    ...logs.value,
    {
      time: new Date().toLocaleTimeString(),
      type,
      data,
    },
  ];
};
