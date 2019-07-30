//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {


    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

   
    /**
     * 创建场景界面
     * Create scene interface
     */

    private point:egret.Point;
    private  dbPlayer:DBPlayer; 
    protected createGameScene(): void {
        
        //普通方式播放龙骨动画，引入动画将其加载进去，新旧版本会存在差异，旧的api已经不适合用	      
        this.dbPlayer = DBPlayer.NewDBPlayer();
        this.dbPlayer.completeFun = Handler.create(this.onPlayComplete,this);
        this.dbPlayer.show("10001",this,-1,"run","armatureName");     
        this.dbPlayer.x  = 200;
        this.dbPlayer.y  = 600;
        this.dbPlayer.touchEnabled = true;
        this.dbPlayer.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onStartDrag,this);
    }

    private onStartDrag(e:egret.TouchEvent):void{
      
      this.point = new egret.Point(e.stageX,e.stageY);
      this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.onDragMove,this);
      this.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.onDragStop,this);
    }   
    
     private onDragMove(e:egret.TouchEvent):void
     {
           var dx = e.stageX - this.point.x;
           var dy = e.stageY - this.point.y;
           this.dbPlayer.x  += dx; 
           this.dbPlayer.y  += dy; 
           this.point = new egret.Point(e.stageX,e.stageY);
     }

     private onDragStop(e:egret.TouchEvent):void
     {
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.onDragMove,this);
        this.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.onDragStop,this);
     }

	private onPlayComplete(obj:DBPlayer):void 
    {
           console.log("播放完毕");
          if(obj) obj.unload();
	}
 

}
