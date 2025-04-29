export const buildScriptTag = (src: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = src;
  return script;
};

export const downloadFileByUrl = (url: string, name: string, type?: string) => {
  const downNode = document.createElement('a');
  downNode.style.display = 'none';
  downNode.download = type ? `${name}.${type}` : name;
  downNode.href = url;
  document.body.appendChild(downNode);
  downNode.click();
  document.body.removeChild(downNode);
};

export const downloadBlob = (record: any, name: string, type?: string) => {
  const blob = new Blob([record]);
  const url = URL.createObjectURL(blob);
  downloadFileByUrl(url, name, type);
}

export const downloadJson = (record: Record<string, any>, fileName: string, format?: string) => {
  const time = new Date()
  const y = time.getFullYear()
  const m = time.getMonth() + 1
  const d = time.getDate()

  const _time = `${y}_${m < 10 ? '0' + m : m }_${d < 10 ? '0' + d : d}`
  const _download = `${fileName || record?.name}-${_time}`
  //字符串内容转成Blob地址
  const blob = new Blob([JSON.stringify(record)]);
  const _url = URL.createObjectURL(blob);
  downloadFileByUrl(_url, _download, 'json')
}

export const updateStyle = (
  dom: HTMLElement,
  style: Partial<CSSStyleDeclaration>,
) => {
  if (dom) {
    for (const key in style) {
      dom.style[key] = style[key];
    }
  }
};
