import "babel-polyfill";
import { viewScroller, directives } from './index'

declare global {
    interface Window {
        viewScroller: object
    }
}
(viewScroller as any).directives = directives

if(typeof window !== 'undefined'){
    window.viewScroller = viewScroller
}