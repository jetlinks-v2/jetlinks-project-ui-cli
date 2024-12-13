import {getToken} from "@jetlinks-web/utils";
import {BASE_API, TOKEN_KEY} from "@jetlinks-web/constants";
import {isFunction, isObject, isString} from "lodash-es";

const controller = new AbortController();

class NdJson {
  options: any = {
    code: 200,
    codeKey: 'status'
  }
  constructor() {}

  create(options) {
    this.options = Object.assign(this.options, options)
  }

  getUrl(url) {
    return BASE_API + url
  }

  get(url, data = '{}', extra = {}) {

    return new Promise((resolve, reject) => {
      const _url = this.getUrl(url)

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
        console.log('[fetch GET]>', resp)
        let is_reader, cancellationRequest = false;

        const readable = new ReadableStream({
          start(controller) {
            const reader = resp.body.getReader()
            const decoder = new TextDecoder();
            let data_buf = "";

            is_reader = !!reader

            reader.read().then(function processResult(result) {
              if (result.done) {
                if (cancellationRequest) {
                  return
                }
                data_buf = data_buf.trim()

                if (data_buf.length !== 0) {
                  try {
                    controller.enqueue(JSON.parse(data_buf))
                  } catch (e) {
                    controller.error(e)
                    return
                  }
                }

                controller.close()
                return
              }

              const data = decoder.decode(result.value, { stream: true })
              data_buf += data

              let lines = data_buf.split('/')
              for(let i = 0; i < lines.length - 1; ++i) {
                const l = lines[i].trim();
                if (l.length > 0) {
                  try {
                    controller.enqueue(JSON.parse(l));
                  } catch(e) {
                    controller.error(e);
                    cancellationRequest = true;
                    reader.cancel();
                    return;
                  }
                }
              }
            })
          }
        })

        return resp.json()
      })
        .then((resp) => {
          console.log(resp)
        })
        .catch(e => {
          reject(e)
        })
    })
  }

  async post(url, data={}, extra = {}) {

    return new Promise(async (resolve, reject) => {
      const _url = this.getUrl(url)

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
        console.log('[fetch 1]>', resp.headers.get('content-type'))
        let is_reader, cancellationRequest = false;

        // return new ReadableStream({
        //   start(controller) {
        //     const reader = resp.body.getReader()
        //     const decoder = new TextDecoder();
        //     let data_buf = "";
        //
        //     is_reader = !!reader
        //
        //     reader.read().then(function processResult(result) {
        //       if (result.done) {
        //         if (cancellationRequest) {
        //           return
        //         }
        //         data_buf = data_buf.trim()
        //
        //         if (data_buf.length !== 0) {
        //           try {
        //             controller.enqueue(JSON.parse(data_buf))
        //           } catch (e) {
        //             controller.error(e)
        //             return
        //           }
        //         }
        //
        //         controller.close()
        //         return
        //       }
        //
        //       const data = decoder.decode(result.value, { stream: true })
        //       data_buf += data
        //       console.log(data)
        //       let lines = data_buf.split('/')
        //       for(let i = 0; i < lines.length - 1; ++i) {
        //         const l = lines[i].trim();
        //         if (l.length > 0) {
        //           try {
        //             console.log(l)
        //             controller.enqueue( isString(l) ? JSON.parse(l) : l);
        //           } catch(e) {
        //             controller.error(e);
        //             cancellationRequest = true;
        //             reader.cancel();
        //             return;
        //           }
        //         }
        //       }
        //     })
        //   },
        //   cancel(reason) {
        //     console.log("Cancel registered due to ", reason);
        //     cancellationRequest = true;
        //     is_reader.cancel();
        //   }
        // })
        // let msg = await readable.getReader()
        // console.log(resp, msg)
        return resp.json()
      })
        .then((resp) => {
          // const reader = resp.getReader();
          // reader.read().then(result => {
          //   console.log(result)
          // })
          resolve(this.handleResponse(resp))
        })
        .catch(e => {
          reject(e)
        })
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

    const status = response[this.options.codeKey || 'status']
    response.success = status === this.options.code

    return response
  }

  cancel() {

  }
}


export const ndJson = new NdJson()
