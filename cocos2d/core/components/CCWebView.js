/*global _ccsg */

/****************************************************************************
 Copyright (c) 2013-2016 Chukong Technologies Inc.
 http://www.cocos.com
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated engine source code (the "Software"), a limited,
 worldwide, royalty-free, non-assignable, revocable and  non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
 not use Cocos Creator software for developing other software or tools that's
 used for developing games. You are not granted to publish, distribute,
 sublicense, and/or sell copies of Cocos Creator.
 The software or tools in this License Agreement are licensed, not sold.
 Chukong Aipu reserves all rights not expressly granted to you.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var EventType = _ccsg.WebView.EventType;

/*
 * !#en WebView event type
 * !#zh   WebView 事件类型
 * @enum WebView.EventType
 */

/*
 * !#en Web page Load completed.
 * !#zh  网页加载完成
 * @property {String} LOADED
 */

/**
 * !#en cc.WebView is a component for display web pages in the game
 * !#zh WebView 组件，用于在游戏中显示网页
 * @class WebView
 * @extends _RendererUnderSG
 */
var WebView = cc.Class({
    name: 'cc.WebView',
    extends: cc._RendererUnderSG,

    editor: CC_EDITOR && {
        menu: 'i18n:MAIN_MENU.component.ui/WebView'
    },

    properties: {
        _useOriginalSize: true,

        _url: '',
        /**
         * !#en A given URL to be loaded by the WebView, it should have a http or https prefix.
         * !#zh 指定 WebView 加载的网址，它应该是一个 http 或者 https 开头的字符串
         * @property {String} url
         */
        url: {
            type: String,
            get: function () {
                return this._url;
            },
            set: function (url) {
                this._url = url;
                var sgNode = this._sgNode;
                if (sgNode) {
                    sgNode.loadURL(url);
                }
            }
        },

        /**
         * !#en The webview's event callback , it will be triggered when web page finished loading.
         * !#zh WebView 的回调事件，当网页加载完成之后会回调此函数
         * @property {cc.Component.EventHandler[]} webViewLoadedEvents
         */
        webViewLoadedEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },
        /**
         * !#en The webview's event callback , it will be triggered when web page is loading.
         * !#zh WebView 的回调事件，当网页加载时会回调此函数
         * @property {cc.Component.EventHandler[]} webViewLoadingEvents
         */
        webViewLoadingEvents: {
            default: [],
            type: cc.Component.EventHandler,
        },
        /**
         * !#en The webview's event callback , it will be triggered when there are errors when loading.
         * !#zh WebView 的回调事件，当网页加载出错时会回调此函数
         * @property {cc.Component.EventHandler[]} webViewErrorEvents
         */
        webViewErrorEvents: {
            default: [],
            type: cc.Component.EventHandler,
        }
    },

    statics: {
        EventType: EventType,
    },

    onLoad: CC_JSB && function() {
        if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
            this.enabled = false;
        }
    },

    _createSgNode: function () {
        if(CC_JSB) {
            if (cc.sys.os === cc.sys.OS_OSX || cc.sys.os === cc.sys.OS_WINDOWS) {
                console.log('WebView is not supported on Mac and Windows!');
                return null;
            }
        }
        return new _ccsg.WebView();
    },

    _initSgNode: function () {
        var sgNode = this._sgNode;
        if (!sgNode) return;

        if(!CC_JSB) {
            sgNode.createDomElementIfNeeded();
        }
        sgNode.setEventListener(EventType.LOADED , this._onWebViewLoaded.bind(this));
        sgNode.setEventListener(EventType.LOADING , this._onWebViewLoading.bind(this));
        sgNode.setEventListener(EventType.ERROR , this._onWebViewLoadError.bind(this));

        sgNode.loadURL(this._url);

        if (CC_EDITOR && this._useOriginalSize) {
            this.node.setContentSize(sgNode.getContentSize());
            this._useOriginalSize = false;
        } else {
            sgNode.setContentSize(this.node.getContentSize());
        }
    },

    _onWebViewLoaded: function () {
        cc.Component.EventHandler.emitEvents(this.webViewLoadedEvents, this, EventType.LOADED);
    },

    _onWebViewLoading: function () {
        cc.Component.EventHandler.emitEvents(this.webViewLoadingEvents, this, EventType.LOADING);
        return true;
    },

    _onWebViewLoadError: function () {
        cc.Component.EventHandler.emitEvents(this.webViewErrorEvents, this, EventType.ERROR);
    }

});

cc.WebView = module.exports = WebView;