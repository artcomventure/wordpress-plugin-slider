(()=>{"use strict";const e=window.wp.element,l=window.wp.i18n,t=window.wp.blocks,a=window.wp.blockEditor,i=window.wp.components,n=window.wp.compose,o=window.wp.data,r=window.wp.primitives,s=(0,e.createElement)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(r.Path,{d:"M15.6 6.5l-1.1 1 2.9 3.3H8c-.9 0-1.7.3-2.3.9-1.4 1.5-1.4 4.2-1.4 5.6v.2h1.5v-.3c0-1.1 0-3.5 1-4.5.3-.3.7-.5 1.3-.5h9.2L14.5 15l1.1 1.1 4.6-4.6-4.6-5z"})),d=(0,e.createElement)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(r.Path,{d:"M18.5 5.5h-13c-1.1 0-2 .9-2 2v9c0 1.1.9 2 2 2h13c1.1 0 2-.9 2-2v-9c0-1.1-.9-2-2-2zm.5 11c0 .3-.2.5-.5.5h-13c-.3 0-.5-.2-.5-.5v-9c0-.3.2-.5.5-.5h13c.3 0 .5.2.5.5v9zM6.5 12H8v-2h2V8.5H6.5V12zm9.5 2h-2v1.5h3.5V12H16v2z"})),c=(0,e.createElement)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(r.Path,{d:"M11.1 15.8H20v-1.5h-8.9v1.5zm0-8.6v1.5H20V7.2h-8.9zM6 13c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"})),p=(0,e.createElement)(r.SVG,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},(0,e.createElement)(r.Path,{d:"M7.5 12C7.5 11.1716 6.82843 10.5 6 10.5C5.17157 10.5 4.5 11.1716 4.5 12C4.5 12.8284 5.17157 13.5 6 13.5C6.82843 13.5 7.5 12.8284 7.5 12Z"}),(0,e.createElement)(r.Path,{d:"M13.5 12C13.5 11.1716 12.8284 10.5 12 10.5C11.1716 10.5 10.5 11.1716 10.5 12C10.5 12.8284 11.1716 13.5 12 13.5C12.8284 13.5 13.5 12.8284 13.5 12Z"}),(0,e.createElement)(r.Path,{d:"M19.5 12C19.5 11.1716 18.8284 10.5 18 10.5C17.1716 10.5 16.5 11.1716 16.5 12C16.5 12.8284 17.1716 13.5 18 13.5C18.8284 13.5 19.5 12.8284 19.5 12Z"})),u=(0,n.compose)([(0,n.withState)(),(0,o.withSelect)(((e,l)=>({slides:e("core/block-editor").getBlockCount(l.clientId)||1,slide:1,...l})))])((t=>{let{attributes:n,slides:r,slide:p,clientId:u,setAttributes:w,..._}=t;const{setState:h}=_;let g=(0,o.select)("core/block-editor").getBlocksByClientId(u)[0].innerBlocks.map((e=>e.clientId));return(0,o.subscribe)((()=>{let e=(0,o.select)("core/block-editor").getBlocksByClientId(u)[0];e&&(e=e.innerBlocks.map((e=>e.clientId)),e.length!==g.length&&(e.length>g.length&&"slide"===n.blockView&&h({slide:e.length}),g=e))})),(0,e.createElement)(e.Fragment,null,(0,e.createElement)(a.InspectorControls,null,(0,e.createElement)(i.PanelBody,{title:(0,l.__)("Slider Settings","slider"),className:"slider-settings-panel"},(0,e.createElement)(i.PanelBody,{title:(0,l.__)("Display","slider"),initialOpen:!1,icon:s},(0,e.createElement)(e.Fragment,null,(0,e.createElement)(i.TextControl,{label:(0,l.__)("Slides per view","slider"),help:(0,l.__)('Number (or "auto") of slides visible at the same time on slider\'s container.',"slider"),value:n.slidesPerView,placeholder:m.attributes.slidesPerView.default,onChange:e=>{"a"===e?e="auto":"aut"===e&&(e=""),/^(|\d+|auto)$/.test(e)&&w({slidesPerView:e})}})),(0,e.createElement)(i.__experimentalNumberControl,{label:(0,l.__)("Space between slides (in px)","slider"),min:0,value:n.spaceBetween,placeholder:m.attributes.spaceBetween.default,onChange:e=>w({spaceBetween:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Show overflow","slider"),help:(0,l.__)("Show slides outside of slider's premises.","slider"),checked:n.showOverflow,onChange:e=>w({showOverflow:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Center slides","slider"),help:(0,l.__)("Active slide will be centered, not always on the left side.","slider"),checked:n.centeredSlides,onChange:e=>w({centeredSlides:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Auto height","slider"),help:(0,l.__)("Enable and slider wrapper will adapt its height to the height of the currently active slide.","slider"),checked:n.autoHeight,onChange:e=>w({autoHeight:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Navigation","slider"),help:(0,l.__)("Aka prev and next buttons.","slider"),checked:n.navigation,onChange:e=>w({navigation:e})}),(0,e.createElement)(i.SelectControl,{label:(0,l.__)("Pagination","slider"),value:n.pagination,options:[{value:!1,label:(0,l.__)("Nope","slider")},{value:"bullets",label:(0,l.__)("Bullets","slider")},{value:"fraction",label:(0,l.__)("Fraction","slider")},{value:"progressbar",label:(0,l.__)("Progressbar","slider")},{value:"scrollbar",label:(0,l.__)("Scrollbar","slider")}],onChange:e=>w({pagination:e})})),(0,e.createElement)(i.PanelBody,{title:(0,l.__)("Animation","slider"),initialOpen:!1,icon:s},(0,e.createElement)(i.SelectControl,{label:(0,l.__)("Transition effect","slider"),value:n.effect,options:[{value:"slide",label:(0,l.__)("slide","slider")},{value:"fade",label:(0,l.__)("fade","slider")},{value:"cube",label:(0,l.__)("cube","slider")},{value:"coverflow",label:(0,l.__)("coverflow","slider")},{value:"flip",label:(0,l.__)("flip","slider")},{value:"cards",label:(0,l.__)("cards","slider")}],onChange:e=>w({effect:e})}),(0,e.createElement)(e.Fragment,null,(0,e.createElement)(i.__experimentalNumberControl,{label:(0,l.__)("Speed","slider"),value:n.speed!==m.attributes.speed.default?n.speed:"",min:0,placeholder:m.attributes.speed.default,onChange:e=>w({speed:e})}),(0,e.createElement)("p",{className:"components-base-control__help"},(0,l.__)("Duration of transition between slides (in ms).","slider"))),(0,e.createElement)(i.SelectControl,{label:(0,l.__)("Direction","slider"),value:n.direction,options:[{value:"horizontal",label:(0,l.__)("horizontal","slider")},{value:"vertical",label:(0,l.__)("vertical","slider")}],onChange:e=>w({direction:e})})),(0,e.createElement)(i.PanelBody,{title:(0,l.__)("Behaviour","slider"),initialOpen:!1,icon:s},(0,e.createElement)(i.TextControl,{label:(0,l.__)("Slides per group","slider"),help:(0,l.__)('Set numbers of slides to define and enable group sliding. "auto" will slide as many slides as defined in "Slides per view".',"slider"),value:n.slidesPerGroup,disabled:1===n.slidesPerView,placeholder:m.attributes.slidesPerGroup.default,onChange:e=>{"a"===e?e="auto":"aut"===e&&(e=""),/^(|\d+|auto)$/.test(e)&&w({slidesPerGroup:e})}}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Loop","slider"),help:(0,l.__)("Enable continuous loop mode.","slider"),disabled:n.rewind,checked:n.loop,onChange:e=>w({loop:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Rewind","slider"),help:(0,l.__)("Last slide will slide back to the first slide and vice versa.","slider"),disabled:n.loop,checked:n.rewind,onChange:e=>w({rewind:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Slide to clicked slide","slider"),help:(0,l.__)("Click on any slide will produce transition to this slide.","slider"),checked:n.slideToClickedSlide,onChange:e=>w({slideToClickedSlide:e})}),(0,e.createElement)(e.Fragment,null,(0,e.createElement)(i.__experimentalNumberControl,{label:(0,l.__)("Autoplay","slider"),value:n.autoplay!==m.attributes.autoplay.default&&n.autoplay||"",min:0,placeholder:m.attributes.autoplay.default,onChange:e=>w({autoplay:e})}),(0,e.createElement)("p",{className:"components-base-control__help"},(0,l.__)("Delay between transitions (in ms).","slider"))),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Keyboard control","slider"),help:(0,l.__)("Sliders currently in viewport can be controlled using the keyboard.","slider"),checked:n.keyboard,onChange:e=>w({keyboard:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Simulate touch","slider"),help:(0,l.__)("Slider will accept mouse events like touch events (click and drag to change slides).","slider"),checked:n.simulateTouch,onChange:e=>w({simulateTouch:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Mouse wheel","slider"),help:(0,l.__)("Navigate through slides using mouse wheel.","slider"),checked:n.mousewheel,onChange:e=>w({mousewheel:e})}),(0,e.createElement)(i.ToggleControl,{label:(0,l.__)("Release on edges","slider"),help:(0,l.__)("Allow page scrolling when swiper is on edge positions (in the beginning or in the end)","slider"),disabled:!n.mousewheel,checked:n.releaseOnEdges,onChange:e=>w({releaseOnEdges:e})})))),(0,e.createElement)(a.BlockControls,null,(0,e.createElement)(i.ToolbarGroup,null,(0,e.createElement)(i.ToolbarButton,{icon:d,label:(0,l.__)("Slide view","slider"),onClick:()=>w({blockView:"slide"})}),(0,e.createElement)(i.ToolbarButton,{icon:c,label:(0,l.__)("List view","slider"),onClick:()=>w({blockView:"list"})}))),(0,e.createElement)("div",{className:"swiper","data-view":n.blockView,"data-slide":p},(0,e.createElement)("div",{className:"swiper-wrapper"},(0,e.createElement)(a.InnerBlocks,{allowedBlocks:["acv/slide"],template:Array(r).fill(["acv/slide"]),templateLock:!1})),(0,e.createElement)("div",{className:"swiper-pagination"},Array(r).fill().map(((t,a)=>(0,e.createElement)("span",{className:p===++a?"active":"",title:(0,l.__)("show slide %d","slider").replace("%d",a),onClick:()=>h({slide:a})},a))))))})),m=(0,t.registerBlockType)("acv/slider",{title:(0,l.__)("Slider","slider"),description:(0,l.__)("Swiper goes Gutenberg.","slider"),icon:p,category:"media",supports:{align:["wide","full"],color:!0},attributes:{blockView:{type:"string",default:"slide"},showOverflow:{type:"boolean",default:!1},autoHeight:{type:"boolean",default:!1},autoplay:{type:"string",default:"3000"},centeredSlides:{type:"boolean",default:!1},direction:{type:"string",default:"horizontal"},effect:{type:"string",default:"slide"},keyboard:{type:"boolean",default:!1},loop:{type:"boolean",default:!1},mousewheel:{type:"boolean",default:!1},navigation:{type:"boolean",default:!1},pagination:{type:"string",default:"false"},releaseOnEdges:{type:"boolean",default:!1},rewind:{type:"boolean",default:!1},simulateTouch:{type:"boolean",default:!0},slidesPerGroup:{type:"string",default:"auto"},slidesPerView:{type:"string",default:"1"},slideToClickedSlide:{type:"boolean",default:!1},spaceBetween:{type:"string",default:"0"},speed:{type:"string",default:"300"}},edit:l=>(0,e.createElement)(u,l),save:function(l){let{attributes:t}=l;const i={...t};return Object.keys(i).map((e=>{m.attributes[e]&&(["blockView","showOverflow"].indexOf(e)>=0||m.attributes[e].default===i[e]||""===i[e])&&delete i[e]})),i.slidesPerGroup||(i.slidesPerGroup="auto"),(0,e.createElement)("div",{className:"swiper"+(t.showOverflow?" swiper-overflow-visible":""),"data-swiper":JSON.stringify(i)},(0,e.createElement)("div",{className:"swiper-wrapper"},(0,e.createElement)(a.InnerBlocks.Content,null)),(i.navigation||i.pagination)&&(0,e.createElement)("div",{className:"swiper-ui"},i.pagination&&("scrollbar"===i.pagination?(0,e.createElement)("div",{className:"swiper-scrollbar"}):(0,e.createElement)("div",{className:"swiper-pagination"})),i.navigation&&(0,e.createElement)("div",{className:"swiper-button-prev"}),i.navigation&&(0,e.createElement)("div",{className:"swiper-button-next"})))}});(0,t.registerBlockType)("acv/slide",{title:(0,l.__)("Slide","slider"),parent:["acv/slider"],supports:{color:!0},edit:l=>{let{clientId:t}=l;return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(a.InnerBlocks,{templateLock:!1,renderAppender:()=>(0,e.createElement)(a.ButtonBlockAppender,{rootClientId:t})}))},save:()=>(0,e.createElement)("div",{className:"swiper-slide"},(0,e.createElement)(a.InnerBlocks.Content,null))})})();