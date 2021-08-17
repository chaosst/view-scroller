import ScrollerBar from './libs/scroller'
import './styles/scroller.scss'
import { mPublic } from './libs/main'
import directives from './libs/vue'
export { directives }
const packageInfo = require('../package.json');

/* 公共接口声明 */
declare global {
    interface Window {
        viewScroller: object
    }
    interface HTMLElement {
        vScrollTo: Function,
        scrollTo:Function
    }
}

/**
 * 滚动条插件传入的参数接口
 */
export declare interface ScorllBarOptions{
    alwayShow?:boolean,
    mobile?:boolean,
    refresh?:boolean|{
        message?:boolean|{
            pullMessage?:string,
            releaseMessage?:string,
            refreshMessage?:string,
        },
        pullIcon?:string,
        refreshIcon?:string,
        distance?:number
    },
    on?:{
        scroll?:Function,
        scrollTop?:Function,
        scrollBottom?:Function,
        scrollLeft?:Function,
        scrollRight?:Function,
        refresh?:Function
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
        spacing?:number|string,
        radius?:number|string
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
    mobile:boolean,
    refresh:boolean|{
        message:boolean|{
            pullMessage:string,
            releaseMessage:string,
            refreshMessage:string,
        },
        pullIcon:string,
        refreshIcon:string,
        distance:number
    },
    on:{
        scroll:Function,
        scrollTop:Function,
        scrollBottom:Function,
        scrollLeft:Function,
        scrollRight:Function,
        refresh:Function
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
        spacing:number|string,
        radius:number|string
    },
    width?:number|string,
    height?:number|string
}

/**
 * 封装类
 */
class ScrollerController{
    /**
     * 插件版本查询
     */
    public version = packageInfo.version as string
    /**
     * options.refresh设为true时的默认配置
     */
    private refreshOptions = {
        message:{
            pullMessage:'下拉进行刷新',
            releaseMessage:'释放进行刷新',
            refreshMessage:'刷新中',
        },
        pullIcon:'',
        refreshIcon:'',
        distance:65
    }
    /* 默认参数 */
    private options:ScorllBarOptions = {
        /* 滚动条是否一直显示，false为划过内容的时候显示 */
        alwayShow:true,
        /* 是否移动端模式，默认web端模式 */
        mobile:false,
        /* 是否开启下拉刷新功能 */
        refresh:false,
        /* 绑定事件 */
        on:{},
        /* 自定义class */
        class:'',
        /* 主题： dark 深色， light 浅色， dark-reverse 深色反转， light-reverse 浅色反转*/
        theme:'dark',
        /* 滚动条到顶部、底部、最左，最右时回调scrollLimit事件的距离值 */
        limit:{
            top:10,
            bottom:60,
            left:10,
            right:60
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
            spacing:0,
            radius:4
        },
        width:undefined,
        height:undefined
    };
    constructor(){
    }
    public init(el:Element|string, options?:ScorllBarOptions):ScrollerBar{
        const scroller = new ScrollerBar()
        if(typeof options !== 'undefined'){
            options.limit = {...this.options.limit, ...(options.limit||{})}
            options.scrollBar = {...this.options.scrollBar, ...(options.scrollBar||{})}
            options.refresh = typeof options.refresh == 'boolean' && options.refresh?this.refreshOptions:options.refresh
            if(typeof options.refresh == 'object'){
                /* 如果refresh是对象，则和默认配置进行合并 */
                options.refresh = Object.assign({},this.refreshOptions,options.refresh)
                if(options.refresh.distance && options.refresh.distance > mPublic.REFRESH_MAX_DRAG_DISTANCE){
                    options.refresh.distance = mPublic.REFRESH_MAX_DRAG_DISTANCE
                }
                options.refresh.message =  typeof options.refresh.message == 'boolean' && options.refresh.message?this.refreshOptions.message:options.refresh.message
                if(typeof options.refresh.message == 'object'){
                    /* 如果refresh.message是对象，则和默认配置进行合并 */
                    options.refresh.message = Object.assign({},this.refreshOptions.message,options.refresh.message)
                }
            }
            options = Object.assign({},this.options,options)
        }else{
            options = this.options
        }
        const opt = options as ScorllBarOptionsRequired
        scroller.version = this.version
        scroller.scrollerInit(el, opt)
        return scroller
    }
}

const vScroller:ScrollerController = new ScrollerController()

export const viewScroller:ScrollerController = vScroller


