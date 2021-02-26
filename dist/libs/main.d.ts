import { EventBus } from './bus';
/**
 * 公共方法集合
 */
declare class Public {
    CSS_UNIT: string;
    SCROLL_MINLENGTH: number;
    unitFormat(value?: number | string): string;
    themeSet(theme: string): string;
    isOpera: boolean;
    isIE: true | RegExpMatchArray | null;
    isEdge: boolean;
    isFF: boolean;
    isSafari: boolean;
    isChrome: boolean;
    getRealPx(val?: number | string): string;
}
export declare const mPublic: Public;
export declare class Scroller {
    public: Public;
    bus: EventBus;
    constructor();
}
export {};
