/**
 * 任意の型にエラーメッセージのプロパティを追加するラッパーの型
 */
export type FormObjWrapper<T> = T & {
   [Property in keyof T as `${Lowercase<Property&string>}_errorMsg`]?: string
}

/**
 * watcherの型
 */
type ProxyTargetWatcher<T> = {
  /**
   * 監視対象のプロパティ名
   */
  property: keyof T,
  callback: Function
}

/**
 * HandlerWrapperの引数の型
 */
export type HandlerWrapperParams<T extends Object> = {
  get?: ProxyHandler<T>['get'],
  set?: ProxyHandler<T>['set'],
  watcher?: Array<ProxyTargetWatcher<T>>,
} 

/**
 * カスタムのProxyHandlerを返却するWrapper
 */
export const handlerWrapper = <T extends Object>(args: HandlerWrapperParams<T>):ProxyHandler<T> => ({
  get: (target, prop, receiver) => {
      if (typeof prop === 'function') {
        throw new Error('Cannot access to Function.')
      }
      // カスタムgetter
      if(typeof args.get !== 'undefined') {
        args.get(target, prop, receiver)
      }
      return Reflect.get(target,prop,receiver)
  },
  set: (target, property, value, receiver) => {
    console.log(typeof property)
      if (typeof property === 'function') {
        throw new Error('Cannot edit Function.')
      }

      // カスタムsetter
      if(typeof args.set !== 'undefined') {
        args.set(target, property, value, receiver)
      }
      
      // カスタムwatcher
      if(args.watcher && args.watcher?.length > 0) {
        // 監視対象がある場合callbackを発火
        args.watcher.forEach((watch) => {
          if(watch.property === property) {
            watch.callback(value)
          }
        })
      }

      return true
  }
})

/**
 * ProxyWrapper
 * @param target 編集する値
 * @param handler 
 */
export function proxyWrapper<T extends Object>(target: T, handler: ProxyHandler<T>) {
  return new Proxy<T>(target, handler)
}