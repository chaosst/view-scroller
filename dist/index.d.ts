import ScrollerBar from './libs/scroller';
import './styles/scroller.scss';
declare global {
    interface Window {
        viewScroller: object;
    }
    interface HTMLElement {
        vScrollTo: Function;
        scrollTo: Function;
    }
}
/**
 * 滚动条插件传入的参数接口
 */
export declare interface ScorllBarOptions {
    alwayShow?: boolean;
    mobile?: boolean;
    refresh?: boolean | {
        message?: boolean | {
            pullMessage?: string;
            releaseMessage?: string;
            refreshMessage?: string;
        };
        pullIcon?: string;
        refreshIcon?: string;
        distance?: number;
    };
    on?: {
        scroll?: Function;
        scrollTop?: Function;
        scrollBottom?: Function;
        scrollLeft?: Function;
        scrollRight?: Function;
        refresh?: Function;
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
        spacing?: number | string;
        radius?: number | string;
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
    mobile: boolean;
    refresh: boolean | {
        message: boolean | {
            pullMessage: string;
            releaseMessage: string;
            refreshMessage: string;
        };
        pullIcon: string;
        refreshIcon: string;
        distance: number;
    };
    on: {
        scroll: Function;
        scrollTop: Function;
        scrollBottom: Function;
        scrollLeft: Function;
        scrollRight: Function;
        refresh: Function;
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
        spacing: number | string;
        radius: number | string;
    };
    width?: number | string;
    height?: number | string;
}
/**
 * 封装类
 */
declare class ScrollerController {
    /**
     * 插件版本查询
     */
    version: string;
    /**
     * options.refresh设为true时的默认配置
     */
    private refreshOptions;
    private options;
    constructor();
    init(el: Element | string, options?: ScorllBarOptions): ScrollerBar;
}
export declare const viewScroller: ScrollerController;
export {};
