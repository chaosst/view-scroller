interface busEv{
    name:string,
    isOnce:boolean,
    callback:Function;
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
export class EventBus{
    //事件列表
    public eventArr:Array<any> = [];
    //添加的中间件列表
    public useFunArr:any[] = [];
    constructor(){

    }

    public eventTpl:busEv = {
        name: "", //事件名
        isOnce: false, //是否只执行一次
        //回调
        callback: function ():void {
        
        }
    }
    
    /**
     * 创建一个事件
     * @param {String} name 
     * @param {Function} callback 
     * @return {eventTpl}
     */
    private createEvent = (name:string, callback:Function):busEv=>{
        let e:busEv = {
            name: name, //事件名
            isOnce: false, //是否只执行一次
            callback: callback //回调
        }
        return e;
    }

    /**
     * 获取事件
     * @param {String} name 
     * @param {Function} fn 
     * @return {eventTpl}
     */
    private getEvent = (name:string, fn?:Function):Array<busEv>=>{
        let matchFn:any = fn && typeof fn == 'function';
        return this.eventArr.filter((e) => {
            let b = e.name === name;
            if (matchFn) {
                b = b && e.fn === fn;
            }
            return b;
        })
    }

    /**
     * 移除一个事件
     * @param {String} name 
     * @param {Function} fn fn为空则全部移除
     * @return {void}
     */
    private removeEvent = (name:string, fn?:Function):void=>{
        let matchFn:any = fn && typeof fn == 'function';
        this.eventArr = this.eventArr.filter((e) => {
            let b = e.name === name;
            if (matchFn) {
            b = b && e.fn === fn;
            }
            return !b;
        })
    }

    /**
     * 移除一个事件, 同removeEvent
     * @param {String} name 
     * @param {Function} fn fn为空则全部移除
     * @return {void}
     */
    public off = (name:string, fn?:Function):void=>{
        this.removeEvent(name, fn);
    }

    /**
     * 添加中间件
     * @param {function(string, object, ()=>{})} fn 中间件函数 fn(name, packet, next)
     * @return {void}
     */
    private use = (fn:Function):void=>{
        this.useFunArr.push(fn)
    }

    /**
     * 中间件过滤, 只有添加的中间件执行next(),
     * 才会触发下一个中间件, 
     * 否则终止触发事件
     * @param {String} name 触发事件名
     * @param {Object} packet 触发事件传入的数据
     * @return {boolean} b
     */
    private useFilter = (name:string, packet:object):boolean=>{
        let useFunArr:Array<any> = this.useFunArr;
        let len:number = useFunArr.length;
        let index:number = 0;
        if (len) {
            //从第一个中间件开始执行
            useFunArr[0](name, packet, next);
            //执行过的中间件与中间件总数相比较
            if (index === len - 1) {
                return true;
            } else {
                return false;
            }
        }
        return true;
        
        function next() {
            //每执行一个中间件,指数+1
            index++;
            if (index < len) {
                useFunArr[index](name, packet, next);
            }
        }
    }

    /**
     * 添加事件
     * @param {String} name 事件名
     * @param {Function} fn 执行的事件函数
     * @param {boolean} cover 是否覆盖之前的事件
     * @return {eventTpl}
     */
    public on = (name:string, fn:Function, cover:boolean = false):busEv=>{
        let ev:busEv = this.createEvent(name, fn);
        if (cover) {
            let eventArr = this.getEvent(name);
            if (eventArr.length > 0) {
                this.removeEvent(name);
            }
        }
        this.eventArr.push(ev);
        return ev;
    }

    /**
     * 添加事件, 执行完立即立即销毁
     * @param {String} name 事件名
     * @param {Function} fn 执行的事件函数
     * @param {boolean} cover 是否覆盖之前的事件
     * @return {void}
     */
    public once = (name:string, fn:Function, cover:boolean = false):void=>{
        let ev:busEv = this.on(name, fn, cover);
        ev.isOnce = true;
    }

    /**
     * 触发一个事件
     * @param {String} name 事件名
     * @param {Object} data 传入事件监听方法的数据
     * @return {void}
     */
    public emit = (name:string, data:object):void=> {
        let eventArr:Array<any> = this.getEvent(name);
        let b:boolean = this.useFilter(name, data);
        if (!b) {
            return;
        }
        let len:number = eventArr.length,
            ev:busEv;
        for (let i = 0; i < len; i++) {
            ev = eventArr[i];
            //执行监听的事件
            if (typeof ev.callback === 'function') {
                let b = ev.callback(data);
                if (ev.isOnce) {
                    this.removeEvent(ev.name);
                }
                if (typeof b != 'undefined' && b === false) {
                    return;
                }
            }
        }
    }
}