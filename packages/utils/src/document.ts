export const buildScriptTag = (src: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = src;
  return script;
};

export const downloadFileByUrl = (url: string, name: string, type: string) => {
  const downNode = document.createElement('a');
  downNode.style.display = 'none';
  downNode.download = `${name}.${type}`;
  downNode.href = url;
  document.body.appendChild(downNode);
  downNode.click();
  document.body.removeChild(downNode);
};

