declare module "virtual:__federation__" {
  function __federation_method_getRemote(name: string, url: string): Promise<any>
  function __federation_method_add_origin_setRemote(name: string, url: string): void
  function __federation_method_unwrapDefault(info: any): any
}
