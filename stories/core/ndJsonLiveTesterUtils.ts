export interface HeaderItem {
  id: number;
  enabled: boolean;
  key: string;
  value: string;
}

export interface LogItem {
  time: string;
  type: 'options' | 'request' | 'next' | 'error' | 'complete' | 'cancel';
  data: unknown;
}

export const parseOptionsExpression = (
  value: string,
  validationMessage: { value: string },
): Record<string, unknown> | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return {};
  }

  try {
    const parsed = Function(`"use strict"; return (${trimmed});`)();
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    validationMessage.value = '自定义 options 必须返回对象';
  } catch (error) {
    validationMessage.value = `自定义 options 解析失败：${normalizeError(error)}`;
  }
};

export const parseJsonRecord = (
  value: string,
  label: string,
  validationMessage: { value: string },
): Record<string, unknown> | undefined => {
  const trimmed = value.trim();
  if (!trimmed) {
    return {};
  }

  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    validationMessage.value = `${label} 必须是 JSON 对象`;
  } catch (error) {
    validationMessage.value = `${label} JSON 解析失败：${normalizeError(error)}`;
  }
};

export const parseFilterUrl = (value: string) => value
  .split(',')
  .map(item => item.trim())
  .filter(Boolean);

export const parseHeaders = (headers: HeaderItem[]): Record<string, string> => {
  return headers.reduce<Record<string, string>>((result, item) => {
    const key = item.key.trim();
    if (item.enabled && key) {
      result[key] = item.value;
    }
    return result;
  }, {});
};

export const toHeaderObject = (headers?: HeadersInit): Record<string, string> => {
  const headerMap = new Map<string, { key: string; value: string }>();
  if (!headers) {
    return {};
  }

  new Headers(headers).forEach((value, key) => {
    headerMap.set(key.toLowerCase(), { key, value });
  });

  if (typeof headers === 'object') {
    Object.entries(headers).forEach(([key, value]) => {
      if (typeof value !== 'undefined') {
        headerMap.set(key.toLowerCase(), { key, value: String(value) });
      }
    });
  }

  return Array.from(headerMap.values()).reduce<Record<string, string>>((result, item) => {
    result[item.key] = item.value;
    return result;
  }, {});
};

export const formatLog = (item: LogItem) => {
  return `[${item.time}] ${item.type}\n${formatData(item.data)}`;
};

export const formatData = (data: unknown) => {
  if (typeof data === 'string') {
    return data;
  }

  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
};

export const normalizeError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  if (error instanceof Response) {
    return `HTTP ${error.status} ${error.statusText}`;
  }

  return formatData(error);
};
