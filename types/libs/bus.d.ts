interface busEv {
    name: string;
    isOnce: boolean;
    callback: Function;
}
/**
 * 自定义的事件总线
 * 方法:
 * on: 绑定一个事件
 * once: 绑定一个一次性事件
 * off: 移除一个事件
 * emit: 触发一个事件
 * use: 添加一个中间件
 */
export declare class EventBus {
    eventArr: Array<any>;
    useFunArr: any[];
    constructor();
    eventTpl: busEv;
    /**
     * 创建一个事件
     * @param {String} name
     * @param {Function} callback
     * @return {eventTpl}
     */
    private createEvent;
    /**
     * 获取事件
     * @param {String} name
     * @param {Function} fn
     * @return {eventTpl}
     */
    private getEvent;
    /**
     * 移除一个事件
     * @param {String} name
     * @param {Function} fn fn为空则全部移除
     * @return {void}
     */
    private removeEvent;
    /**
     * 移除一个事件, 同removeEvent
     * @param {String} name
     * @param {Function} fn fn为空则全部移除
     * @return {void}
     */
    off: (name: string, fn?: Function | undefined) => void;
    /**
     * 添加中间件
     * @param {function(string, object, ()=>{})} fn 中间件函数 fn(name, packet, next)
     * @return {void}
     */
    private use;
    /**
     * 中间件过滤, 只有添加的中间件执行next(),
     * 才会触发下一个中间件,
     * 否则终止触发事件
     * @param {String} name 触发事件名
     * @param {Object} packet 触发事件传入的数据
     * @return {boolean} b
     */
    private useFilter;
    /**
     * 添加事件
     * @param {String} name 事件名
     * @param {Function} fn 执行的事件函数
     * @param {boolean} cover 是否覆盖之前的事件
     * @return {eventTpl}
     */
    on: (name: string, fn: Function, cover?: boolean) => busEv;
    /**
     * 添加事件, 执行完立即立即销毁
     * @param {String} name 事件名
     * @param {Function} fn 执行的事件函数
     * @param {boolean} cover 是否覆盖之前的事件
     * @return {void}
     */
    once: (name: string, fn: Function, cover?: boolean) => void;
    /**
     * 触发一个事件
     * @param {String} name 事件名
     * @param {Object} data 传入事件监听方法的数据
     * @return {void}
     */
    emit: (name: string, data: object) => void;
}
export {};
