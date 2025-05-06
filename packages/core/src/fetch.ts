import {getToken} from "@jetlinks-web/utils";
import {BASE_API, TOKEN_KEY} from "@jetlinks-web/constants";
import {isFunction, isObject} from "lodash-es";
import { Observable, } from 'rxjs'

export class NdJson {
  options: any = {
    code: 200,
    codeKey: 'status'
  }
  isRead = false
  controller = null
  constructor() {}

  create(options) {
    this.options = Object.assign(this.options, options)
  }

  getUrl(url) {
    return BASE_API + url
  }

  get(url, data = '{}', extra = {}) {
    const _url = this.getUrl(url)
    const that = this
    const controller = this.controller = new AbortController();

    return new Observable(observer => {
      let reader
      fetch(
        _url,
        {
          method: 'GET',
          signal: controller.signal,
          keepalive: true,
          ...extra,
          ...this.handleRequest(_url)
        }
      ).then(resp => {
        reader = resp.body?.getReader();
        const decoder = new TextDecoder();
        let data_buf = "";

        if (!reader) {
          observer.error(new Error('No readable stream available'));
          return;
        }

        const read = () => {

          if (!that.isRead) {
            reader.cancel()
            observer.complete();
            return
          }

          reader.read().then(({ done, value }) => {
            if (done) {
              if (data_buf.trim().length > 0) {
                try {
                  observer.next(JSON.parse(data_buf.trim()));
                } catch (e) {
                  observer.error(e);
                }
              }
              observer.complete();
              return;
            }

            const data = decoder.decode(value, { stream: true });
            data_buf += data;

            let lines = data_buf.split('\n');
            for (let i = 0; i < lines.length - 1; ++i) {
              const line = lines[i].trim();
              if (line.length > 0) {
                try {
                  observer.next(JSON.parse(line));
                } catch (e) {
                  observer.error(e);
                  reader.cancel();
                  return;
                }
              }
            }
            data_buf = lines[lines.length - 1];
            read();
          }).catch(err => observer.error(err));
        };
        that.isRead = true
        read();
      }).catch(e => {
        observer.error(e)
      })

      return () => {
        that.cancel()
      }
    })
  }

  post(url, data: BodyInit | any ={}, extra = {}) {
    const _url = this.getUrl(url)
    const that = this
    const controller = this.controller = new AbortController();

    return new Observable(observer => {
      let reader
      fetch(
        _url,
        {
          method: 'POST',
          signal: controller.signal,
          keepalive: true,
          body: isObject(data) ? JSON.stringify(data) : data,
          ...extra,
          ...this.handleRequest(_url)
        }
      ).then(async resp => {
        reader = resp.body?.getReader();
        const decoder = new TextDecoder();
        let data_buf = "";

        if (!reader) {
          observer.error(new Error('No readable stream available'));
          return;
        }

        const read = () => {

          if (!that.isRead) {
            reader.cancel()
            observer.complete();
            return
          }

          reader.read().then(({ done, value }) => {
            if (done) {
              if (data_buf.trim().length > 0) {
                try {
                  observer.next(JSON.parse(data_buf.trim()));
                } catch (e) {
                  observer.error(e);
                }
              }
              observer.complete();
              return;
            }

            const data = decoder.decode(value, { stream: true });
            data_buf += data;

            let lines = data_buf.split('\n');
            for (let i = 0; i < lines.length - 1; ++i) {
              const line = lines[i].trim();
              if (line.length > 0) {
                try {
                  observer.next(JSON.parse(line));
                } catch (e) {
                  observer.error(e);
                  reader.cancel();
                  return;
                }
              }
            }
            data_buf = lines[lines.length - 1];
            read();
          }).catch(err => observer.error(err));
        };
        that.isRead = true
        read();
      }).catch(e => {
          observer.error(e)
      })

      return () => {
        that.cancel()
      }
    })
  }
  handleRequest(url): RequestInit {
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/x-ndjson',
      }
    }

    const token = getToken()

    if (!token && this.options.filter_url?.some(_url => _url.includes(url))) {
      this.options.tokenExpiration?.()
      return config
    }

    if (!config.headers[TOKEN_KEY]) {
      config.headers[TOKEN_KEY] = token
    }

    if (this.options.requestOptions && isFunction(this.options.requestOptions)) {
      const extraOptions = this.options.requestOptions(config)
      if (extraOptions && isObject(extraOptions)) {
        for (const key in extraOptions) {
          config[key] = extraOptions[key]
        }
      }
    }

    return config
  }

  handleResponse(response) {

    if (this.options.handleResponse && isFunction(this.options.handleResponse)) {
      return this.options.handleResponse(response)
    }

    // const status = response[this.options.codeKey || 'status']
    // response.success = status === this.options.code

    return response
  }

  cancel() {
    if (this.isRead) {
      this.isRead = false
    }

    this.controller.abort()
  }
}


export const ndJson = new NdJson()
