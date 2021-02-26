import ScrollerBar from './libs/scroller'
import './styles/scroller.scss'
import { mPublic } from './libs/main'

/* 公共接口声明 */
declare global {
    interface Window {
        viewScroller: object
    }
    interface HTMLElement {
        vScrollTo: Function
    }
}

/**
 * 滚动条插件传入的参数接口
 */
export declare interface ScorllBarOptions{
    alwayShow?:boolean,
    on?:{
        scroll?:Function,
        scrollTop?:Function,
        scrollBottom?:Function,
        scrollLeft?:Function,
        scrollRight?:Function,
    },
    class?:string,
    theme?:string,
    limit?:{
        top?:number,
        left?:number,
        bottom?:number,
        right?:number
    },
    scrollBar?:{
        size?:number|string,
        right?:number|string,
        bottom?:number|string,
        minLength?:number,
        spacing?:number
    },
    width?:number|string,
    height?:number|string;
}
export interface ScrollToJSON{
    x?:number,
    y?:number;
}

export interface ScorllBarOptionsRequired extends ScorllBarOptions{
    alwayShow:boolean,
    on:{
        scroll:Function,
        scrollTop:Function,
        scrollBottom:Function,
        scrollLeft:Function,
        scrollRight:Function,
    },
    class:string,
    theme:string,
    limit:{
        top:number,
        left:number,
        bottom:number,
        right:number
    },
    scrollBar:{
        size:number|string,
        right:number|string,
        bottom:number|string,
        minLength:number,
        spacing:number
    },
    width?:number|string,
    height?:number|string
}

/**
 * 封装类
 */
class ScrollerController{
    /* 默认参数 */
    private options:ScorllBarOptions = {
        /* 滚动条是否一直显示，false为划过内容的时候显示 */
        alwayShow:true,
        /* 绑定事件 */
        on:{},
        /* 自定义class */
        class:'',
        /* 主题： dark 深色， light 浅色， dark-reverse 深色反转， light-reverse 浅色反转*/
        theme:'dark',
        /* 滚动条到顶部、底部、最左，最右时回调scrollLimit事件的距离值 */
        limit:{
            top:10,
            bottom:100,
            left:10,
            right:100
        },
        /**
         * 滚动条设置
         * size 滚动条的粗细，如果传入数字，默认px单位 
         * right 滚动条离右方的距离，如果传入数字，默认px单位，只有垂直方向的滚动条生效
         * bottom 滚动条离下方的距离，如果传入数字，默认px单位，只有水平方向的滚动条生效
         * minLength 滚动条的长度最小像素值，当内容非常多，而内容容器的高度或宽度非常小的时候，可以防止滚动条过小的情况，最小20，最大不能超过容器，默认20
         * spacing 滚动容器垂直方向和水平方向留给滚动条的间距像素（容器下方，容器右方）
         */
        scrollBar:{
            size:6,
            right:4,
            bottom:4,
            minLength:mPublic.SCROLL_MINLENGTH,
            spacing:14
        },
        width:undefined,
        height:undefined
    };
    constructor(){
    }
    public init(el:HTMLElement, options?:ScorllBarOptions):ScrollerBar{
        const scroller = new ScrollerBar()
        if(typeof options !== 'undefined'){
            options.limit = {...this.options.limit, ...(options.limit||{})}
            options.scrollBar = {...this.options.scrollBar, ...(options.scrollBar||{})}
            options = Object.assign({},this.options,options)
        }else{
            options = this.options
        }
        const opt = options as ScorllBarOptionsRequired
        /* 改为监听滚动最外层容器的宽高改变时触发 */
        // window.onresize = ()=>{
        //     if(typeof options !== 'undefined'){
        //         options.limit = {...this.options.limit, ...(options.limit||{})}
        //         options.scrollBar = {...this.options.scrollBar, ...(options.scrollBar||{})}
        //         options = Object.assign({},this.options,options)
        //     }else{
        //         options = this.options
        //     }
        //     const opt = options as ScorllBarOptionsRequired
        //     scroller.updateScroller(opt)
        // }
        scroller.scrollerInit(el, opt)
        return scroller
    }
    /* public onScroll(callback:Function):void{
        scroller.onScroll(callback)
    }
    public onScrollTop(callback:Function):void{
        scroller.onScrollTop(callback)
    }
    public onScrollBottom(callback:Function):void{
        scroller.onScrollBottom(callback)
    }
    public onScrollLeft(callback:Function):void{
        scroller.onScrollLeft(callback)
    }
    public onScrollRight(callback:Function):void{
        scroller.onScrollRight(callback)
    }
    public scrollXTo(value:number, duration:number):void{
        scroller.scrollXTo(value, duration)
    }
    public scrollYTo(value:number, duration:number):void{
        scroller.scrollYTo(value, duration)
    }
    public scrollTo({x,y}:ScrollToJSON, duration:number):void{
        scroller.scrollTo({x,y}, duration)
    } */
}

const vScroller:ScrollerController = new ScrollerController()

export const viewScroller:ScrollerController = vScroller


