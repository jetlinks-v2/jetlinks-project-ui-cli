import { useRequest, defaultOptions } from './useRequest'
import type { RequestOptions } from './useRequest'
import type {AxiosResponseRewrite} from "@jetlinks-web/types";
import { isArray, get } from 'lodash-es'
import type { Ref } from 'vue'
import { ref } from 'vue'

interface RequestStep<T, S, P = any> {
  request: (...args: P[]) => Promise<AxiosResponseRewrite<T>>;
  /**
   * 当前请求
   * @param prevResult
   */
  paramsResolver?: (prevResult: any) => P | P[];
  options?: Partial<RequestOptions<T, S>>;
  name: string;
  /**
   * 是否跳出迭代
   * @param currentResult 当前请求结果
   * @returns boolean
   */
  shouldBreak?: (currentResult: S) => boolean;
  /**
   * 跳转到指定
   * @param currentResult 当前请求结果.
   * @returns string | undefined
   */
  jumpTo?: (currentResult: S) => number | undefined;
  /**
   * 收集当前请求的返回结果，并返回
   * @param currentResult 当前请求结果.
   * @param collectedResults 之前收集的结果.
   * @returns any
   */
  collector?: (currentResult: S, collectedResults: S) => any;
}

interface ChainedRequestResult {
  stepData: { [key: string]: Ref<any> };
  loading: Ref<boolean>;
  run: (...initialArgs: any[]) => Promise<any>;
  data: Ref<any>; // Now includes collected results
}

export const useChainedRequests = (
  steps: RequestStep<any, any>[],
  globalOptions?: Partial<RequestOptions<any, any>>
): ChainedRequestResult => {
  const overallLoading = ref(false);
  const stepData: { [key: string]: Ref<any> } = {};
  const finalResult = ref<any>(undefined);
  let collectedResults: Record<string, any> = {}; // 收集需要处理的结果

  const runChain = async (...initialArgs: any[]) => {
    overallLoading.value = true;
    let prevResult: any = null;
    let currentArgs: any[] = initialArgs;
    finalResult.value = undefined;

    for (const key in collectedResults) {
      delete collectedResults[key];
    }

    let currentIndex = 0;
    while (currentIndex < steps.length) {
      const step = steps[currentIndex];

      try {
        const { run } = useRequest(step.request, {
          ...globalOptions,
          ...step.options,
          immediate: false,
          onSuccess: (resp) => {
            const result = step.options?.onSuccess?.(resp) ?? get(resp, step.options?.formatName ?? defaultOptions.formatName);
            stepData[currentIndex].value = result;
            return result;
          },
          onError: (e) => {
            globalOptions?.onError?.(e);
            step.options?.onError?.(e);
            throw e;
          },
          onWarn: (e) => {
            globalOptions?.onWarn?.(e);
            step.options?.onWarn?.(e);
          }
        });

        if (step.paramsResolver) {
          const resolvedParams = step.paramsResolver(prevResult);
          currentArgs = isArray(resolvedParams) ? resolvedParams : [resolvedParams];
        } else if (prevResult !== null) {
          currentArgs = [prevResult];
        }

        const currentStepResult = await run(...currentArgs);
        prevResult = currentStepResult; // 更新result作为下个迭代的依赖参数

        // 收集返回参数
        if (step.collector) {
          const currentCollectorResult = step.collector(currentStepResult, collectedResults);
          collectedResults = {
            ...collectedResults,
            ...currentCollectorResult
          }

          if (currentIndex === steps.length - 1) { // 最后一个并且有收集函数，则置空prevResult
            prevResult = {}
          }
        }

        // 判断是否跳转
        if (step.jumpTo) {
          const jumpToStepIndex = step.jumpTo(currentStepResult);
          if (jumpToStepIndex >= 0 && jumpToStepIndex < steps.length) { // 下标必须在数组范围内
            if (jumpToStepIndex <= currentIndex) { // 跳转下标小于或者等于当前下标时，会导致死循环
              console.warn(`跳转的指定下标和当前下标一致，避免死循环，将继续迭代`);
            } else {
              currentIndex = jumpToStepIndex;
            }
            continue; // 继续迭代
          } else {
            console.warn(`找不到 steps[${jumpToStepIndex}] 指定目标，将继续迭代`);
          }
        }

        // 是否跳出循环
        if (step.shouldBreak && step.shouldBreak(currentStepResult)) {
          finalResult.value = { // 将收集到的数据和结果进行合并
            ...currentStepResult,
            ...collectedResults
          };
          return finalResult.value;
        }

        currentIndex++; // Move to the next step if no jump or break
      } catch (error) {
        console.error('[useChainedRequests] Chained request error:', error);
        finalResult.value = undefined;
        throw error;
      }
    }

    // 将最后的结果和之前收集的结果进行合并
    finalResult.value = {
      ...prevResult,
      ...collectedResults
    };

    return finalResult.value;
  };

  return {
    stepData,
    loading: overallLoading,
    run: runChain,
    data: finalResult,
  };
};
