import { birdEatsBugDefaultOptions } from 'src/components/analytics/bird-eats-bugs';

/* Bird eats bug loading script https://docs.birdeatsbug.com/latest/sdk/installation.html */
export const birdEatsBugScript = `
    (function(){const birdeatsbug=(window.birdeatsbug=window.birdeatsbug||[]);if(birdeatsbug.initialize)return;if(birdeatsbug.invoked){if(window.console&&console.error){console.error('birdeatsbug snippet included twice.')}return}birdeatsbug.invoked=true;birdeatsbug.methods=['setOptions','trigger','resumeSession','takeScreenshot','startRecording','stopRecording','stopSession','uploadSession','deleteSession'];birdeatsbug.factory=function(method){return function(){const args=Array.prototype.slice.call(arguments);args.unshift(method);birdeatsbug.push(args);return birdeatsbug}};for(let i=0;i<birdeatsbug.methods.length;i++){const key=birdeatsbug.methods[i];birdeatsbug[key]=birdeatsbug.factory(key)}birdeatsbug.load=function(){const script=document.createElement('script');script.type='module';script.async=true;script.src='https://sdk.birdeatsbug.com/v2/core.js';const mountJsBefore=document.getElementsByTagName('script')[0]||document.body.firstChild;mountJsBefore.parentNode.insertBefore(script,mountJsBefore);const style=document.createElement('link');style.rel='stylesheet';style.type='text/css';style.href='https://sdk.birdeatsbug.com/v2/style.css';const mountCssBefore=document.querySelector('link[rel="stylesheet"]')||mountJsBefore;mountCssBefore.parentNode.insertBefore(style,mountCssBefore)};birdeatsbug.load();window.birdeatsbug.setOptions(${JSON.stringify(
        birdEatsBugDefaultOptions,
    )})})();
  `;
