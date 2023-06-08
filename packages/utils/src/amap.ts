import { buildScriptTag } from './document'
export const getAMapUiPromise = (version: string = '1.0'): Promise<any> => {
  if ((window as any).AMapUI) {
    return Promise.resolve();
  }
  const protocol = window.location.protocol;
  const script = buildScriptTag(`${protocol}//webapi.amap.com/ui/${version}/main-async.js`);
  const pro = new Promise((resolve) => {
    script.onload = () => {
      (window as any).initAMapUI();
      resolve(true);
    };
  });

  document.body.append(script);
  return pro;
};
