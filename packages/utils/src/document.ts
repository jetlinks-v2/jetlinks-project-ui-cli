export const buildScriptTag = (src: string): HTMLScriptElement => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.src = src;
  return script;
};

