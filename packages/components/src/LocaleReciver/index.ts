import { computed, inject, ref, unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import zh from '../locale/zh-CN'

interface LocaleInterface {
  [key: string]: any;
}

export interface LocaleReceiverContext {
  antLocale?: LocaleInterface;
}

export type LocaleComponentName = Exclude<keyof Record<string, any>, 'locale'>;
export function useLocaleReceiver<T extends LocaleComponentName>(
  componentName: T,
  defaultLocale?: Record<string, any>[T] | Function | ComputedRef<Record<string, any>[T] | Function>,
  propsLocale?: Ref<Record<string, any>[T]>,
): [ComputedRef<Record<string, any>[T]>] {
  const localeData = inject<LocaleReceiverContext>('componentLocaleData', {} as LocaleReceiverContext);
  const componentLocale = computed<Record<string, any>[T]>(() => {
    const { antLocale = zh } = localeData;
    const locale =
      unref(defaultLocale) || [componentName || 'global'];
    const localeFromContext = componentName && antLocale ? antLocale[componentName] : {};

    return {
      ...(typeof locale === 'function' ? (locale as Function)() : locale),
      ...(localeFromContext || {}),
      ...(unref(propsLocale) || {}),
    };
  });
  return [componentLocale];
}
