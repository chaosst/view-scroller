import ScrollerBar from './libs/scroller';
import './styles/scroller.scss';
declare global {
    interface Window {
        viewScroller: object;
    }
    interface HTMLElement {
        vScrollTo: Function;
    }
}
/**
 * 滚动条插件传入的参数接口
 */
export declare interface ScorllBarOptions {
    alwayShow?: boolean;
    on?: {
        scroll?: Function;
        scrollTop?: Function;
        scrollBottom?: Function;
        scrollLeft?: Function;
        scrollRight?: Function;
    };
    class?: string;
    theme?: string;
    limit?: {
        top?: number;
        left?: number;
        bottom?: number;
        right?: number;
    };
    scrollBar?: {
        size?: number | string;
        right?: number | string;
        bottom?: number | string;
        minLength?: number;
        spacing?: number;
    };
    width?: number | string;
    height?: number | string;
}
export interface ScrollToJSON {
    x?: number;
    y?: number;
}
export interface ScorllBarOptionsRequired extends ScorllBarOptions {
    alwayShow: boolean;
    on: {
        scroll: Function;
        scrollTop: Function;
        scrollBottom: Function;
        scrollLeft: Function;
        scrollRight: Function;
    };
    class: string;
    theme: string;
    limit: {
        top: number;
        left: number;
        bottom: number;
        right: number;
    };
    scrollBar: {
        size: number | string;
        right: number | string;
        bottom: number | string;
        minLength: number;
        spacing: number;
    };
    width?: number | string;
    height?: number | string;
}
/**
 * 封装类
 */
declare class ScrollerController {
    private options;
    constructor();
    init(el: HTMLElement, options?: ScorllBarOptions): ScrollerBar;
}
export declare const viewScroller: ScrollerController;
export {};
