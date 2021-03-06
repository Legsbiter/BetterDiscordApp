/* BetterDiscordApp Core JavaScript
 * Version: 1.52
 * Author: Jiiks | http://jiiks.net
 * Date: 27/08/2015 - 16:36
 * Last Update: 24/010/2015 - 17:27
 * https://github.com/Jiiks/BetterDiscordApp
 */


var settingsPanel, emoteModule, utils, quickEmoteMenu, opublicServers, voiceMode, pluginModule, themeModule;
var jsVersion = 1.54;
var supportedVersion = "0.2.3";

var mainObserver;

var twitchEmoteUrlStart = "https://static-cdn.jtvnw.net/emoticons/v1/";
var twitchEmoteUrlEnd = "/1.0";
var ffzEmoteUrlStart = "https://cdn.frankerfacez.com/emoticon/";
var ffzEmoteUrlEnd = "/1";
var bttvEmoteUrlStart = "https://cdn.betterttv.net/emote/";
var bttvEmoteUrlEnd = "/1x";

var mainCore;

var settings = {
    "Save logs locally":          { "id": "bda-gs-0", "info": "Saves chat logs locally",                        "implemented": false },
    "Public Servers":             { "id": "bda-gs-1", "info": "Display public servers button",                  "implemented": true  },
    "Minimal Mode":               { "id": "bda-gs-2", "info": "Hide elements and reduce the size of elements.", "implemented": true  },
    "Voice Mode":                 { "id": "bda-gs-4", "info": "Only show voice chat",                           "implemented": true  },
    "Hide Channels":              { "id": "bda-gs-3", "info": "Hide channels in minimal mode",                  "implemented": true  },
    "Quick Emote Menu":           { "id": "bda-es-0", "info": "Show quick emote menu for adding emotes",        "implemented": true  },
    "Show Emotes":                { "id": "bda-es-7", "info": "Show any emotes",                                "implemented": true  },
    "FrankerFaceZ Emotes":        { "id": "bda-es-1", "info": "Show FrankerFaceZ Emotes",                       "implemented": true  },
    "BetterTTV Emotes":           { "id": "bda-es-2", "info": "Show BetterTTV Emotes",                          "implemented": true  },
    "Emote Autocomplete":         { "id": "bda-es-3", "info": "Autocomplete emote commands",                    "implemented": false },
    "Emote Auto Capitalization":  { "id": "bda-es-4", "info": "Autocapitalize emote commands",                  "implemented": true  },
    "Override Default Emotes":    { "id": "bda-es-5", "info": "Override default emotes",                        "implemented": false },
    "Show Names":                 { "id": "bda-es-6", "info": "Show emote names on hover",                      "implemented": true  }
}

var links = {
    "Jiiks.net": { "text": "Jiiks.net", "href": "http://jiiks.net",          "target": "_blank" },
    "twitter":   { "text": "Twitter",   "href": "http://twitter.com/jiiksi", "target": "_blank" },
    "github":    { "text": "Github",    "href": "http://github.com/jiiks",   "target": "_blank" }
};

var defaultCookie = {
    "version":  jsVersion,
    "bda-gs-0": false,
    "bda-gs-1": true,
    "bda-gs-2": false,
    "bda-gs-3": false,
    "bda-gs-4": false,
    "bda-es-0": true,
    "bda-es-1": false,
    "bda-es-2": false,
    "bda-es-3": false,
    "bda-es-4": false,
    "bda-es-5": true,
    "bda-es-6": true,
    "bda-es-7": true,
    "bda-jd":   true
};

var bdchangelog = {
    "changes": {
        "favemotes": {
            "title": "Favorite Emotes!",
            "text": "You can now favorite emotes and have them listed in the quick emote menu!",
            "img": ""
        },
        "plugins": {
            "title": "Plugins!",
            "text": "Combined with Core 0.2.3, you can now write JavaScript plugins for Discord!",
            "img": ""
        },
        "settingsmenu": {
            "title": "Settings Menu!",
            "text": "New and improved settings menu!",
            "img": ""
        },
        "csseditor": {
            "title": "New CSS Editor!",
            "text": "New CSS Editor powered by <a href='http://codemirror.net' target='_blank'>CodeMirror!</a>",
            "img": ""  
        },
        "minimalmode": {
            "title": "Minimal mode makeover!", 
            "text": "New and improved minimal mode!",
            "img": ""
        }
    },
    "fixes": {
        "reload": {
            "title": "Reload Fix!",
            "text": "Fixed an issue that caused Discord to crash on reload!",
            "img": ""  
        },
		"eemotes": {
			"title": "Edit Emotes!",
			"text": "Edited messages now display emotes properly!",
			"img": ""
		},
        "pservers": {
            "title": "Public Servers",
            "text": "Public servers have been fixed!",
            "img": ""
        },
        "other": {
            "title": "Bugfixes!",
            "text": "Several smaller bugs fixed!",
            "img": ""
        }
	},
    "upcoming": {
        "ignore": {
            "title": "Ignore User!",
            "text": "Ignore users you don't like!",
            "img": ""
        },
        "themes": {
            "title": "Custom themes!",
            "text": "Write your own or download custom themes!",
            "img": ""  
        },
        "favemotes": {
            "title": "Favorite emotes!",
            "text": "Add your favorite emote(s) to the quick emote menu!",
            "img": ""  
        },
        "more": {
            "title": "More Things!",
            "text": "More things but probably not in the next version!",
            "img": ""
        }
    }
};

var settingsCookie = {};

function Core() {}

Core.prototype.init = function() {

    var self = this;

    if(version < supportedVersion) {
        alert("BetterDiscord v" + version + "(your version)" + " is not supported by the latest js("+jsVersion+"). Please download the latest version from betterdiscord.net");
        return;
    }

    utils = new Utils();
    utils.getHash();
    emoteModule = new EmoteModule();
    quickEmoteMenu = new QuickEmoteMenu();
    voiceMode = new VoiceMode();

    emoteModule.init();

    this.initSettings();
    this.initObserver();

    //Incase were too fast
    function gwDefer() {
        console.log(new Date().getTime() + " Defer");
        if($(".guilds-wrapper .guilds").children().length > 0) {
            console.log(new Date().getTime() + " Defer Loaded");
            var guilds = $(".guilds li:first-child");

            guilds.after($("<li></li>", { id: "bd-pub-li", css: { "height": "20px", "display": settingsCookie["bda-gs-1"] == true ? "" : "none" } }).append($("<div/>", { class: "guild-inner", css: { "height": "20px", "border-radius": "4px" } }).append($("<a/>").append($("<div/>", { css: { "line-height": "20px", "font-size": "12px" }, text: "public", id: "bd-pub-button" })))));

            var showChannelsButton = $("<button/>", {
                class: "btn",
                id: "bd-show-channels",
                text: "R",
                css: {
                    "cursor": "pointer"
                },
                click: function() {
                    settingsCookie["bda-gs-3"] = false;
                    $("body").removeClass("bd-minimal-chan");
                    self.saveSettings();
                }
            });

            $(".guilds-wrapper").prepend(showChannelsButton);

            opublicServers = new PublicServers();

            pluginModule = new PluginModule();
            pluginModule.loadPlugins();
            if(typeof(themesupport2) !== "undefined") {
                themeModule = new ThemeModule();
                themeModule.loadThemes();
            }

            settingsPanel = new SettingsPanel();
            settingsPanel.init();

            quickEmoteMenu.init(false);

            $("#tc-settings-button").on("click", function() { settingsPanel.show(); });
            $("#bd-pub-button").on("click", function() { opublicServers.show(); });

            opublicServers.init();

            emoteModule.autoCapitalize();




            /*Display new features in BetterDiscord*/
            if(settingsCookie["version"] < jsVersion) {
                var cl = self.constructChangelog();
                $("body").append(cl);
                settingsCookie["version"] = jsVersion;
                self.saveSettings();
            }
			$("head").append('<script>Date.now||(Date.now=function(){return(new Date).getTime()}),function(){"use strict";for(var t=["webkit","moz"],e=0;e<t.length&&!window.requestAnimationFrame;++e){var i=t[e];window.requestAnimationFrame=window[i+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i+"CancelAnimationFrame"]||window[i+"CancelRequestAnimationFrame"]}if(/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent)||!window.requestAnimationFrame||!window.cancelAnimationFrame){var s=0;window.requestAnimationFrame=function(t){var e=Date.now(),i=Math.max(s+16,e);return setTimeout(function(){t(s=i)},i-e)},window.cancelAnimationFrame=clearTimeout}}(),function(t){t.snowfall=function(e,i){function s(s,n,a,o){this.x=s,this.y=n,this.size=a,this.speed=o,this.step=0,this.stepSize=h(1,10)/100,i.collection&&(this.target=m[h(0,m.length-1)]);var r=null;i.image?(r=document.createElement("img"),r.src=i.image):(r=document.createElement("div"),t(r).css({background:i.flakeColor})),t(r).attr({"class":"snowfall-flakes"}).css({width:this.size,height:this.size,position:i.flakePosition,top:this.y,left:this.x,fontSize:0,zIndex:i.flakeIndex}),t(e).get(0).tagName===t(document).get(0).tagName?(t("body").append(t(r)),e=t("body")):t(e).append(t(r)),this.element=r,this.update=function(){if(this.y+=this.speed,this.y>l-(this.size+6)&&this.reset(),this.element.style.top=this.y+"px",this.element.style.left=this.x+"px",this.step+=this.stepSize,this.x+=y===!1?Math.cos(this.step):y+Math.cos(this.step),i.collection&&this.x>this.target.x&&this.x<this.target.width+this.target.x&&this.y>this.target.y&&this.y<this.target.height+this.target.y){var t=this.target.element.getContext("2d"),e=this.x-this.target.x,s=this.y-this.target.y,n=this.target.colData;if(void 0!==n[parseInt(e)][parseInt(s+this.speed+this.size)]||s+this.speed+this.size>this.target.height)if(s+this.speed+this.size>this.target.height){for(;s+this.speed+this.size>this.target.height&&this.speed>0;)this.speed*=.5;t.fillStyle="#fff",void 0==n[parseInt(e)][parseInt(s+this.speed+this.size)]?(n[parseInt(e)][parseInt(s+this.speed+this.size)]=1,t.fillRect(e,s+this.speed+this.size,this.size,this.size)):(n[parseInt(e)][parseInt(s+this.speed)]=1,t.fillRect(e,s+this.speed,this.size,this.size)),this.reset()}else this.speed=1,this.stepSize=0,parseInt(e)+1<this.target.width&&void 0==n[parseInt(e)+1][parseInt(s)+1]?this.x++:parseInt(e)-1>0&&void 0==n[parseInt(e)-1][parseInt(s)+1]?this.x--:(t.fillStyle="#fff",t.fillRect(e,s,this.size,this.size),n[parseInt(e)][parseInt(s)]=1,this.reset())}(this.x+this.size>d-c||this.x<c)&&this.reset()},this.reset=function(){this.y=0,this.x=h(c,d-c),this.stepSize=h(1,10)/100,this.size=h(100*i.minSize,100*i.maxSize)/100,this.element.style.width=this.size+"px",this.element.style.height=this.size+"px",this.speed=h(i.minSpeed,i.maxSpeed)}}function n(){for(r=0;r<a.length;r+=1)a[r].update();f=requestAnimationFrame(function(){n()})}var a=[],o={flakeCount:35,flakeColor:"#ffffff",flakePosition:"absolute",flakeIndex:999999,minSize:1,maxSize:2,minSpeed:1,maxSpeed:5,round:!1,shadow:!1,collection:!1,collectionHeight:40,deviceorientation:!1},i=t.extend(o,i),h=function(t,e){return Math.round(t+Math.random()*(e-t))};t(e).data("snowfall",this);var r=0,l=t(e).height(),d=t(e).width(),c=0,f=0;if(i.collection!==!1){var p=document.createElement("canvas");if(p.getContext&&p.getContext("2d"))for(var m=[],w=t(i.collection),g=i.collectionHeight,r=0;r<w.length;r++){var u=w[r].getBoundingClientRect(),x=t("<canvas/>",{"class":"snowfall-canvas"}),z=[];if(u.top-g>0){t("body").append(x),x.css({position:i.flakePosition,left:u.left+"px",top:u.top-g+"px"}).prop({width:u.width,height:g});for(var v=0;v<u.width;v++)z[v]=[];m.push({element:x.get(0),x:u.left,y:u.top-g,width:u.width,height:g,colData:z})}}else i.collection=!1}for(t(e).get(0).tagName===t(document).get(0).tagName&&(c=25),t(window).bind("resize",function(){l=t(e)[0].clientHeight,d=t(e)[0].offsetWidth}),r=0;r<i.flakeCount;r+=1)a.push(new s(h(c,d-c),h(0,l),h(100*i.minSize,100*i.maxSize)/100,h(i.minSpeed,i.maxSpeed)));i.round&&t(".snowfall-flakes").css({"-moz-border-radius":i.maxSize,"-webkit-border-radius":i.maxSize,"border-radius":i.maxSize}),i.shadow&&t(".snowfall-flakes").css({"-moz-box-shadow":"1px 1px 1px #555","-webkit-box-shadow":"1px 1px 1px #555","box-shadow":"1px 1px 1px #555"});var y=!1;i.deviceorientation&&t(window).bind("deviceorientation",function(t){y=.1*t.originalEvent.gamma}),n(),this.clear=function(){t(".snowfall-canvas").remove(),t(e).children(".snowfall-flakes").remove(),cancelAnimationFrame(f)}},t.fn.snowfall=function(e){return"object"==typeof e||void 0==e?this.each(function(){new t.snowfall(this,e)}):"string"==typeof e?this.each(function(){var e=t(this).data("snowfall");e&&e.clear()}):void 0}}(jQuery);</script>');
			//By http://www.somethinghitme.com
   
   
            $("head").append("<style>.CodeMirror{ min-width:100%; }</style>");
   
            
        } else {
            setTimeout(gwDefer, 100);
        }
    }


    $(document).ready(function() {
        setTimeout(gwDefer, 1000);
    });
};

Core.prototype.initSettings = function() {
    if($.cookie("better-discord") == undefined) {
        settingsCookie = defaultCookie;
        this.saveSettings();
    } else {
        this.loadSettings();

        for(var setting in defaultCookie) {
            if(settingsCookie[setting] == undefined) {
                settingsCookie[setting] = defaultCookie[setting];
                this.saveSettings();
            }
        }
    }
};

Core.prototype.saveSettings = function() {
    $.cookie("better-discord", JSON.stringify(settingsCookie), { expires: 365, path: '/' });
};

Core.prototype.loadSettings = function() {
    settingsCookie = JSON.parse($.cookie("better-discord"));
};

Core.prototype.initObserver = function() {

    mainObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation.target.getAttribute('class') != null) {
                if(mutation.target.getAttribute('class').indexOf("titlebar") != -1) {
                    quickEmoteMenu.obsCallback();
                    voiceMode.obsCallback();
                }
            }
            emoteModule.obsCallback(mutation);

        });
    });

    //noinspection JSCheckFunctionSignatures
    mainObserver.observe(document, { childList: true, subtree: true });
};

Core.prototype.constructChangelog = function() {
    var changeLog = '' +
        '<div id="bd-wn-modal" class="modal" style="opacity:1;">' +
        '  <div class="modal-inner">' +
        '       <div id="bdcl" class="change-log"> ' +
        '           <div class="header">' +
        '               <strong>What\'s new in BetterDiscord JS v1.53&' + jsVersion + '</strong>' +
        '               <button class="close" onclick=\'$("#bd-wn-modal").remove();\'></button>' +
        '           </div><!--header-->' +
        '           <div class="scroller-wrap">' +
        '               <div class="scroller">';

    if(bdchangelog.changes != null) {
        changeLog += '' +
            '<h1 class="changelog-added">' +
            '   <span>New Stuff</span>' +
            '</h1>' +
            '<ul>';

        for(var change in bdchangelog.changes) {
            change = bdchangelog.changes[change];

            changeLog += '' +
                '<li>' +
                '   <strong>'+change.title+'</strong>' +
                '   <div>'+change.text+'</div>' +
                '</li>';
        }

        changeLog += '</ul>';
    }

    if(bdchangelog.fixes != null) {
        changeLog += '' +
            '<h1 class="changelog-fixed">' +
            '   <span>Fixed</span>' +
            '</h1>' +
            '<ul>';

        for(var fix in bdchangelog.fixes) {
            fix = bdchangelog.fixes[fix];

            changeLog += '' +
                '<li>' +
                '   <strong>'+fix.title+'</strong>' +
                '   <div>'+fix.text+'</div>' +
                '</li>';
        }

        changeLog += '</ul>';
    }

    if(bdchangelog.upcoming != null) {
        changeLog += '' +
            '<h1 class="changelog-in-progress">' +
            '   <span>Coming Soon</span>' +
            '</h1>' +
            '<ul>';

        for(var upc in bdchangelog.upcoming) {
            upc = bdchangelog.upcoming[upc];

            changeLog += '' +
                '<li>' +
                '   <strong>'+upc.title+'</strong>' +
                '   <div>'+upc.text+'</div>' +
                '</li>';
        }

        changeLog += '</ul>';
    }

    changeLog += '' +
        '               </div><!--scoller-->' +
        '           </div><!--scroller-wrap-->' +
        '           <div class="footer">' +
        '           </div><!--footer-->' +
        '       </div><!--change-log-->' +
        '   </div><!--modal-inner-->' +
        '</div><!--modal-->';

    return changeLog;
};

/* BetterDiscordApp EmoteModule JavaScript
 * Version: 1.5
 * Author: Jiiks | http://jiiks.net
 * Date: 26/08/2015 - 15:29
 * Last Update: 14/10/2015 - 09:48
 * https://github.com/Jiiks/BetterDiscordApp
 * Note: Due to conflicts autocapitalize only supports global emotes
 */

/*
 * =Changelog=
 * -v1.5
 * --Twitchemotes.com api
 */

var emotesFfz = {};
var emotesBTTV = {};
var emotesTwitch = { "emotes": { "emote": { "image_id": 0 } } }; //for ide
var subEmotesTwitch = {};

function EmoteModule() {
}

EmoteModule.prototype.init = function() {
};

EmoteModule.prototype.getBlacklist = function() {
    $.getJSON("https://cdn.rawgit.com/Jiiks/betterDiscordApp/"+_hash+"/emotefilter.json", function(data) { bemotes = data.blacklist; });
};

EmoteModule.prototype.obsCallback = function(mutation) {
    var self = this;

    if(!settingsCookie["bda-es-7"]) return;

    for(var i = 0 ; i < mutation.addedNodes.length ; ++i) {
        var next = mutation.addedNodes.item(i);
        if(next) {
            var nodes = self.getNodes(next);
            for(var node in nodes) {
                if(nodes.hasOwnProperty(node)) {
                    self.injectEmote(nodes[node]);
                }
            }
        }
    }
};

EmoteModule.prototype.getNodes = function(node) {
    var next;
    var nodes = [];

    var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);

    while(next = treeWalker.nextNode()) {
        nodes.push(next);
    }


    return nodes;
};

var bemotes = [];
var spoilered = [];

EmoteModule.prototype.injectEmote = function(node) {

    if(typeof emotesTwitch === 'undefined') return;

    if(!node.parentElement) return;

    var parent = node.parentElement;

    if(parent.tagName != "SPAN") return;
  
    var edited = false;
    
    if($(parent.parentElement).hasClass("edited")) {
        parent = parent.parentElement.parentElement.firstChild; //:D
        edited = true;
    }
    
    //if(!$(parent.parentElement).hasClass("markup") && !$(parent.parentElement).hasClass("message-content")) return;

    function inject() {
        if(!$(parent.parentElement).hasClass("markup") && !$(parent.parentElement).hasClass("message-content")) { return; }

        var parentInnerHTML = parent.innerHTML;
        var words = parentInnerHTML.split(/\s+/g);

        if(!words) return;

        words.some(function(word) {

            if(word.slice(0, 4) == "[!s]" ) {

                parentInnerHTML = parentInnerHTML.replace("[!s]", "");
                var markup = $(parent).parent();
                var reactId = markup.attr("data-reactid");
                
                if(spoilered.indexOf(reactId) > -1) {
                    return;
                }

                markup.addClass("spoiler");
                markup.on("click", function() {
                    $(this).removeClass("spoiler");
                    spoilered.push($(this).attr("data-reactid"));
                });

                return;
            }
        
            if(word.length < 4) {
                return;
            }

            if($.inArray(word, bemotes) != -1) return;

            if (emotesTwitch.emotes.hasOwnProperty(word)) {
                var len = Math.round(word.length / 4);
                parentInnerHTML = parentInnerHTML.replace(word, '<img class="emote" alt="' + word.substr(0, len) + "\uFDD9" + word.substr(len, len) + "\uFDD9" + word.substr(len * 2, len) + "\uFDD9" + word.substr(len * 3) + '" src="' + twitchEmoteUrlStart + emotesTwitch.emotes[word].image_id + twitchEmoteUrlEnd + '" />');
                return;
            }

            if (typeof emotesFfz !== 'undefined' && settingsCookie["bda-es-1"]) {
                if (emotesFfz.hasOwnProperty(word)) {
                    var len = Math.round(word.length / 4);
                    var name = word.substr(0, len) + "\uFDD9" + word.substr(len, len) + "\uFDD9" + word.substr(len * 2, len) + "\uFDD9" + word.substr(len * 3);
                    var url = ffzEmoteUrlStart + emotesFfz[word] + ffzEmoteUrlEnd;
                    
                    parentInnerHTML = parentInnerHTML.replace(word, '<div class="emotewrapper"><img class="emote" alt="' + name + '" src="' + url + '" /><input onclick=\'quickEmoteMenu.favorite(\"'+name+'\", \"'+url+'\");\' class="fav" title="Favorite!" type="button"></div>');
                    return;
                }
            }

            if (typeof emotesBTTV !== 'undefined' && settingsCookie["bda-es-2"]) {
                if (emotesBTTV.hasOwnProperty(word)) {
                    var len = Math.round(word.length / 4);
                    var name = word.substr(0, len) + "\uFDD9" + word.substr(len, len) + "\uFDD9" + word.substr(len * 2, len) + "\uFDD9" + word.substr(len * 3);
                    var url = emotesBTTV[word];
                    parentInnerHTML = parentInnerHTML.replace(word, '<div class="emotewrapper"><img class="emote" alt="' + name + '" src="' + url + '" /><input onclick=\'quickEmoteMenu.favorite(\"'+name+'\", \"'+url+'\");\' class="fav" title="Favorite!" type="button"></div>');
                    return;
                }
            }
              
            if(typeof emotesBTTV2 !== 'undefined' && settingsCookie["bda-es-2"]) {
                if(emotesBTTV2.hasOwnProperty(word)) {
                    var len = Math.round(word.length / 4);
                    var name = word.substr(0, len) + "\uFDD9" + word.substr(len, len) + "\uFDD9" + word.substr(len * 2, len) + "\uFDD9" + word.substr(len * 3);
                    var url = bttvEmoteUrlStart + emotesBTTV2[word]  + bttvEmoteUrlEnd;
                    parentInnerHTML = parentInnerHTML.replace(word, '<div class="emotewrapper"><img class="emote" alt="' + name + '" src="' + url + '" /><input onclick=\'quickEmoteMenu.favorite(\"'+name+'\", \"'+url+'\");\' class="fav" title="Favorite!" type="button"></div>');
                    return;
                }
            }

            if (subEmotesTwitch.hasOwnProperty(word)) {
                var len = Math.round(word.length / 4);
                var name = word.substr(0, len) + "\uFDD9" + word.substr(len, len) + "\uFDD9" + word.substr(len * 2, len) + "\uFDD9" + word.substr(len * 3);
                var url = twitchEmoteUrlStart + subEmotesTwitch[word] + twitchEmoteUrlEnd;
                parentInnerHTML = parentInnerHTML.replace(word, '<div class="emotewrapper"><img class="emote" alt="' + name + '" src="' + url + '" /><input onclick=\'quickEmoteMenu.favorite(\"'+name+'\", \"'+url+'\");\' class="fav" title="Favorite!" type="button"></div>');
                return;
            }
        });

        if(parent.parentElement == null) return;

        var oldHeight = parent.parentElement.offsetHeight;
        parent.innerHTML = parentInnerHTML.replace(new RegExp("\uFDD9", "g"), "");
        var newHeight = parent.parentElement.offsetHeight;

        //Scrollfix
        var scrollPane = $(".scroller.messages").first();
        scrollPane.scrollTop(scrollPane.scrollTop() + (newHeight - oldHeight));
   } 
   
   if(edited) {
       setTimeout(inject, 250);
   } else {
       inject();
   }
   
};

EmoteModule.prototype.autoCapitalize = function() {

    var self = this;

    $('body').delegate($(".channel-textarea-inner textarea"), 'keyup change paste', function() {
        if(!settingsCookie["bda-es-4"]) return;

        var text = $(".channel-textarea-inner textarea").val();

        if(text == undefined) return;

        var lastWord = text.split(" ").pop();
        if(lastWord.length > 3) {
            var ret = self.capitalize(lastWord.toLowerCase());
            if(ret != null) {
                $(".channel-textarea-inner textarea").val(text.replace(lastWord, ret));
            }
        }
    });
};

EmoteModule.prototype.capitalize = function(value) {
    var res = emotesTwitch.emotes;
    for(var p in res){
        if(res.hasOwnProperty(p) && value == (p+ '').toLowerCase()){
            return p;
        }
    }
};

/* BetterDiscordApp PublicSevers JavaScripts
 * Version: 1.0
 * Author: Jiiks | http://jiiks.net
 * Date: 27/08/2015 - 14:16
 * https://github.com/Jiiks/BetterDiscordApp
 */

var publicServers = { "servers": { "server": { "code": 0, "icon": null, "title": "title", "language": "EN", "description": "description" } } }; //for ide

function PublicServers() {

}

PublicServers.prototype.getPanel = function() {
    return this.container;
};

PublicServers.prototype.init = function() {

    var self = this;

    this.container = $("<div/>", {
        id: "bd-ps-container",
        style: "display:none"
    });

    var header = $("<div/>", {
        id: "bd-ps-header"
    });

    $("<h2/>", {
        text: "Public Servers"
    }).appendTo(header);

    $("<span/>", {
        id: "bd-ps-close",
        style:"cursor:pointer;",
        text: "X"
    }).appendTo(header);

    header.appendTo(this.getPanel());

    var psbody = $("<div/>", {
        id: "bd-ps-body"
    });

    psbody.appendTo(this.getPanel());

    var table = $("<table/>", {
        border:"0"
    });

    var thead = $("<thead/>");

    thead.appendTo(table);

    var headers = $("<tr/>", {

    }).append($("<th/>", {
        text: "Name"
    })).append($("<th/>", {
        text: "Code"
    })).append($("<th/>", {
        text: "Language"
    })).append($("<th/>", {
        text: "Description"
    })).append($("<th/>", {
        text: "Join"
    }));

    headers.appendTo(thead);

    var tbody = $("<tbody/>", {
        id: "bd-ps-tbody"
    });

    tbody.appendTo(table);

    table.appendTo(psbody);

    $("body").append(this.getPanel());

    $("#bd-ps-close").on("click", function() { self.show(); });

    var servers = publicServers.servers;

    for(var server in servers) {
        if(servers.hasOwnProperty(server)) {
            var s = servers[server];
            var code = s.code;
            var title = s.title;
            var language = s.language;
            var description = s.description;

            this.addServer(server, code, title, language, description);
        }
    }
};

PublicServers.prototype.addServer = function(name, code, title, language, description) {
    var self = this;
    var tableBody = $("#bd-ps-tbody");


    var desc = $("<td/>").append($("<div/>", {
        class: "bd-ps-description",
        text: description
    }));

    var tr = $("<tr/>");

    tr.append($("<td/>", {
        text: title
    }));

    tr.append($("<td/>", {
        css: {
            "-webkit-user-select":"initial",
            "user-select":"initial"
        },
        text: code
    }));

    tr.append($("<td/>", {
        text: language
    }));

    tr.append(desc);

    tr.append($("<td/>").append($("<button/>", {
        text: "Join",
        css: {
            "height": "30px",
            "display": "block",
            "margin-top": "10px",
            "background-color": "#36393E",
            "border": "1px solid #404040",
            "outline": "1px solid #000",
            "color": "#EDEDED"
        },
        click: function() { self.joinServer(code); }
    })));

    tableBody.append(tr);
};

PublicServers.prototype.show = function() {
    this.getPanel().toggle();
    var li = $("#bd-pub-li");
    li.removeClass();
    if(this.getPanel().is(":visible")) {
        li.addClass("active");
    }
};

//Workaround for joining a server
PublicServers.prototype.joinServer = function(code) {
    $(".guilds-add").click();
    $(".action.join .btn").click();
    $(".create-guild-container input").val(code);
    $(".form.join-server .btn-primary").click();
};

/* BetterDiscordApp QuickEmoteMenu JavaScript
 * Version: 1.3
 * Author: Jiiks | http://jiiks.net
 * Date: 26/08/2015 - 11:49
 * Last Update: 29/08/2015 - 11:46
 * https://github.com/Jiiks/BetterDiscordApp
 */

var emoteBtn, emoteMenu;

function QuickEmoteMenu() {

}

QuickEmoteMenu.prototype.init = function(reload) {

    emoteBtn = null;
    $(".channel-textarea").first().removeClass("emotemenu-enabled");
    if(!emoteMenu) {
        this.initEmoteList();
    }

    var menuOpen;


    emoteBtn = $("<div/>", { id:"twitchcord-button-container", style:"display:none" }).append($("<button/>", { id: "twitchcord-button", onclick: "return false;" }));

    $(".content.flex-spacer.flex-horizontal .flex-spacer.flex-vertical form").append(emoteBtn);

    emoteMenu.detach();
    emoteBtn.append(emoteMenu);

    $("#twitchcord-button").on("click", function() {
        menuOpen = !menuOpen;
        if(menuOpen) {
            emoteMenu.addClass("emotemenu-open");
            $(this).addClass("twitchcord-button-open");
        } else {
            emoteMenu.removeClass();
            $(this).removeClass();
        }
    });

    if(settingsCookie["bda-es-0"]) {
        $(".channel-textarea").first().addClass("emotemenu-enabled");
        emoteBtn.show();
    }

    var emoteIcon = $(".emote-icon");

    emoteIcon.off();
    emoteIcon.on("click", function() {
        var emote = $(this).attr("title");
        var ta = $(".channel-textarea-inner textarea");
        ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
    });
    
    var fe = localStorage["bdfavemotes"];
    if(fe != undefined) {
        favoriteEmotes = JSON.parse(atob(fe));
        this.updateFavorites();
    }
};

QuickEmoteMenu.prototype.obsCallback = function() {
	
	$("#snowcover").remove();
	$("#decor").remove();
	
	var customCss = $("#customcss").html();
	
	if(window.location.pathname == "/channels/86004744966914048/86004744966914048" || customCss.indexOf("snow") > -1) {
		if($("#customcss").html().indexOf("nosnow") == -1) {
			$(".scroller.messages").snowfall('clear');
			$(".scroller.messages").snowfall({flakeCount : 100, maxSpeed : 10});
		}
		
		if(customCss.indexOf("nodecor") > -1) {
			$("#decor").remove();
		} else {
			$("head").append('<style id="decor"> .flex-spacer.flex-vertical { background-repeat: repeat no-repeat; background-image:url(\'data:image/png;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/+/wAFCAYAAgUJAPz+AwACBQ0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AwwBAP4E/gD9CwIAHir0y0RLDWUZISfq8vD3AAEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AQAB//4A/wH/AAAAAAD+AAEAAP/+AAD9AAD+A/4AAAAAAAD9AgABAP8AAf//AAIBAAD+/v8AAAAAAAECAQAAAQEA/f/9AAMAAAD+AP8A/QL7AAEDAAD+Bf0A/Qr8AAAI/QAECgIA/wsAAP0C/QD9CfsAIi8KsxUaBlL39foA+Pb6AAkQ/gD//v8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEA//38APz06gAPJDSgAREV6uG/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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADUJCvbAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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BQAMDgn/EBAIxxITB6oREQenDQ4I6unp8wD19PoACgwCAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAD//3DrY1pMQRL2AAAAAElFTkSuQmCC\');  } </style>');
		}
		
		if(customCss.indexOf("nobottomsnow") > -1) {
			$("#snowcover").remove();
		} else {
			$("head").append('<style id="snowcover">.flex-spacer.flex-vertical form { background-repeat: repeat no-repeat; background-position: bottom; background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJkAAAAbCAYAAABvJC1pAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAEC3SURBVHgBAKdAWL8BpbK/APj5+gC8ydEA/wIBAAMCAgAAAAAA////AAYFBAAXEhEA4uXqADgwKAADAgQAGRYSAO7z8gDg5uoA9vj5AAMCAgD///8ADQ4MAAMEBAD+/v4AAAAAAO7y9ABBMSoCKCAcCiAZFf6rv8n2jKe6ACAYEwD4/f4A8Pf5AO3y9gBFMycvSjYsW8XW35sVEAvbFhENRQEAAkDN2uN9Eg0L/v3+/gD9/v4A/f7+AFI8LwACBAQAtc7YALbR2wBTNSsAFA8LAOr0+QAdFhEA+vv8AAAAAAAIBQQA5e/zANvp7QAlFhIA8Pf7AAYEAwDr9PYA4+/1AP7+AQADAgEA9/v8ABIKCABpQy0A3u71ALfW5gAWDQcAEQoFAOf0+AAOCQcADwkHAPf7/QDz+/wA+v3+AAIBAQAAAAAA/v//ABcKCAALBgMA5/L2APf6+wAaDAkA9Pn8ANzr8wA0HRMATy4dAKPF1wDI3OgAEgwIAP7/AAD+//4AFQwHACQVDwDt9fgAEwkGAPL4+AATDQoAGxEOAPn8/QAAAAAAAwICAPf5+gD//fwAAgABAKbF0QAsHBUAWTouAAwGBACxxtIA9/n8AAUEAwAHBQQA3+jtABsVD1stIRkM8/X3mtHd5QY6KiOE3+jrzZayw6gTDgsAEQsIAAwFBADS3uQAVkE0AIZnUwzd5OoH4ejs77XGzwAODAn+AQAAAAABAQABAAAA9PL0APz8/QACAgEA////AAoICAAtIx8A9fb5AP7//QC1wcsAKiMdAPr9/ADd4+cACAcGAAAAAAD6/PwAEQsLABsVEQAjHRkABAAAAAACAgIAAAABAOzv8gABAAAA/v//AAkHBgAHBgYEDAj4Be7x8/f19vcAGhYVEAgGBUcA/wDh/f7/0fz+/vf3+foA+/v7AAUGBgAkHRUAAgAAAPf6+wD29vsA7vL2XBoVD4y6ytJlx9PdsRIPCwjs8vX4CAcGADgpIgDj6u4AKB0YPS8kHGj0+Pr6BAMC3CwhGnchGBMoHxcTvA4JB7/3+vwAAgEAABgRDgAFBQMA2OXrAAAAAAAAAAAAAAAAAP4AAAD7/P0AFAoHAAEABwAAAQEAAgEBAPz8/C3u9An+/P3+1/X4+v76BQMA8vf7Av7//wEDAgL9AgEAAAIAAAACAgAAAQEBAAAAAAABAAEA/f7/APr9/wAA/wEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAEA+/7+APz+/gABAAEAAAAAAP//AAABAAAAAgIAAAIBAAAAAAAA/wD/A/H3+gDv9vn99fj6ABMKBgYRCwgfFg0JFBUMCccAAQAA/v7/AAUDAgDb6PkA+vz9AAkEBAAAAAAAAAAAAPX4+gAdEw4AY0g6AOXt8QD5+/wADwsIAOnw8yo1Jh6k9/n6+8DQ2wM1Jh8DMCUbYwAA/wstIBmoIRkVANng5QDo7vEABwYFAt3l6v6qvcknRzgtu+Dn66cFAgVrEgsMAAkHBQADAwMA5entAO/x8wAAAQEACQkHAAIBAQD6+/wbAQEBPBMQDc3n6+zc6OzvACIcFw74/Pz98fP29fL09gABAQEA9/n6AAsGBwAEAwMAAAAAAAQAAAAA7PDyADEoIQBWST4A+/z8AAwLCADDzNYA6+7xLhwYFHURDw2vHBkV2gIDAwsRDwqJNCwiEYmfsDjL093XJR4aAAMCAQD5+fsA1+HmAOnt8QAUEA0AHhcSCzUrInENCgkVDAoHQEs7L0RH/i0Oqb3JXzAmIABGNy4AAv/+J6O8ycXX4ee6Tzoucd7n7NYoHRco4uvv/ff5+z7O3OS/GxQOAPP3+gDD2eIAUDYqAAgFBAAAAAAAAAAAAAAAAAD+//8A/P38AAYCAQDo8fUA/f7+APn8/ABEKiGKPSYcPsXc5nkAAgK7HxMOJioZEmzC2+awttThlRMLCADz+fsAHRMNABYNCQDT5/AA/f7+AAUDAgP/AP8I8vn69QoHBQD+AP8A/P7+APz9/gD8/v4AAgEBAAAAAAD+//8A/P7+AP3/AgD9/v8A9vv8AP7/BQ8FAwL5/P7++Pr9/gAKBgMAEgwIAAABAQAKBwUA7/b5AC0bEztPLiF77fX5wMrf5qcJBgUmTjEjnRIJBwOz0Nwf/v//+wQCAgAgFA8AAv/+APX6+wALBQUAAAAAAAAAAAABAQAACAUEALfP2wDv8/UAIBUQAMra4gAUDgsn6/H09CIYEww0Jx5wDwsKEOfu8N3E1N2lfVxINg0MDMq6zNUAxdDXAEIzKnMsIBtE7vLzyg4LCREqIhtg5Onum9Td49Ds8fQADQsJAAcDAQD6+/8ABgUDANPZ4QAfGhYJdF5PrAD//jLU3ONbERANBUtANTEiGxdPAQEAuSohHJ5KPjMA+fv8AAcFBQDDzNQAztbcAB0ZFQAEAAAAAPj5+gAYFREAHxoVAP7+/gACAgIAHxkVIAEAAUE6MChFJiEbLM/Y36kHBQQCGBUQ/wgHBesSDw0lDQsM10E1LAD4+vwA4OfqAJevvwDz5+0AJy8mAFA/MBPq7vLT6xLzFxEODCI6HxlNr8LPc/D0+ADl7fEA5OruFDYoHqg9LSTW/f7/69bi58r8/f736O/y6gQCAv8ZEw1r1OPnuSQbFMj0+PsAkrXIAEQuJAAFBAMAAAAAAAAAAAAAAAAAAAAAAAwIBgDs9PcAw9vkAO719wAlFxIhAQIBOQoGBPYrGxRfAwMCAjEdFkIgEw1E4e/z3hsSDAAHBAMABwYDADUhGAD9//8ABwMCAPb8/AAYDgklSikbkMPf6q7k8vef9Pn8/v//AAsIBAT1/fz8/QMBAQD/AAAABQAAAAIBAg/8/v8AAAAA8SARDDdSLB2K1ujxl8/k7qgLBgMA9fn8ADYiGADi7/MA/f7/AAMEAQAnGBE3LBsTQfv+/zD1+vr9BwQDHwQCAvwFBAMc6vP2Nsbc5cUeEw4AAAABAP8AAAACAQEAAAAAAAAAAAAAAAAAAgEBAAEBAQDH2eIAOykeADwtIQDf6u4WGxQPeQYEAvbw9PYA+Pv77+fk59gEAgIDPS0kXBIODDfp8PRs7vL2xujv8wD09vnSOi0kitrk6A/j6e7X9/j689vm6QDA0NsAzNTdAAD+/gBaRzcAOS8nABUPDQDu8/YACwkKLB0YEhP2+Pry/v/+J/r5/SJhUURxAwEBDMfR2OIkHhkzHRcUzf7//wAEBAMA3BUSAPn6+wAAAAAAA1NZYAD6+/wA+fr7ANDZ4ACgr7wAsLzHABkVEUNIPjOc0Nnguv79/uwvJiBV2+Ho0DowKEXF0Nm4x9Lar11MPTr5+/zuy9Xc9hANCwAeGRQA7vr7AEs7L0x4Xky9AAAAA9Hb47b6/P0FAAD/+f/+ALfe5+3Xvc3YACofF04FBQUnLSEaNeTs8dTh6e3MJRwWQcva4rI3KCBDCAYFCyEYEyj6+/2fvtPeAOrx9QBRNyoA6PD0AMnc5ADP4egALx8ZAA4KCAD5+/wADgkIAPz+/wAHAwMICgcGB9rp78M9JRxeCwcFDQUDAxUnGBBE4u7039Dk7I7u9vrc6vX4ABYOCgBJLB8A9fn7AOj0+ADx+PwAGxAKRT0hF3cKBgUL9vv9CTUbE3Y5HhRnAAAArxkMCfcdDwoAHA4KABIKBwBIJRmyJxQNbuLx9twxGxNVNRwUVdbq8Nzr9fq9KBYOAAcDAQAvHBUA3u3zANXn7gAJBgQADwkH+wkEAyshFA4qAAABCSIVDjEbEA0hpMbWZPf7/ssLBgYGEwwJ9xQMCQD0+PoA/P7+AAUCAgDA1t4ABwQDACcZFAAsHhYAydvkANbj6gAkGBMAMCIalCEWEksWEA0LztzkuQsIBxTf5+3K2ePqxFI9MHPV4efZ6u/yBaS6yMERDAwDPC4lDAQEAR309vkH4uju0ggHBRA/MChw9ff48t/n6s1KPTEAJh4XANrh5gAQDQoJTkA0VtHa4Ojr7/LrQDQrUtrh59EnIBtFAAD/7dzj6MZANSxp6+7w7Yuerr24xM0AxtDYAPf4+gAAAAAAEg8NAANTWWAA9ff4AP79/wAXFBIA2N7lAAsMCgAJCQbX9PX4DfH09/jn7O/MDAsIDeTq7t3W3uTC2eDm0F5MPoI8MSh3/P39J56zwqgNCgcAVUU6AEg5LgA4KyLl1+HnuwQEAxb///4JBQUDB/z8/vAsIht0FhANN8XV3qkRDQvUHhYTJ9zm7O33+vro//8AAunv8+YJBwYExNberP7+/wLk7PCsssrWy8DW3wD9/gAALB0YDS8hGagNCgc36/L23RwTD/r1+vz6+vz9AAcGBQDr8/YAOiUciBYOC2X1+vzW6fP24f3+/wAWDgkdDggIEuXw9N/b6/K4DAgHEO72+ugKBgUAAwQEAP3+/wIUCgdmLBkRdeTy9+EqFg81/f4A+xcMCCU4HRNJ5fP45uLz+JsCAgH9AAEBAP8BAQD5/f4ACQQDRSwWDkYkEg03EAkHGAwGAxHD4OulQSMYbCMTDEDu9vrF5vL2+t3r8gD4/P0AIRMPKPz9/gUdEgw7HRENJfL4+Onr8/jk1ebtxOv09s8eEw50LBsUXfD2+LX3+/z3+/39AOry9QAPCgcJ9/r7FUwyJ2RDLiON6O/00LjQ2+fB1d4B6O3xABALCP4CAgEduc7YpPb4++nq7/LnAQEAARoSDh7h6e/h+fv86Nvk6oTK2uH5cVREm0o4LJja4+nI7fL05AsJBgz9/f7v2uLnhSQcFqpNPTL/NiskAPHz9ACou8kAT0A0gEk7MJAlHhk22+Hny9/m6sjm6u/bDAsHCuzw8+L19vnz4ubr1dDZ4HAGBgUA7fD0ABgVEgAFAwMA9/j4ABIPDQABlqW1AOTp7AD9/v4ALCYgAOLm6h3g5uz87/T150s9MlEfGhZFEQ8NGsfR2aRKPDKE1N3juB8aFTEsIx0+6u/x593j6dCnushYDAkG9TowKQ3f5+zw//79ABwXE1ZGNSuX1N/l0QkHBgQaFBAmvs7YfrXK1Zrw8/UQkm1XxyAYFCjg6O3YGRIOI/X5++v4+vv4GhMPIpW0xGbF1+Cb+Pr8AAEEAguAWEWh6PD18sHV4I1sSjiyGBAMIgAAAADl7/Lr5e7zztbl7Jr3+/3sLR0VhjwmHTv5+/z2BwUDCrHQ3ZMVDQoXOiMaVuTv8ugVDQkX3+303vv9/gLo8/iE0ufvnigYEAAaDQmNKRYOcgUDAwD9/v8A1Onxs+r1+OYjEww27ff75rHZ6HkJBQPXBgMB/P8AAAABAQAA/P3/APH4+xhDIhWHLRUNP+fz+Nz//wD3JhQNPAsGBBIAAP8A2eryuOf0+EnX5+8AGg4JQysYEJX9/v8BIxQNJOrz9ucYDgwb4u/zysjd5rRTMiWCAAAA+AcEAwjj7vLvwtnkc/n7+90gFA9iKRoUSBsSDhcAAAAA9/r7AIqwxEIYEAwpQSwgVoCou13w8/fjFAwKAB0UDkd/Wkev+Pv8+fj6+/EWEA0f3ubs2BoUDxz/////ZIyjNfD0+NlXQDJiRzUqfN3l69ft8vToTTovYrHEz3Lm6/CPBAUEACAYFQ/O1tv909zk9GBNPpklHRdBFxMPG/L0+O+7yNKSRTgsaa68yXssJR5DBgQEDt/l6b63xM6kAgEC/iYeGBQBAgHh+fn7AOXo6wAtJiAAAc3U25Ho7O/rExAOKCYhGzcA//8a2uHnxgQDA+4sJR5C+vv8+g0LCRrY3uXPCAcFCSAbFiju8vT19fb49MzX36kOCwgLNisjSwQDAxjn7fHLrL7LblJAM5okHRgtAAAAAP39/v4DAwICAAAAAMDP2Xisws6JIBgTQnRXRr39/v4A/v7//gUEAwL///8AAQEAAAAAAQD/AAAA8PP24tPi6L4LCAYdMyMcQwAAAADg6u7g1+XrjywdGG8dFA8iAAAAANzo7t7g7fHeNSEYOgoGBgb7/f4D/v//9v3//v//AADx9/r89vL3+/D0+vrzLRoTPuPw9tYJBQMVwd3opdXp8HVuPCkA9Pr8e/b7/HkSCgjrAQEBAc3m7rMvGBFI6PT42xEIBRbo9frg5vX4pOj097AHAgIA+P3+AA4HBTQfDwptJBEKNt3u9c4jEgs04O/1zxULCCEWCgcg5fP1+fr7/bwlFA5ips7eAPD3+ltfNSSS9vr84R0RCyzV5+3G/P3/8x4SDS0GAwMFAwIACgIBAQMEAgMMAAD//AUEAgXL3ufMAgAB/jckGzYAAAAA8PX4AMzd44AaEQ5DKh0XPQAAAADa5uvQ2eXrwTYkHEkXEQ4mAAAAAAAAAAD+/v4AAgICAP7////7/P0ABwUEAaO6x3TC0tyNWEI1WUIwJqYBAgIA/P39/gMDAwIBAAAA8vX2+5yxwjs7LyRoLyQeYvv8/evZ4ufJ3ePp0TMpIVMRDgogCwkJ/fv7/Prj6O3iKiMcL/T29+oFBAMD5erv0uPo7PEoIBpCAAAA6O7x9N7X3uPHGhUSCQH////yAAAADQAAAAAAAAAAytLZrPX3+e9BNy5lAAAAAP///wD+/v8AAQEAAP39/v79/v79CAcGBfv7+wD4+vz1CAcGBQUEAwYAAAAA9/j5+ff5+v0SDw0KAAAAAP///wABAQEA////AAEBAQD8/f389/n77v///wUOCwkR+/z9/gIBAQEDAwIBAAAAAAAAAAD///8AAQEBAAAAAAAAAAAAAAAAAAD//wAAAAAAAAEBAP7+/gD6/P3/BAMCAAQDAwHl7vLbBgUDChUNCxsAAAAA/v//APX5+/UCAQEECwcFB9Xm7Mf8/v/0LxwVRcng6bLJ4eqm/wEBEM/j7plFKBsALRkRAO/3+m4JBgNoAgIC8SMRCy3b7vW/3vD1zS0WD0QSCgch9vv8BwEBAfix2+os8/n88AAAAABRJxe7FAkGRP///+bw+Pvhz+fvtBIJBhw9HhNk4vH22+72+e7y+PvBGQ0KfOv09gCt0OEAIRQMVwsFAvwuGhNQPyQaXNDj67n2+vv0OiMZU/j7/fz7/f74CQUECwQDAgEAAAAA8/j57uvy9uIiFhEw////APr8/P8DAgIBBAMDAAAAAAAA//8AAAEAAAAAAQAAAAAAAAAAAP///wAAAAAAAQEBAAAAAAD+//8A/f3+/gUEAwL1+Pn1////9wsIBxABAQEEAP//AAABAQAAAAAAAAAAAAAAAADv8vT3AAAB/xEOCwoAAAAA/v7+/Pb4+voFBAIJBwYGAfv7/Pz/AP8BBQQEA/7+/v8CAgIBAQEBAAAAAADO1t207/Hz4D81LWwEBAMAAAAAAAAAAPMB////8gAAAA3/AAAAAQAAAPr6+/b6/Pz1DAoJFQAA/wD+/v8AAAAAAAICAgAAAAAA////AAEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AP/+/wABAgIAAQEAAAAAAAAAAAAA////AAEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////AAEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AAPz9/f7z+vr2CQYFCggEBALo8vbmyOHpqLzb56kpFRDKYjgma+by9zDq9fcDCwYEPCQSDR4KBgUHv9/qqA8HBBAiEg03ttzokBEJBRrz+f2g5fb7yPL6/QAHAwIAJg8ILQ4IA2Xf7/bfQR8UXQQCAAXT6fLCSiUYav///wDb7vPf6/P4yhcOCe8fEAvtttbjfLTW5BY7IBVXOyEXYigXETD9/v8A8vj59gwGBQcFAwIDAAEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAQEAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAEBAQAAAAAAAAAAAP7+/gABAQEAAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAEBAQD+/v8AAAD/AAEBAQABAQEA9vf58AMDAQQHBgYM/wD/AAEAAQAAAADzAf////IAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAAAAAAEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD///8A/v//AAQCAgD/AAD//v////v9/gH////9CQYEBOv0+e2w1OBoLRkRFS0ZEoQLBgQS+v39/wYDBAEAAAAAxOHrp8zm8KE+IBR5KhUOP8jl7qX8/v9czerzAM7q9AAoEgsA3/H3ABsMBgBBGxEA+f7+czwdEoz0+vzlttrogh0OCCJFIxd0BQMDA/3+/gACAQAA/P7/ANjr8IvG3uq6RicclSETDSb0+fr7AAAAAgkFBAICAQEAAQEBAfz9/QABAAAAAgICAAEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAAAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wAAAAAAAQEBAAAAAAAAAAAAAAAAAP///wABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8wQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAQEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAQEBAAD+/gD/AQEAAQAAAQMBAQECAQEA9/v8APr8/v4SCgYRYTUmqQQDAgIAAAAAAAAAAAQCAwHz+foADQcGAO73/N/t9/q54PH3HgUDAvwFAwK2HQ4HVub2+/EX9PrGEQkF8/T7/AEUCgYuJBMLLOn1+djt9vq73O/0y+Hx9poA/wBQBQMDA/b6+wAEAwIAAwIDAAUDAAAtGBN1KhYSdAEA/wD9/v7/AQAAAQcEAwIDAgIBAAAAAAAAAAACAQEAAQEBAAEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB////8gAAAA0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///8AAQAAAP8BAQAA/wAAAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAA5vL18f8AAQMbDgoMvN/qZqTT5JsPCAYAcDYiUw0HA6rq9frn5vX6fM3q86AyFg0/FwkFiAwGAzgSBwaNmtDhdNXr8gBMJBc8VSoaw+/3+gDy+fvwHxAMEAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAABAP8A//8AAAEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADzBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAAAAAAABAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABcNCg36/P3+AAAAAAsFBD1OJhf1IxIMXhQJBUX+///2DggF+xEJBoMFAgBLJxIMNAAAAAz+/v7pDAYCc1AnGEEoEwuYEQgGKwAAAQAKBQT/DQcFDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAABAAEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////yAAAADQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wD7/v/9BAMCAwEAAAAAAAAAvOHsohQJBRIwFg9MAAAAAAAAAADm9Pjay+jxuEkgFG0GBAMBAAAAAP3+/v4BAQEBAgEBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPMEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEABQMBAwAAAAD9/v4AAwICABgLByQWCgYZAAAAAAAAAAAAAAAAEAcFFhsNCCkBAQH/AP//AQAAAAADAgICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf////IAAAANAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP///wD+AAAAAwEBAAAAAAAAAAAAAAAAAAAAAAD+//8AAAAAAAIBAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8wQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAADzAAAADQAAAPMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQAAAPMBAAD//4KmwUDpxM+4AAAAAElFTkSuQmCC\'); }</style>');
		}
	}
    if(!emoteBtn) return;
    if(!$(".content.flex-spacer.flex-horizontal .flex-spacer.flex-vertical form")) return;

    var tcbtn = $("#twitchcord-button-container");

    if(tcbtn.parent().prop("tagName") == undefined) {
        quickEmoteMenu = new QuickEmoteMenu();
        quickEmoteMenu.init(true);
    }
};

var favoriteEmotes = {};

QuickEmoteMenu.prototype.initEmoteList = function() {

    emoteMenu = $("<div/>", { id: "emote-menu" });

    var emoteMenuHeader = $("<div/>", { id: "emote-menu-header" });
    var emoteMenuBody = $("<div/>", { id: "emote-menu-inner" });
    var emoteMenuBodyFav = $("<div/>", { id: "emote-menu-inner-fav", css: { "display": "none" }})
    
    var globalTab = $("<div/>", {class: "emote-menu-tab emote-menu-tab-selected", id: "emgb", text: "Global", click: function() { $("#emfa").removeClass("emote-menu-tab-selected"); $("#emgb").addClass("emote-menu-tab-selected"); $("#emote-menu-inner-fav").hide(); $("#emote-menu-inner").show(); }});
    var favoriteTab = $("<div/>", {class: "emote-menu-tab", id: "emfa", text: "Favorite", click: function() { $("#emgb").removeClass("emote-menu-tab-selected"); $("#emfa").addClass("emote-menu-tab-selected"); $("#emote-menu-inner").hide(); $("#emote-menu-inner-fav").show(); }});
    
    emoteMenuHeader.append(globalTab);
    emoteMenuHeader.append(favoriteTab);
    
    emoteMenu.append(emoteMenuHeader);
    
    var swrapper = $("<div/>", { class: "scroller-wrap" });
    var scroller = $("<div/>", { class: "scroller"});
    
    
    swrapper.append(scroller);
    scroller.append(emoteMenuBody);
    scroller.append(emoteMenuBodyFav);
    
    emoteMenu.append(swrapper);

    for(var emote in emotesTwitch.emotes) {
        if(emotesTwitch.emotes.hasOwnProperty(emote)) {
            var id = emotesTwitch.emotes[emote].image_id;
            emoteMenuBody.append($("<div/>" , { class: "emote-container" }).append($("<img/>", { class: "emote-icon", id: emote, alt: "", src: "https://static-cdn.jtvnw.net/emoticons/v1/"+id+"/1.0", title: emote })));
        }
    }
    
   
};

QuickEmoteMenu.prototype.favorite = function(name, url) {
    
    if(!$("#rmenu").length) {
        $("body").append('<div id="rmenu"><ul><a href="#">Remove</a></ul></div>');
        $(document).on("click", function() {
            $("#rmenu").hide();
        });
    }
    
    if(!favoriteEmotes.hasOwnProperty(name)) {
        favoriteEmotes[name] = url;
    }
  
    this.updateFavorites();
};

QuickEmoteMenu.prototype.updateFavorites = function() {

    var self = this;
    var emoteMenuBody = $("#emote-menu-inner-fav");
    emoteMenuBody.empty();
    for(var emote in favoriteEmotes) {
        var url = favoriteEmotes[emote];
        
        var econtainer = $("<div/>", { class: "emote-container" });
        var icon = $("<img/>", { class: "emote-icon", alt: "", src: url, title: emote }).appendTo(econtainer);
        emoteMenuBody.append(econtainer);
        
        icon.off("click").on("click", function(e) {
            var emote = $(this).attr("title");
            var ta = $(".channel-textarea-inner textarea");
            ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
        });
        icon.off("contextmenu").on("contextmenu", function(e) {
            var title = $(this).attr("title");
            var menu = $("#rmenu");
            menu.find("a").off("click").on("click",function() {
                delete favoriteEmotes[title];
                self.updateFavorites();
            });
            menu.hide();
            menu.css({top: e.pageY, left: e.pageX});
            menu.show();
            return false;
        });
    }
    
    window.localStorage["bdfavemotes"] = btoa(JSON.stringify(favoriteEmotes));
};

/* BetterDiscordApp Settings Panel JavaScript
 * Version: 2.0
 * Author: Jiiks | http://jiiks.net
 * Date: 26/08/2015 - 11:54
 * Last Update: 27/11/2015 - 00:50
 * https://github.com/Jiiks/BetterDiscordApp
 */

var settingsButton = null;
var panel = null;

function SettingsPanel() {
    utils.injectJs("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/codemirror.min.js");
    utils.injectJs("https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.9.0/mode/css/css.min.js");
}

SettingsPanel.prototype.init = function() {
    var self = this;
    self.construct();
    var body = $("body");

    if(settingsCookie["bda-es-0"]) {
        $("#twitchcord-button-container").show();
    } else {
        $("#twitchcord-button-container").hide();
    }

    if(settingsCookie["bda-gs-2"]) {
        body.addClass("bd-minimal");
    } else {
        body.removeClass("bd-minimal");
    }
    if(settingsCookie["bda-gs-3"]) {
        body.addClass("bd-minimal-chan");
    } else {
        body.removeClass("bd-minimal-chan");
    }

    if(settingsCookie["bda-gs-4"]) {
        voiceMode.enable();
    }

    if(settingsCookie["bda-jd"]) {
        opublicServers.joinServer("0Tmfo5ZbORCRqbAd");
        settingsCookie["bda-jd"] = false;
        mainCore.saveSettings();
    }
    
    if (settingsCookie["bda-es-6"]) {
        //Pretty emote titles
      	emoteNamePopup = $("<div class='tipsy tipsy-se' style='display: block; top: 82px; left: 1630.5px; visibility: visible; opacity: 0.8;'><div class='tipsy-inner'></div></div>");
      	$(document).on("mouseover", ".emote", function() { var x = $(this).offset(); var title = $(this).attr("alt"); $(emoteNamePopup).find(".tipsy-inner").text(title); $(emoteNamePopup).css('left', x.left - 25); $(emoteNamePopup).css('top', x.top - 32); $("div[data-reactid='.0.1.1']").append($(emoteNamePopup));});
      	$(document).on("mouseleave", ".emote", function(){$(".tipsy").remove()});
    } else {
      	$(document).off('mouseover', '.emote');
    }
};

SettingsPanel.prototype.applyCustomCss = function(css) {
    if($("#customcss").length == 0) {
        $("head").append('<style id="customcss"></style>');
    }

    $("#customcss").html(css);

    localStorage.setItem("bdcustomcss", btoa(css));
};

var customCssInitialized = false;
var lastTab = "";

SettingsPanel.prototype.changeTab = function(tab) {
    
    var self = this;
    
    lastTab = tab;
    
    var controlGroups = $("#bd-control-groups");
    $(".bd-tab").removeClass("selected");
    $(".bd-pane").hide();
    $("#" + tab).addClass("selected");   
    $("#" + tab.replace("tab", "pane")).show();
     
    switch(tab) {
        case "bd-settings-tab":
        break;
        case "bd-customcss-tab":
            if(!customCssInitialized) {
                var editor = CodeMirror.fromTextArea(document.getElementById("bd-custom-css-ta"), {
                    lineNumbers: true, mode: 'css', indentUnit: 4, theme: 'neat'
                });
                
                
                editor.on("change", function(cm) {
                    var css = cm.getValue();
                    self.applyCustomCss(css);
                });

                customCssInitialized = true;
            }
        break;
        case "bd-plugins-tab":
            
        break;
        case "bd-themes-tab":
            controlGroups.html("<span>Coming soon</span>");
        break;
    }
};


SettingsPanel.prototype.updateSetting = function(checkbox) {    
        var cb = $(checkbox).children().find('input[type="checkbox"]');
        var enabled = !cb.is(":checked");
        var id = cb.attr("id");
        cb.prop("checked", enabled);

        settingsCookie[id] = enabled;

        if(settingsCookie["bda-es-0"]) {
            $("#twitchcord-button-container").show();
        } else {
            $("#twitchcord-button-container").hide();
        }

        if(settingsCookie["bda-gs-2"]) {
            $("body").addClass("bd-minimal");
        } else {
            $("body").removeClass("bd-minimal");
        }
        if(settingsCookie["bda-gs-3"]) {
            $("body").addClass("bd-minimal-chan");
        } else {
            $("body").removeClass("bd-minimal-chan");
        }
        if(settingsCookie["bda-gs-1"]) {
            $("#bd-pub-li").show();
        } else {
            $("#bd-pub-li").hide();
        }
        if(settingsCookie["bda-gs-4"]){
            voiceMode.enable();
        } else {
            voiceMode.disable();
        }
        if (settingsCookie["bda-es-6"]) {
      	    //Pretty emote titles
      	    emoteNamePopup = $("<div class='tipsy tipsy-se' style='display: block; top: 82px; left: 1630.5px; visibility: visible; opacity: 0.8;'><div class='tipsy-inner'></div></div>");
      	    $(document).on("mouseover", ".emote", function() { var x = $(this).offset(); var title = $(this).attr("alt"); $(emoteNamePopup).find(".tipsy-inner").text(title); $(emoteNamePopup).css('left', x.left - 25); $(emoteNamePopup).css('top', x.top - 32); $("div[data-reactid='.0.1.1']").append($(emoteNamePopup));});
      	    $(document).on("mouseleave", ".emote", function(){$(".tipsy").remove()});
    	} else {
      	    $(document).off('mouseover', '.emote');
    	}

        mainCore.saveSettings();
}

SettingsPanel.prototype.construct = function() {
    var self = this;
    
    panel = $("<div/>", {
        id: "bd-pane",
        class: "settings-inner",
        css: {
            "display": "none"
        }
    });
    
    var settingsInner = '' +
    '<div class="scroller-wrap">' +
    '   <div class="scroller settings-wrapper settings-panel">' +
    '       <div class="tab-bar TOP">' +
    '           <div class="tab-bar-item bd-tab" id="bd-settings-tab" onclick="settingsPanel.changeTab(\'bd-settings-tab\');">Settings</div>' +
    '           <div class="tab-bar-item bd-tab" id="bd-customcss-tab" onclick="settingsPanel.changeTab(\'bd-customcss-tab\');">Custom CSS</div>' +
    '           <div class="tab-bar-item bd-tab" id="bd-plugins-tab" onclick="settingsPanel.changeTab(\'bd-plugins-tab\');">Plugins</div>' +
    '           <div class="tab-bar-item bd-tab" id="bd-themes-tab" onclick="settingsPanel.changeTab(\'bd-themes-tab\');">Themes</div>' +
    '       </div>' +
    '       <div class="bd-settings">' +
    '' +
    '               <div class="bd-pane control-group" id="bd-settings-pane" style="display:none;">' + 
    '                   <ul class="checkbox-group">';
    
    
    
    for(var setting in settings) {

        var sett = settings[setting];
        var id = sett["id"];

        if(sett["implemented"]) {

            settingsInner += '' +
            '<li>' +
                '<div class="checkbox" onclick="settingsPanel.updateSetting(this);" >' +
                    '<div class="checkbox-inner">' +
                        '<input type="checkbox" id="'+id+ '" ' + (settingsCookie[id] ? "checked" : "") + '>' +
                        '<span></span>' +
                    '</div>' +
                    '<span>' + setting + " - " + sett["info"] +
                    '</span>' +
                '</div>' +
            '</li>';
        }
    }
    
    var ccss = atob(localStorage.getItem("bdcustomcss"));
    self.applyCustomCss(ccss);
    
    settingsInner += '</ul>' +
    '               </div>' +
    '' +
    '               <div class="bd-pane control-group" id="bd-customcss-pane" style="display:none;">' +
    '                   <textarea id="bd-custom-css-ta">'+ccss+'</textarea>' +
    '               </div>' +
    '' +
    '               <div class="bd-pane control-group" id="bd-plugins-pane" style="display:none;">' +
    '                   <table class="bd-g-table">' +
    '                       <thead><tr><th>Name</th><th>Description</th><th>Author</th><th>Version</th><th></th></tr></thead><tbody>';
    
    $.each(bdplugins, function() {
        var plugin = this["plugin"];
        settingsInner += '' +
        '<tr>' +
        '   <td>'+plugin.getName()+'</td>' +
        '   <td width="99%"><textarea>'+plugin.getDescription()+'</textarea></td>' +
        '   <td>'+plugin.getAuthor()+'</td>' +
        '   <td>'+plugin.getVersion()+'</td>' +
        '   <td>' +
        '       <div class="checkbox" onclick="pluginModule.handlePlugin(this);">' +
        '       <div class="checkbox-inner">' +
        '               <input id="'+plugin.getName()+'" type="checkbox" ' + (pluginCookie[plugin.getName()] ? "checked" : "") +'>' +
        '               <span></span>' +
        '           </div>' +
        '       </div>' +
        '   </td>' +
        '</tr>';
    });

    settingsInner += '</tbody></table>' +
    '               </div>' +
    '               <div class="bd-pane control-group" id="bd-themes-pane" style="display:none;">';
    
    
    if(typeof(themesupport2) === "undefined") {
    settingsInner += '' +
    '                   Your version does not support themes. Download the latest version.';
    }else {
        settingsInner += '' +
        '                   <table class="bd-g-table">' +
        '                       <thead><tr><th>Name</th><th>Description</th><th>Author</th><th>Version</th><th></th></tr></thead><tbody>';
        $.each(bdthemes, function() {
            settingsInner += '' +
            '<tr>' +
            '   <td>'+this["name"]+'</td>' +
            '   <td width="99%"><textarea>'+this["description"]+'</textarea></td>' +
            '   <td>'+this["author"]+'</td>' +
            '   <td>'+this["version"]+'</td>' +
            '   <td>' +
            '       <div class="checkbox" onclick="themeModule.handleTheme(this);">' +
            '           <div class="checkbox-inner">' +
            '               <input id="ti'+this["name"]+'" type="checkbox" ' + (themeCookie[this["name"]] ? "checked" : "") +'>' +
            '               <span></span>' +
            '           </div>' +
            '       </div>' +
            '   </td>' +
            '</tr>';
        });
        settingsInner += '</tbody></table>';
    }
    
    
    settingsInner += '' +
    '               </div>' +
    '' +
    '       </div>' +
    '   </div>' +
    '</div>';
    
    function showSettings() {
        $(".tab-bar-item").removeClass("selected");
        settingsButton.addClass("selected");
        $(".form .settings-right .settings-inner").first().hide();
        panel.show();
        if(lastTab == "") {
            self.changeTab("bd-settings-tab");
        } else {
            self.changeTab(lastTab);
        }
    }

    settingsButton = $("<div/>", {
        class: "tab-bar-item",
        text: "BetterDiscord",
        id: "bd-settings-new",
        click: showSettings
    });

    panel.html(settingsInner);

    function defer() {
        if($(".btn.btn-settings").length < 1) {
            setTimeout(defer, 100);
        }else {
            $(".btn.btn-settings").first().on("click", function() {

                function innerDefer() {
                    if($(".modal-inner").first().is(":visible")) {

                        panel.hide();
                        var tabBar = $(".tab-bar.SIDE").first();

                        $(".tab-bar.SIDE .tab-bar-item").click(function() {
                            $(".form .settings-right .settings-inner").first().show();
                            $("#bd-settings-new").removeClass("selected");
                            panel.hide();
                        });

                        tabBar.append(settingsButton);
                        panel.insertAfter(".form .settings-right .settings-inner");
                        $("#bd-settings-new").removeClass("selected");
                    } else {
                        setTimeout(innerDefer, 100);
                    }
                }
                innerDefer();
            });
        }
    }
    defer();
    
};

/* BetterDiscordApp Utilities JavaScript
 * Version: 1.0
 * Author: Jiiks | http://jiiks.net
 * Date: 26/08/2015 - 15:54
 * https://github.com/Jiiks/BetterDiscordApp
 */

var _hash;
function Utils() {

}

Utils.prototype.getTextArea = function() {
    return $(".channel-textarea-inner textarea");
};

Utils.prototype.jqDefer = function(fnc) {
    if(window.jQuery) { fnc(); } else { setTimeout(function() { this.jqDefer(fnc) }, 100) }
};

Utils.prototype.getHash = function() {
    $.getJSON("https://api.github.com/repos/Jiiks/BetterDiscordApp/commits/master", function(data) {
        _hash = data.sha;
        emoteModule.getBlacklist();
    });
};

Utils.prototype.loadHtml = function(html, callback) {
  var container = $("<div/>", {
      class: "bd-container"
  }).appendTo("body");  

  //TODO Inject these in next core update
  html = '//cdn.rawgit.com/Jiiks/BetterDiscordApp/' + _hash + '/html/' + html + '.html';
  
  container.load(html, callback());
};

Utils.prototype.injectJs = function(uri) {
    $("<script/>", {
        type: "text/javascript",
        src: uri
    }).appendTo($("body"));
};

Utils.prototype.injectCss = function(uri) {
    $("<link/>", {
        type: "text/css",
        rel: "stylesheet",
        href: uri
    }).appendTo($("head"));
};

/* BetterDiscordApp VoiceMode JavaScript
 * Version: 1.0
 * Author: Jiiks | http://jiiks.net
 * Date: 25/10/2015 - 19:10
 * https://github.com/Jiiks/BetterDiscordApp
 */

function VoiceMode() {

}

VoiceMode.prototype.obsCallback = function() {
    var self = this;
    if(settingsCookie["bda-gs-4"]) {
        self.disable();
        setTimeout(function() {
            self.enable();
        }, 300);
    }
}

VoiceMode.prototype.enable = function() {
    $(".scroller.guild-channels ul").first().css("display", "none");
    $(".scroller.guild-channels header").first().css("display", "none");
    $(".app.flex-vertical").first().css("overflow", "hidden");
    $(".chat.flex-vertical.flex-spacer").first().css("visibility", "hidden").css("min-width", "0px");
    $(".flex-vertical.channels-wrap").first().css("flex-grow", "100000");
    $(".guild-header .btn.btn-hamburger").first().css("visibility", "hidden");
};

VoiceMode.prototype.disable = function() {
    $(".scroller.guild-channels ul").first().css("display", "");
    $(".scroller.guild-channels header").first().css("display", "");
    $(".app.flex-vertical").first().css("overflow", "");
    $(".chat.flex-vertical.flex-spacer").first().css("visibility", "").css("min-width", "");
    $(".flex-vertical.channels-wrap").first().css("flex-grow", "");
    $(".guild-header .btn.btn-hamburger").first().css("visibility", "");
};

/* BetterDiscordApp PluginModule JavaScript
 * Version: 1.0
 * Author: Jiiks | http://jiiks.net
 * Date: 16/12/2015
 * https://github.com/Jiiks/BetterDiscordApp
 */

var pluginCookie = {};

function PluginModule() {
    
}

PluginModule.prototype.loadPlugins = function() {

    this.loadPluginData();

    $.each(bdplugins, function() {
        var plugin = this["plugin"];
        plugin.load();
        
        var name = plugin.getName();
        var enabled = false;
        
        if(pluginCookie.hasOwnProperty(name)) {
            enabled = pluginCookie[name];
        } else {
            pluginCookie[name] = false;
        }
        
        if(enabled) {
            plugin.start();
        }
    });
};

PluginModule.prototype.handlePlugin = function(checkbox) {
    
    var cb = $(checkbox).children().find('input[type="checkbox"]');
    var enabled = !cb.is(":checked");
    var id = cb.attr("id");
    cb.prop("checked", enabled);
    
    if(enabled) {
        bdplugins[id]["plugin"].start();
        pluginCookie[id] = true;
    } else {
        bdplugins[id]["plugin"].stop();
        pluginCookie[id] = false;
    }
    
    this.savePluginData();
};

PluginModule.prototype.loadPluginData = function() {
    var cookie = $.cookie("bd-plugins");
    if(cookie != undefined) {
        pluginCookie = JSON.parse($.cookie("bd-plugins")); 
    }
};

PluginModule.prototype.savePluginData = function() {
    $.cookie("bd-plugins", JSON.stringify(pluginCookie), { expires: 365, path: '/' });
};

/* BetterDiscordApp ThemeModule JavaScript
 * Version: 1.0
 * Author: Jiiks | http://jiiks.net
 * Date: 16/12/2015
 * https://github.com/Jiiks/BetterDiscordApp
 */

var themeCookie = {};

function ThemeModule() {
    
}

ThemeModule.prototype.loadThemes = function() {
    this.loadThemeData();
    
    $.each(bdthemes, function() {
        var name = this["name"];
        var enabled = false;
        if(themeCookie.hasOwnProperty(name)) {
            if(themeCookie[name]) {
                enabled = true;
            }
        } else {
            themeCookie[name] = false;
        }
        
        if(enabled) {
            $("head").append('<style id="'+name+'">'+unescape(bdthemes[name]["css"])+'</style>');
        }
    });
};

ThemeModule.prototype.handleTheme = function(checkbox) {
    
    var cb = $(checkbox).children().find('input[type="checkbox"]');
    var enabled = !cb.is(":checked");
    var id = cb.attr("id").substring(2);
    cb.prop("checked", enabled);
    
    if(enabled) {
        $("head").append('<style id="'+id+'">'+unescape(bdthemes[id]["css"])+'</style>');
        themeCookie[id] = true;
    } else {
        $("#"+id).remove();
        themeCookie[id] = false;
    }
    
    this.saveThemeData();
};

ThemeModule.prototype.loadThemeData = function() {
    var cookie = $.cookie("bd-themes");
    if(cookie != undefined) {
        themeCookie = JSON.parse($.cookie("bd-themes"));
    }
};

ThemeModule.prototype.saveThemeData = function() {
    $.cookie("bd-themes", JSON.stringify(themeCookie), { expires: 365, path: '/' });
};


/* BetterDiscordApp API for Plugins
 * Version: 1.0
 * Author: Jiiks | http://jiiks.net
 * Date: 11/12/2015
 * Last Update: 11/12/2015
 * https://github.com/Jiiks/BetterDiscordApp
 * 
 * Plugin Template: https://gist.github.com/Jiiks/71edd5af0beafcd08956
 */

function BdApi() {}

//Joins a server
//code = server invite code
BdApi.joinServer = function(code) {
	opublicServers.joinServer(code);
};

//Inject CSS to document head
//id = id of element
//css = custom css
BdApi.injectCSS = function(id, css) {
	$("head").append('<style id="'+id+'"></style>')
    $("#" + id).html(css);
};

//Clear css/remove any element
//id = id of element
BdApi.clearCSS = function(id) {
	$("#"+id).remove();
};

//Get another plugin
//name = name of plugin
BdApi.getPlugin = function(name) {
    if(bdplugins.hasOwnProperty(name)) {
        return bdplugins[name]["plugin"];
    }
    return null;
};

//Get ipc for reason
BdApi.getIpc = function() {
	return betterDiscordIPC;
};

//Get BetterDiscord Core
BdApi.getCore = function() {
    return mainCore;	
};

//Attempts to get user id by username
//Name = username
//Since Discord hides users if there's too many, this will often fail
BdApi.getUserIdByName = function(name) {
    var users = $(".member-username");
    
    for(var i = 0 ; i < users.length ; i++) {
        var user = $(users[i]);
        if(user.text() == name) {
            var avatarUrl = user.closest(".member").find(".avatar-small").css("background-image");
            return avatarUrl.match(/\d+/);
        }
    }
    return null;
};

//Attempts to get username by id
//ID = user id
//Since Discord hides users if there's too many, this will often fail
var gg;
BdApi.getUserNameById = function(id) {
    var users = $(".avatar-small");
    
    for(var i = 0 ; i < users.length ; i++) {
        var user = $(users[i]);
        var url = user.css("background-image");
        if(id == url.match(/\d+/)) {
            return user.parent().find(".member-username").text();
        }
    }
    return null;
};