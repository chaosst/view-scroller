import { Scroller } from './main'
import { init } from 'snabbdom/build/package/init'
import { classModule } from 'snabbdom/build/package/modules/class'
import { attributesModule } from 'snabbdom/build/package/modules/attributes'
// import { datasetModule } from 'snabbdom/build/package/modules/dataset'
import { propsModule } from 'snabbdom/build/package/modules/props'
import { styleModule } from 'snabbdom/build/package/modules/style'
import { eventListenersModule } from 'snabbdom/build/package/modules/eventlisteners'
import { h } from 'snabbdom/build/package/h' // helper function for creating vnodes
import { toVNode } from 'snabbdom/build/package/tovnode' // helper function for creating vnodes
import { VNode, VNodeData } from 'snabbdom/build/package/vnode'
import { ScorllBarOptionsRequired, ScrollToJSON } from '../index'
import ResizeObserver from 'resize-observer-polyfill';

/* 滚动事件接口声明 */
class ScrollerEv{
    //等同于元素的offsetWidth，box的内容区域width+左右padding+左右border
    public width:number = 0
    //等同于元素的offsetHeight，box的内容区域height+上下padding+上下border
    public height:number = 0
    //获取当前元素到定位父节点的top方向的距离
    public offsetTop:number = 0
    //获取当前元素到定位父节点的left方向的距离
    public offsetLeft:number = 0
    //box可滚动的垂直高度
    public scrollWidth:number = 0
    //box可滚动的水平宽度
    public scrollHeight:number = 0
    //垂直方向滚动距离
    public scrollTop:number = 0
    //水平方向滚动距离
    public scrollLeft:number = 0
    //box的内容区域width+左右padding（可视区域width的大小）
    public clientWidth:number = 0
    //box的内容区域height+上下padding（可视区域height的大小）
    public clientHeight:number = 0
    //盒子上边框
    public clientTop:number = 0
    //盒子左边框
    public clientLeft:number = 0
    //存放触发滚动元素的对象
    public target:any = {}
}

/**
 * 滚动插件的实现类
 */
export default class ScrollerBar extends Scroller{
    private onceEvents:any = {
        /* 开始的时候在最顶部，所以不触发顶部事件 */
        scrollTop:1,
        /* 开始的时候在最左边，所以不触发最左边事件 */
        scrollLeft:1,
        scrollBottom:0,
        scrollRight:0
    }
    /**
     * 标识用户是否使用了事件监听
     */
    private hasEvent:any = {
        scrollTop:0,
        scrollLeft:0,
        scrollBottom:0,
        scrollRight:0
    }
    private startPos:any = {
        X:0,
        Y:0,
        scrollTop:0,
        scrollLeft:0
    }

    private options:any = {}

    private isDraging:any = false

    private isScrolling:boolean = false

    private mouseupEv:any = null
    private mousemoveEv:any = null

    private patch:Function = ()=>{}

    /* 根据attrs里面的ref可以快速获取vnode */
    /* scdiv 最外层div scbox 滚动容器 scview 内容容器 scver 垂直滚动条容器 schor 水平滚动条容器 */
    private selector:any = {}
    /* 初始化前的原容器对象 */
    private initDiv:VNode|undefined;
    /* 滚动事件 */
    private mainEv:ScrollerEv = new ScrollerEv()
    public target:HTMLElement|null = null
    
    constructor(){
        super()

        const initSeltetor = (oldvnode:VNodeData, vnode:VNodeData)=>{
            let { elm, data } = vnode
            if(data.dataset && data.dataset.ref){
                this.selector[data.dataset.ref] = vnode
            }
        }
        
        const myModule:any = {
            create:initSeltetor,
            update:initSeltetor
        }
        /* 虚拟dom插件snabbdom初始化 */
        this.patch = init([ // Init patch function with chosen modules
            classModule, // makes it easy to toggle classes
            propsModule, // for setting properties on DOM elements
            attributesModule,
            // datasetModule,
            styleModule, // handles styling on elements with support for animations
            eventListenersModule, // attaches event listeners
            myModule //自定义模块
        ])
    }
    private getEvent(name:string){
        return this.options.mobile?this.public.MOBILE_EVENTS[name]:this.public.EVENTS[name]
    }
    /**
     * 监听滚动方法
     * @param callback 滚动回调
     */
    public onScroll(callback:Function):void{
        this.bus.on('scroll', callback)
    }

    /**
     * 监听滚动到底部回调
     * @param callback 回调
     */
    public onScrollBottom(callback:Function):void{
        /* 该滚动触发事件不能叠加 */
        this.bus.off('scrollBottom')
        this.hasEvent.scrollBottom = 1
        this.bus.on('scrollBottom', callback)
    }

    /**
     * 监听滚动到顶部回调
     * @param callback 回调
     */
    public onScrollTop(callback:Function):void{
        /* 该滚动触发事件不能叠加 */
        this.bus.off('scrollTop')
        this.hasEvent.scrollTop = 1
        this.bus.on('scrollTop', callback)
    }

    /**
     * 监听滚动到最左回调
     * @param callback 回调
     */
    public onScrollLeft(callback:Function):void{
        /* 该滚动触发事件不能叠加 */
        this.bus.off('scrollLeft')
        this.hasEvent.scrollLeft = 1
        this.bus.on('scrollLeft', callback)
    }

    /**
     * 监听滚动到最右回调
     * @param callback 回调
     */
    public onScrollRight(callback:Function):void{
        /* 该滚动触发事件不能叠加 */
        this.bus.off('scrollRight')
        this.hasEvent.scrollRight = 1
        this.bus.on('scrollRight', callback)
    }

    public scrollXTo(value:number, duration?:number):void{
        this.selector['scbox'].elm.vScrollTo({x:value, y:this.selector['scbox'].elm.scrollTop}, duration)
    }

    public scrollYTo(value:number, duration?:number):void{
        this.selector['scbox'].elm.vScrollTo({x:this.selector['scbox'].elm.scrollLeft, y:value}, duration)
    }

    public scrollTo({x,y}:ScrollToJSON, duration?:number):void{
        this.selector['scbox'].elm.vScrollTo({x,y}, duration)
    }

    /**
     * 初始化滚动条拖动的全局事件
     */
    private dragInit(){
        document.addEventListener(this.getEvent('mouseup'),this.mouseupEv = (event:any)=>{
            this.isDraging = false
        })
        document.addEventListener(this.getEvent('mousemove'),this.mousemoveEv = (event:any)=>{
            const scBox:any = this.selector['scbox']
            const scView:any = this.selector['scview']
            let { pageY, pageX }:any = this.options.mobile?event.targetTouches[0]:event
            if(this.isDraging){
                this.selector['scver'].elm.style.opacity = 1
                this.selector['schor'].elm.style.opacity = 1
                this.selector['schor'].elm.style.visibility = 'visible'
                this.selector['scver'].elm.style.visibility = 'visible'
                let disY:number = this.startPos.Y - pageY
                scBox.elm.scrollTop = this.startPos.scrollTop - disY/scBox.elm.offsetHeight*scView.elm.offsetHeight
                let disX:number = this.startPos.X - pageX
                scBox.elm.scrollLeft = this.startPos.scrollLeft - disX/scBox.elm.offsetWidth*scView.elm.offsetWidth
            }
        })
    }
    /**
     * 初始化滚动条
     * @param el 需要初始化滚动条的html元素
     * @param options 初始化滚动条的参数
     */
    public scrollerInit(el:HTMLElement, options:ScorllBarOptionsRequired):any{
        this.options = options
        /* 参数处理 */
        this.optionsInit(options)
        let box = document.createElement('div')
        if(el.parentNode){
            el.parentNode.insertBefore(box, el)
        }
        // box.appendChild(el)
        // box.innerHTML = el.innerHTML
        // el.innerHTML = ''
        // el.appendChild(box)
        // let vn:VNode = toVNode(el)
        // vn.data = {
        //     hook:{
        //         update: (vnode:any)=>{
        //             this.updateScroller(this.options)
        //         }
        //     }
        // }
        // this.initDiv = el
        this.dragInit()
        
        let div = this.createVnode(el, options)
        //把虚拟dom转换成真实dom更新到页面
        this.initDiv = div
        
        this.patch(box, div)
        this.target = div.elm
        if(typeof ResizeObserver != 'undefined'){
            const myObserver = new ResizeObserver((entries:any[]) => {
                entries.forEach((entry:any)=> {
                    // console.log('大小位置', entry.contentRect)
                    // console.log('监听的DOM', entry.target)
                    this.update()
                })
            })
            myObserver.observe(div.elm)
            myObserver.observe(this.selector['scview'].elm)
        }else{
            if(typeof div.elm.attachEvent != 'undefined'){
                div.elm.attachEvent('onresize', ()=>{
                    this.update()
                })
                this.selector['scview'].elm.attachEvent('onresize', ()=>{
                    this.update()
                })
            }else{
                console.warn('浏览器不支持view-scroller插件容器宽高变化自动更新，需要手动调用update方法。')
            }
        }
    }

    private getNested(el:HTMLElement){
        let n:number = 0
        for(let $el:any = el; $el && $el.closest('.__view-scroller')?true:false; $el = $el.closest('.__view-scroller').parentNode){
            n++
        }
        return n
    }

    private thumbResizeHor = (vnode:any)=>{
        let zIndex = 6000
        vnode.elm.parentNode.style.zIndex = zIndex + this.getNested(vnode.elm.parentNode)
        let max:number = this.selector['scbox'].elm.offsetWidth
        let scale:number = max/this.selector['scview'].elm.offsetWidth
        if(scale<1){
            let minLength:number = this.options.scrollBar.minLength
            if(minLength>=max || minLength<this.public.SCROLL_MINLENGTH){
                minLength = this.public.SCROLL_MINLENGTH
            }
            vnode.elm.style.minWidth = minLength + 'px'
            vnode.elm.style.width = scale*100 +'%'; 
            if(max*scale < minLength){
                scale = minLength/(max-minLength)
            }
            const vm = this;
            vnode.elm.style.transform = `translateY(${this.selector['scbox'].elm.scrollLeft/(scale*vm.selector['scview'].elm.offsetWidth)*100}%)`
            Object.defineProperty(this.mainEv, 'scrollLeft', {
                set(newValue) {
                    vnode.elm.style.transform = `translateY(${newValue/(scale*vm.selector['scview'].elm.offsetWidth)*100}%)`
                }
            })
            this.selector['scview'].elm.style['padding-bottom'] = this.public.getRealPx(this.options.scrollBar.spacing)
        }else{
            this.selector['scview'].elm.style['padding-bottom'] = '0px'
        }
    }
    private thumbResizeVer = (vnode:any)=>{
        let zIndex = 6000
        vnode.elm.parentNode.style.zIndex = zIndex + this.getNested(vnode.elm.parentNode)
        let max:number = this.selector['scbox'].elm.offsetHeight
        let scale:number = max/this.selector['scview'].elm.offsetHeight
        if(scale<1){
            let minLength:number = this.options.scrollBar.minLength
            if(minLength>=max || minLength<this.public.SCROLL_MINLENGTH){
                minLength = this.public.SCROLL_MINLENGTH
            }
            vnode.elm.style.minHeight = minLength + 'px'
            vnode.elm.style.height = scale*100 +'%'; 
            if(max*scale < minLength){
                scale = minLength/(max-minLength)
            }
            const vm = this;
            vnode.elm.style.transform = `translateY(${this.selector['scbox'].elm.scrollTop/(scale*vm.selector['scview'].elm.offsetHeight)*100}%)`
            Object.defineProperty(this.mainEv, 'scrollTop', {
                set(newValue) {
                    vnode.elm.style.transform = `translateY(${newValue/(scale*vm.selector['scview'].elm.offsetHeight)*100}%)`
                }
            })
            this.selector['scview'].elm.style['padding-right'] = this.public.getRealPx(this.options.scrollBar.spacing)
        }else{
            this.selector['scview'].elm.style['padding-right'] = '0px'
        }
    }

    private getScrollClass(){
        if(this.public.isIE){
            return '.__view-scrollbar__wrap--hidden-default-IE'
        }else{
            return '.__view-scrollbar__wrap--hidden-default'
        }
    }
    

    private createVnode(el:Node, options:ScorllBarOptionsRequired){
        const realEl = el
        const vn = toVNode(el)
        // document.body.appendChild(realEl)
        // let childs = el.childNodes
        // const cbox = document.createElement('div')
        // document.body.appendChild(cbox)
        // childs.forEach((item:Node)=>{
        //     cbox.appendChild(item)
        // })
        /* 判断鼠标是否已进入滚动容器 */
        let mousein = false
        let scrollTimer:any = null
        let div:any = [
            h('div.__view-scroller-box'+this.getScrollClass(),{
                dataset:{
                    ref:'scbox'
                },
                hook:{
                    destroy: (vnode:any)=>{
                        this.bus.off('scroll')
                        this.bus.off('scrollTop')
                        this.bus.off('scrollBottom')
                        this.bus.off('scrollLeft')
                        this.bus.off('scrollRight')
                    },
                    insert:(vnode:any)=>{
                        const { elm } = vnode
                        let prevOffsetHeight:number = -1, prevOffsetWidth:number = -1
                        const checkRightBottom = ()=>{
                            const disY = this.selector['scview'].elm.offsetHeight - elm.offsetHeight
                            if(disY <= options.limit.bottom && disY != prevOffsetHeight){
                                if(!this.onceEvents.scrollBottom){
                                    prevOffsetHeight = disY
                                    this.bus.emit('scrollBottom', {...this.mainEv, done:checkRightBottom})
                                }
                            }else{
                                this.onceEvents.scrollBottom = 0
                            }
                            const disX = this.selector['scview'].elm.offsetWidth - elm.offsetWidth
                            if(disX <= options.limit.right && disX != prevOffsetWidth){
                                if(!this.onceEvents.scrollRight){
                                    prevOffsetWidth = disX
                                    this.bus.emit('scrollRight', {...this.mainEv, done:checkRightBottom})
                                }
                            }else{
                                this.onceEvents.scrollRight = 0
                            }
                        }
                        /* 初始化时检测一次右边和底部的滚动事件 */
                        checkRightBottom()
                    }
                },
                on: {
                    scroll: ({target}:any) => {
                        clearTimeout(scrollTimer)
                        let {offsetHeight, offsetWidth, offsetTop, offsetLeft, clientHeight, clientWidth, clientLeft, clientTop, scrollWidth, scrollHeight, scrollTop, scrollLeft } = target
                        this.mainEv.height = offsetHeight
                        this.mainEv.width = offsetWidth
                        this.mainEv.offsetTop = offsetTop
                        this.mainEv.offsetLeft = offsetLeft
                        this.mainEv.clientHeight = clientHeight
                        this.mainEv.clientWidth = clientWidth
                        this.mainEv.clientLeft = clientLeft
                        this.mainEv.clientTop = clientTop
                        this.mainEv.scrollWidth = scrollWidth
                        this.mainEv.scrollHeight = scrollHeight
                        this.mainEv.scrollTop = scrollTop
                        this.mainEv.scrollLeft = scrollLeft
                        this.mainEv.target = target
                        this.bus.emit('scroll', this.mainEv)
                        if(this.selector['scview'].elm.offsetHeight - (scrollTop + this.selector['scbox'].elm.offsetHeight) <= options.limit.bottom && this.hasEvent.scrollBottom){
                            if(!this.onceEvents.scrollBottom){
                                this.onceEvents.scrollBottom = 1
                                this.bus.emit('scrollBottom', {...this.mainEv, done:()=>{this.onceEvents.scrollBottom = 0}})
                            }
                        }
                        if(scrollTop <= options.limit.top && this.hasEvent.scrollTop){
                            if(!this.onceEvents.scrollTop){
                                this.onceEvents.scrollTop = 1
                                this.bus.emit('scrollTop', {...this.mainEv, done:()=>{this.onceEvents.scrollTop = 0}})
                            }
                        }
                        if(this.selector['scview'].elm.offsetWidth - (scrollLeft + this.selector['scbox'].elm.offsetWidth) <= options.limit.right && this.hasEvent.scrollRight){
                            if(!this.onceEvents.scrollRight){
                                this.onceEvents.scrollRight = 1
                                this.bus.emit('scrollRight', {...this.mainEv, done:()=>{}})
                            }
                        }else{
                            this.onceEvents.scrollRight = 0
                        }
                        if(scrollLeft <= options.limit.left && this.hasEvent.scrollLeft){
                            if(!this.onceEvents.scrollLeft){
                                this.onceEvents.scrollLeft = 1
                                this.bus.emit('scrollLeft', {...this.mainEv, done:()=>{}})
                            }
                        }else{
                            this.onceEvents.scrollLeft = 0
                        }
                        if(!options.alwayShow && options.mobile){
                            this.selector['schor'].elm.style.opacity = 1
                            this.selector['scver'].elm.style.opacity = 1
                            this.selector['schor'].elm.style.visibility = 'visible'
                            this.selector['scver'].elm.style.visibility = 'visible'
                            /* 滚动完成后2秒隐藏滚动条 */
                            scrollTimer = setTimeout(()=>{
                                this.selector['schor'].elm.style.opacity = 0
                                this.selector['scver'].elm.style.opacity = 0
                                /* 淡出动画时间 */
                                setTimeout(()=>{
                                    this.selector['schor'].elm.style.visibility = 'hidden'
                                    this.selector['scver'].elm.style.visibility = 'hidden'
                                },300)
                            },2000)
                        }
                    },
                }
            },h('div.__view-scroller-view',{
                dataset:{
                    ref:'scview'
                },
                hook:{
                    insert:()=>{
                        // let childs = cbox.childNodes
                        // childs.forEach((item:Node)=>{
                        //     this.selector['scview'].elm.appendChild(item)
                        // })
                        // cbox.remove()
                        this.selector['scview'].elm.appendChild(realEl)
                    },
                    update:()=>{
                        // let childs = cbox.childNodes
                        // childs.forEach((item:Node)=>{
                        //     this.selector['scview'].elm.appendChild(item)
                        // })
                        // cbox.remove()
                        this.selector['scview'].elm.appendChild(realEl)
                    }
                }
            })),
            h('div.__view-scroller-bar is-horizontal',{
                dataset:{
                    ref:'schor'
                },
                style:{
                    borderRadius:this.public.getRealPx(options.scrollBar.radius),
                    opacity:options.alwayShow?'1':'0',
                    visibility:options.alwayShow?'visible':'hidden',
                    height:this.public.getRealPx(options.scrollBar.size),
                    bottom:this.public.getRealPx(options.scrollBar.bottom)
                },
            },h('div.__view-scroller-thumb'+this.public.themeSet(options.theme),{
                    on:{
                        [this.getEvent('mousedown')]:(event:any)=>{
                            event.preventDefault()
                            let { pageX, target }:any = event
                            this.startPos.X = pageX
                            this.startPos.scrollLeft = this.selector['scbox'].elm.scrollLeft
                            this.isDraging = target
                        }
                    },
                    hook: {
                        insert: this.thumbResizeHor,
                        update: this.thumbResizeHor,
                        destroy:(vnode:any) => {
                            document.removeEventListener(this.getEvent('mouseup'), this.mouseupEv)
                            document.removeEventListener(this.getEvent('mousemove'), this.mousemoveEv)
                        }
                    }
                })
            ),
            h('div.__view-scroller-bar is-vertical',{
                dataset:{
                    ref:'scver'
                },
                style:{
                    borderRadius:this.public.getRealPx(options.scrollBar.radius),
                    opacity:options.alwayShow?'1':'0',
                    visibility:options.alwayShow?'visible':'hidden',
                    width:this.public.getRealPx(options.scrollBar.size),
                    right:this.public.getRealPx(options.scrollBar.right)
                },
            },h('div.__view-scroller-thumb'+this.public.themeSet(options.theme),{
                    on:{
                        [this.getEvent('mousedown')]:(event:any)=>{
                            event.preventDefault()
                            let { pageY } = this.options.mobile?event.targetTouches[0]:event
                            let { target }:any = event
                            this.startPos.Y = pageY
                            this.startPos.scrollTop = this.selector['scbox'].elm.scrollTop
                            this.isDraging = target
                        }
                    },
                    hook: {
                        insert: this.thumbResizeVer,
                        update: this.thumbResizeVer,
                        destroy:(vnode:any) => {
                            document.removeEventListener(this.getEvent('mouseup'), this.mouseupEv)
                            document.removeEventListener(this.getEvent('mousemove'), this.mousemoveEv)
                        }
                    }
                })
            )
        ];
        let className:string = ''
        if(typeof options.class == 'string' && options.class){
            className = '.'+options.class.replace(/ /g, '.')
        }
        let attrs:any = {}
        /* 兼容vue */
        if(vn.data && vn.data.attrs){
            for(let i in vn.data.attrs){
                if(i.indexOf('data-v-')!=-1){
                    attrs[i] = ''
                    // attrs[i.replace('data-','')] = ''
                }
            }
        }
        /**
         * 如果是移动端，不根据鼠标位置判断滚动条显示，移动端当alwayShow为true时，改成滚动时显示对应容器的滚动条
         */
        const on:any = this.options.mobile?{}:{
            mouseenter:(event:any)=>{
                if(!options.alwayShow){
                    this.selector['schor'].elm.style.opacity = 1
                    this.selector['scver'].elm.style.opacity = 1
                    this.selector['schor'].elm.style.visibility = 'visible'
                    this.selector['scver'].elm.style.visibility = 'visible'
                }
                mousein = true
            },
            mousemove:(event:any)=>{
                if(!options.alwayShow && !mousein){
                    this.selector['schor'].elm.style.opacity = 1
                    this.selector['scver'].elm.style.opacity = 1
                    this.selector['schor'].elm.style.visibility = 'visible'
                    this.selector['scver'].elm.style.visibility = 'visible'
                    mousein = true
                }
            },
            mouseleave:(event:any)=>{
                if(!options.alwayShow){
                    this.selector['schor'].elm.style.opacity = 0
                    this.selector['scver'].elm.style.opacity = 0
                    /* 淡出动画时间 */
                    setTimeout(()=>{
                        this.selector['schor'].elm.style.visibility = 'hidden'
                        this.selector['scver'].elm.style.visibility = 'hidden'
                    },300)
                }
                mousein = false
            }
        }
        div = h('div.__view-scroller'+className,{
            style:{
                width:this.public.getRealPx(this.options.width),
                height:this.public.getRealPx(this.options.height)
            },
            attrs,
            dataset:{
                ref:'scdiv'
            },
            // attrs:{
            //     ref:'scdiv'
            // },
            // dataset:attrs,
            on
        },div)
        return div
    }

    /**
     * 容器大小发生变化时，更新滚动条位置和大小
     */
    public update():void{
        this.thumbResizeVer(this.selector['scver'].children[0])
        this.thumbResizeHor(this.selector['schor'].children[0])
    }

    /**
     * 滚动条初始化时的参数处理函数
     * @param options 初始化滚动条的参数
     */
    private optionsInit(options:ScorllBarOptionsRequired):void{
        /* 监听事件 */
        if(options.on){
            let { scroll, scrollBottom, scrollTop, scrollLeft, scrollRight }:any = options.on
            if(scroll instanceof Function){
                this.onScroll(scroll)
            }
            if(scrollBottom instanceof Function){
                this.onScrollBottom(scrollBottom)
            }
            if(scrollTop instanceof Function){
                this.onScrollTop(scrollTop)
            }
            if(scrollLeft instanceof Function){
                this.onScrollLeft(scrollLeft)
            }
            if(scrollRight instanceof Function){
                this.onScrollRight(scrollRight)
            }
        }
    }
}

// const scrollerBar = new ScrollerBar()

// export default scrollerBar;