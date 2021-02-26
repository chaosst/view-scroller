import "babel-polyfill";
import { viewScroller } from './index'

declare global {
    interface Window {
        viewScroller: object
    }
}

if(typeof window !== 'undefined'){
    window.viewScroller = viewScroller
}