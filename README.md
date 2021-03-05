# view-scroller ![GitHub package.json version](https://img.shields.io/github/package-json/v/chaosst/view-scroller) [![Build Status](https://travis-ci.org/chaosst/view-scroller.svg?branch=master)](https://travis-ci.org/chaosst/view-scroller) 

[view-scroller](https://github.com/chaosst/view-scroller) 是一款基于typeScript+snabbdom编写的滚动插件，可实现自定义滚动条样式，支持滚动顶部、底部、左边、右边事件，可实现无限滚动，上拉自动加载下一页等场景。兼容typeScript、vue2.0、vue3.0、react、angularJs等前端项目，兼容热重载开发。

#### 开发初衷

作为一个前端开发人员，开发的时候可能会遇到基于不同技术盏的项目，这种项目能共用的插件非常少，比如老旧的js插件用到vue项目可能会出现不兼容热重载的问题，又比如组件只兼容web端，在移动端黎表现力差这种问题，为了解决这些问题，我试着开发能兼容多种项目、多种客户端的插件。

## 浏览器兼容性

| browser | IE | Firefox | Chrome | Edge | Opera | safari |
| ------- | ------- | ------- | ------- | ------- | ------- | ------- |
| version | 10 | 69 | 64 | 79 | 51 | 13.1 |


## Demo
滚动插件demo：[https://chaosst.gitee.io/view-scroller/src/examples/index](https://chaosst.gitee.io/view-scroller/src/examples/index)
滚动插件移动端demo：[https://chaosst.gitee.io/view-scroller/src/examples/mobile](https://chaosst.gitee.io/view-scroller/src/examples/mobile)

## 如何启动项目例子
拉取github项目到本地后
```bash
npm run start
```
http://localhost:3000/src/examples/index 查看例子
http://localhost:3000/src/examples/mobile 查看移动端例子

## 如何使用

### Node（以Vue2.0为例）
兼容vue2.0、vue3.0、typeScript项目

#### 安装
```bash
npm i view-scroller -S
```

#### 例子
vue、react、angularjs建议使用vs-id进行初始化，可兼容条件渲染（此方式不兼容条件编译放在初始化元素里面）
```html
<!-- demo.vue -->
<template>
    <div class="page">
        <!-- 初始化元素不兼容使用v-if之类的条件编译，请使用一层容器包裹，包裹容器内使用条件编译 -->
        <div v-if="show">
            <el-form ref="form" vs-id="scroller">
                ...
            </el-form>
        </div>
    </div>
</template>
```
```js
/* demo.vue */
import { viewScroller } from 'view-scroller'
// v1.2.2版本开始，可不再引入index.css
// import 'view-scroller/dist/index.css'

export default{
    name:'demo',
    data(){
        return {
            scroller:null,
            show:true
        }
    },
    methods:{
      initScroller(){
        //可通过元素的vs-id来进行初始化滚动条（vue、react、angularjs建议使用vs-id进行初始化，可兼容条件渲染）
        this.scroller = viewScroller.init('scroller',{
            alwayShow:true,
            class:'myscroller',
            width:500,
            height:500,
            theme:'light',    
            /* 滚动事件，定义事件触发的四个方向距离 */
            limit:{
              top:10,
              bottom:10,
              left:10,
              right:10
            },
            /* 滚动条样式配置 */
            scrollBar:{
                size:10,
                right:0,
                bottom:0,
                minLength:40,
                spacing:14
            },
            on:{
                /* 可以监听滚动事件 */
                scroll:(e)=>{
                },
                scrollTop:(e)=>{
                    console.log('触发顶部事件')
                    e.done()
                }
            }
        })
      }  
    },
    mounted(){
        //初始化滚动条
        this.initScroller()
        /* 滚动方法 */
        this.scroller.scrollTo({x:0,y:100}, 500)
    }
}
```

### 浏览器
IE最低兼容到IE10，兼容各种主流浏览器

#### 安装
拉取github项目根目录下dist/index.global.js，dist/index.css到项目中
```html
<!-- 全局引入 -->
<script src="./dist/index.global.js"></script>
<!-- v1.2.2版本开始，可不再引入index.css -->
<!-- <link href="./dist/index.css" rel="stylesheet" type="text/css" /> -->
```
#### 例子
```html
<script>
        window.onload = function(){
            var el = document.getElementsByClassName('content')[0]
			// 传入元素对象初始化滚动条
            var scroller = window.viewScroller.init(el,{
                alwayShow:true,
				class:'myscroller',
				width:500,
				height:500,
				theme:'light',    
				/* 滚动事件，定义事件触发的四个方向距离 */
				limit:{
				  top:10,
				  bottom:10,
				  left:10,
				  right:10
				},
				/* 滚动条样式配置 */
				scrollBar:{
					size:10,
					right:0,
					bottom:0,
					minLength:40,
					spacing:14
				},
				on:{
					/* 可以监听滚动事件 */
					scroll:function(e){
					},
					scrollTop:function(e){
                        console.log('触发顶部事件')
                        e.done()
					}
				}
            })
			/* 滚动方法 */
			scroller.scrollTo({x:0,y:100}, 500)
		}
</script>
...
<body>
	<div class="page">
        <div class="content" vs-id="scroller">
		...
		</div>
	</div>
</body>
```


## API
#### viewScroller 对象属性:
- `version` 
- 当前插件的版本  ***v1.2.2+***

#### viewScroller 初始化方法:

- `init(el:HTMLElement, options?:ScorllBarOptions)` 
- 对节点el进行滚动条初始化，选项options为非必填

#### viewScroller 初始化属性ScorllBarOptions:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| mobile | 滚动插件是否设置为移动端模式，滚动触发事件会变成适配移动端的touch事件，alwayShow为false时的显示规则会变成滚动时出现，滚动完成后2秒消失  ***v1.2.0+*** | 否 | boolean | false |
| refresh | 滚动插件是否支持下拉刷新，具体配置看下表refreshOption  ***v1.2.2+*** | 否 | boolean object | false |
| width | 滚动插件外层容器的宽度，单位px，支持string设置其他单位 | 否 | string number | auto |
| height | 滚动插件外层容器的高度，单位px，支持string设置其他单位 | 否 | string number | auto |
| alwayShow | 滚动插件的滚动条是否一直可见 | 否 | boolean | false |
| class | 滚动插件外层容器的样式类名 | 否 | string |  |
| theme | 滚动插件的主题设置（dark 深色， light 浅色， dark-reverse 深色反转， light-reverse 浅色反转） | 否 | string | dark |
| limit | 配合滚动插件的scrollTop，scrollBottom，scrollLeft，scrollRight事件使用 | 否 | object |  |
| scrollBar | 滚动插件的样式设置 | 否 | object |  |
| on | 滚动插件的绑定事件集合，可在初始化时进行事件绑定 | 否 | object |  |

#### limit 属性:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| top | scrollTop事件触发距离，向顶部滚动时，当离顶部距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 10 |
| bottom | scrollBottom事件触发距离，向底部滚动时，当离底部距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 60 |
| left | scrollLeft事件触发距离，向左边滚动时，当离左边距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 10 |
| right | scrollRight事件触发距离，向右边滚动时，当离右边距离小于该值时触发，单位px，不支持string设置其他单位 | 否 | number | 60 |

#### scrollBar 属性:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| size | 滚动条的粗细（垂直方向的宽度或水平方向的高度），单位px，支持string设置其他单位 | 否 | number string | 6 |
| right | 垂直方向滚动条离容器最右方的距离，单位px，支持string设置其他单位 | 否 | number string | 4 |
| bottom | 水平方向滚动条离容器最底部的距离，单位px，支持string设置其他单位 | 否 | number string | 4 |
| radius | 滚动条的圆角设置，单位px | 否 | number string | 4 |
| minLength | 当容器滚动内容足够多的时候，可以设置滚动条最小的长度来避免滚动条会无限接近一个点，单位px，不支持string设置其他单位 | 否 | number | 20 |
| spacing | 滚动容器预留垂直方向或水平方向滚动条的间距空间，默认0，为0时嵌套滚动插件时的滚动条有可能出现多层重合，可以设置大于0的距离来解决这个问题，单位px，支持string设置其他单位 | 否 | number,string | 0 |

#### on 属性:

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| scroll | 滚动条的滚动事件，当容器内容滚动时触发 | 否 | function |  |
| scrollTop | 滚动容器滚动到顶部距离limit.top时触发，参数请查看下方事件 | 否 | function |  |
| scrollBottom | 滚动容器滚动到底部距离limit.bottom时触发，参数请查看下方事件 | 否 | function |  |
| scrollLeft | 滚动容器滚动到左边距离limit.left时触发，参数请查看下方事件 | 否 | function |  |
| scrollRight | 滚动容器滚动到右边距离limit.right时触发，参数请查看下方事件 | 否 | function |  |
| refresh | ScorllBarOptions.refresh设置后生效，刷新回调函数，参数请查看下方事件 ***v1.2.2+*** | 否 | function |  |

#### refresh 属性: ***v1.2.2+***

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| message | 下拉刷新时是否显示刷新提示文字，true的时候，则读取refresh.message的默认值，见下表refresh.message | 否 | boolean object | refresh.message默认值 |
| pullIcon | 下拉刷新的下拉动作图标样式class | 否 | string |  |
| refreshIcon | 下拉刷新的刷新中的图标样式class | 否 | string |  |
| distance | 下拉刷新的动作触发刷新的距离，最大120，单位：px | 否 | number | 65 |

#### refresh.message 属性: ***v1.2.2+***

| 属性 | 描述 | 是否必填 | 类型 |默认值|
|-----|-----|-----|-----|-----|
| pullMessage | 下拉刷新下拉动作提示文字 | 否 | string | 下拉进行刷新 |
| releaseMessage | 下拉刷新达到触发距离后的提示文字 | 否 | string | 释放进行刷新 |
| refreshMessage | 下拉刷新触发刷新后提示文字 | 否 | string | 刷新中 |

### viewScroller 初始化后的实例属性:

- `target` 
- 插件最外层元素对象 ***v1.2.2+***
- `currentTarget` 
- 插件需要滚动初始化的元素 ***v1.2.2+***

### viewScroller 初始化后的实例方法:

- `scrollXTo(value:number, duration?:number)` 
- 容器水平方向滚到到左边距离为value的位置，duration非必填，为滚动动画时间（单位：毫秒）
- `scrollYTo(value:number, duration?:number)` 
- 容器垂直方向滚到到左边距离为value的位置，duration非必填，为滚动动画时间（单位：毫秒）
- `scrollTo({x,y}:ScrollToJSON, duration?:number)` 
- 容器水平方向滚到到左边距离为x,垂直方向滚到到左边距离为y的位置，duration非必填，为滚动动画时间（单位：毫秒）
- `scrollTo({x,y}:ScrollToJSON, duration?:number)` 
- 容器水平方向滚到到左边距离为x,垂直方向滚到到左边距离为y的位置，duration非必填，为滚动动画时间（单位：毫秒）
- `getScrollerEvent()` 
- 返回滚动插件的当前滚动事件对象，可获取当前滚动条的scrollTop等信息 ***v1.2.2+***

### viewScroller 初始化后的事件:

- `onScroll(value:number, duration?:number)` 
- 同options.on.scroll，滚动容器滚动事件，当容器内容滚动时触发
- `onScrollTop(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollTop，滚动容器滚动到顶部距离limit.top时触发，完成后需要调用ScrollerEv.done()修改状态
- `onScrollBottom(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollBottom，滚动容器滚动到底部距离limit.bottom时触发，完成后需要调用ScrollerEv.done()修改状态
- `onScrollLeft(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollLeft，滚动容器滚动到左边距离limit.left时触发，完成后需要调用ScrollerEv.done()修改状态
- `onScrollRight(callback:Funciton(ScrollerEv))` 
- 同options.on.scrollRight，滚动容器滚动到右边距离limit.right时触发，完成后需要调用ScrollerEv.done()修改状态
- `onRefresh(callback:Funciton(done:Function))` 
- 同options.on.refresh，触发刷新后的回调函数，需要done()完成刷新重置状态 ***v1.2.2+***

#### ScrollerEv可读属性
| 属性 | 描述 |
|-----|-----|
| width | 滚动容器的内容区域width+左右padding+左右border |
| height | 滚动容器的内容区域height+上下padding+上下border |
| offsetTop | 滚动容器到定位父节点的top方向的距离 |
| offsetLeft | 滚动容器到定位父节点的left方向的距离 |
| scrollWidth | 滚动容器可滚动的垂直高度 |
| scrollHeight | 滚动容器可滚动的水平宽度 |
| scrollTop | 滚动容器垂直方向滚动距离 |
| scrollLeft | 滚动容器水平方向滚动距离 |
| clientWidth | 滚动容器的内容区域width+左右padding（可视区域width的大小） |
| clientHeight | 滚动容器的内容区域height+上下padding（可视区域height的大小） |
| clientTop | 滚动容器上边框 |
| clientLeft | 滚动容器左边框 |
| target | 滚动容器html对象 |
| done | 事件完成的回调方法，修改滚动事件（scrollTop,scrollBottom,scrollLeft,scrollRight）的状态 |

## 更新记录

#### v1.2.2 更新
- 1、新增下拉刷新功能，兼容pc端和移动端
- 2、新增下拉刷新事件
- 3、新增了通过添加vs-id节点属性后，作为init方法的第一个参数传入进行初始化（以解决兼容类似vue中v-if的操作导致节点消失后重现初始化失效的问题）
- 4、viewScroller对象新增version属性，返回插件版本
- 5、viewScroller初始化后的实例新增target属性和currentTarget属性，target属性返回插件最外层元素，currentTarget属性返回需要滚动初始化的元素
- 6、viewScroller初始化后的实例新增getScrollerEvent返回当前滚动插件的ScrollerEv对象
- 7、插件安装后不再需要引入dist/index.css文件，改为内联样式

#### v1.2.0 更新
- 1、适配移动端的滚动条拖动
- 2、多层嵌套滚动条时，处理每层的滚动条层级问题，以保证里层的滚动条能被抓取到
- 3、部分参数添加字符串配置，可以通过字符串实现配置rem，em等css单位兼容移动端布局