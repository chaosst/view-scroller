import { EventBus } from './bus'
import { ScrollToJSON } from '../index'

const SCROLLTO_SPEED = 10

HTMLElement.prototype.vScrollTo = function({x=0,y=0}:ScrollToJSON, duration:number = 300):void{
    if(typeof this.scrollTo !== 'function'){
        this.scrollTop = x
        this.scrollLeft = y
        console.warn('浏览器不支持view-scroller的滚动动画。')
    }else{
        let t:number = duration
        if(t==0){
            this.scrollTo(x, y)
        }else{
            let xdis:number = x/(t/SCROLLTO_SPEED)
            let ydis:number = y/(t/SCROLLTO_SPEED)
            let vx:number = 0, vy:number = 0;
            if(x>0 || y>0){
                let ev:any = setInterval(()=>{
                    vx = vx + xdis
                    vy = vy + ydis
                    this.scrollTo(vx, vy)
                    if((x>0 && vx >= x) || (y>0 && vy >= y)){
                        clearInterval(ev)
                    }
                },SCROLLTO_SPEED)
            }
        }
    }
}

const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
const ie11Rgx = /(trident)\/([\d.]+)/;

/**
 * 公共方法集合
 */
class Public{
    /* css使用的大小单位 */
    public CSS_UNIT:string = 'px'
    public SCROLL_MINLENGTH:number = 20
    public unitFormat(value?:number|string):string{
        let val:string = ''
        if(typeof value === 'number'){
            val = value + this.CSS_UNIT
        }
        return typeof val === 'string'?val:''
    }
    public themeSet(theme:string):string{
        if(theme != 'dark'){
            return ` __view-theme-`+theme
        }else{
            return ''
        }
    }

    public isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
    public isIE = (userAgent.indexOf("compatible") > -1
            && userAgent.indexOf("MSIE") > -1 && !this.isOpera) || userAgent.toLocaleLowerCase().match(ie11Rgx); //判断是否IE浏览器
    public isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
    public isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
    public isSafari = userAgent.indexOf("Safari") > -1
            && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
    public isChrome = userAgent.indexOf("Chrome") > -1
            && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

    public getRealPx(val?:number|string):string{
        if(typeof val !== 'undefined'){
            if(typeof val === 'number'){
                return val+'px'
            }else if(typeof val === 'string'){
                return val
            }else{
                return ''
            }
        }else{
            return ''
        }
    }
}

export const mPublic:Public = new Public()

export class Scroller{
    public public:Public = mPublic
    public bus:EventBus = new EventBus()
    constructor(){

    }
}