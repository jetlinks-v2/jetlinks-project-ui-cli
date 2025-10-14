import { ref } from 'vue'
import { TermTypeMap} from "../setting";
import { useLocaleReceiver } from "../../LocaleReciver";

export type TermValue = ReturnType<typeof TermTypeMap>[keyof ReturnType<typeof TermTypeMap>]['value'];

type OptionsType = {
  omit?: TermValue[];
  pick?: TermValue[];
}

export const useTermOptions = (options?: OptionsType) => {
  const [contextLocale] = useLocaleReceiver('Search');
  const termTypeMap = TermTypeMap(contextLocale.value)
  const termsOptionsCache = Object.values(termTypeMap)
  const termOptions = ref()

  const termsKey = Object.keys(termTypeMap).reduce((previousValue, currentValue) => {
    previousValue[currentValue] = termTypeMap[currentValue].value;
    return previousValue
  }, {})

  if (options?.omit) {
    termOptions.value = termsOptionsCache.filter(item => !options.omit.includes(item.value))
  } else if (options?.pick) {
    termOptions.value = termsOptionsCache.filter(item => options.pick.includes(item.value))
  } else {
    termOptions.value = [...termsOptionsCache]
  }

  return {
    termOptions,
    termsKey
  }
}
