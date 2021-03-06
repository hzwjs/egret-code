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

    private mc:egret.MovieClip;

    protected createGameScene(): void {
        this.createBtns();
        this.mcPlayer2();  
    }

    private createBtns():void{
    
        var btn:eui.Button = new eui.Button();
        btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTestTween,this);
        btn.x = 20;
        btn.y = 20;
        btn.width = 240;
        btn.height = 100;
        btn.label = "Tween";
        this.addChild(btn);
    }

    private onTestTween(event:egret.TouchEvent):void
    {
        //移动一个mc对象到对应的位置
        egret.Tween.get(this.mc).to({x:500},2000).call(()=>{
            alert('Tween Over');
        })
    }

    private mcPlayer2():void{
		    var mcData = RES.getRes( "Dragon_1_mc_json");
		    var texture = RES.getRes( "Dragon_1_tex_png");		 
		    var factory:egret.MovieClipDataFactory = new  egret.MovieClipDataFactory(mcData,texture);
            this.mc = new egret.MovieClip(factory.generateMovieClipData('Dragon_1'));
            this.mc.gotoAndPlay('walk',-1);
            this.mc.x = 2;
            this.mc.y = 500;
            this.mc.scaleX = -1;
            this.addChild(this.mc);		    
    }

    private mcPlayer():void{
		    var mcData = RES.getRes( "turretskin3_json");
		    var texture = RES.getRes( "turretskin3_png");		 
		    var factory:egret.MovieClipDataFactory = new  egret.MovieClipDataFactory(mcData,texture);
            var mc:egret.MovieClip = new egret.MovieClip(factory.generateMovieClipData('turretskin3'));
            mc.play(-1);
            mc.x = 200;
            mc.scaleX = 2;
            mc.scaleY = 2;
            mc.y = 200;
            this.addChild(mc);		    
    }


}
