import { viewScroller, ScorllBarOptions } from "../../index"
const getMthodName = (version:string)=>{
    if(version < '3.0.0'){
        return {
            BEFOREMOUNT:'bind',
            MOUNTED:'inserted',
            UNMOUNTED:'unbind',
            UPDATED:'componentUpdated'
        }          
    }else{
        return {
            BEFOREMOUNT:'beforeMount',
            MOUNTED:'mounted',
            UNMOUNTED:'unmounted',
            UPDATED:'updated'
        }
    }
}

export interface DirectiveOptions{
    selector?:string,
    options?:ScorllBarOptions
}

const initScroller = (el:Element, binding:any) => {
    let initEl = el
    let opt:Record<string, any> = binding.value as DirectiveOptions?binding.value.options:{};
    if(binding.value as DirectiveOptions && binding.value.selector as string){
        initEl = el.querySelector(binding.value.selector)
    }
    if(initEl.parentElement && !Array.from(initEl.parentElement.classList).includes('__view-scroller-view')){
        if(initEl){
            (el as any).scroller = viewScroller.init(initEl,opt)
        }else{
            console.error('没有找到滚动插件初始化元素。')
        }
      }
}

export default {
    install:(app:any)=>{
        if(app as Record<string, any>){
            const apis = getMthodName(app.version)
            app.directive('view-scroller', {
                [apis.MOUNTED](el:Element, binding:any) {
                    initScroller(el,binding)
                },
                [apis.UPDATED](el:Element, binding:any){
                    initScroller(el,binding)
                },
                [apis.UNMOUNTED](el:HTMLElement) {
                    (el as any).scroller.destroy()
                }
              })
        }
    }
}