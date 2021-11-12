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
    if((el as any)._viewScrollerEl && el.contains((el as any)._viewScrollerEl)){
        initEl = (el as any)._viewScrollerEl
    } else if(binding.value as DirectiveOptions && binding.value.selector as string){
        (el as any)._viewScrollerEl = null;
        initEl = el.querySelector(binding.value.selector)
    }
    if(!(el as any)._viewScrollerEl){
        if(initEl){
            (initEl as any).scroller = viewScroller.init(initEl,opt);
            (el as any)._viewScrollerEl = initEl;
        }
    }else if((initEl as any).scroller){
        (initEl as any).scroller.update()
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
                    debugger
                    if((el as any)._viewScrollerEl){
                        (el as any)._viewScrollerEl.scroller.destroy()
                    }
                }
              })
        }
    }
}