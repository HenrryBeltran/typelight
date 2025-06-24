async function Y(){return await(await fetch("/words.json")).json()}function f(p){let y=JSON.parse(localStorage.getItem("typingStats")||"[]");if(y.length>=1e4)y.shift();y.push(p),localStorage.setItem("typingStats",JSON.stringify(y))}async function j(p,l){for(let y=60;y>0;y--)if(p.isRunning)l.innerText=y.toString(),await new Promise((M)=>setTimeout(M,1000));else return;l.innerText="0"}function z(p,l,y,M,$,g,A){l.timeoutId=null,l.startTime=null,l.endTime=null,l.isRunning=!1,l.isFinished=!1,p.numberOfLines=0,p.lineIndex=0,p.lastLineIndex=0,p.numberOfWords=0,p.numberOfNewWords=0,p.wordIndex=0,p.charIndex=0,p.totalIndex=0,p.correctWords=0,p.incorrectCharacters=0,y.length=0,M.innerHTML="",$.innerText="60",g.focus(),A()}function F(p,l,y){let M=(p-l)/1000;return y/M*60}function K(p,l,y){let M=(p-l)/1000;return y/5/(M/60)}function Q(p,l){return((p-l)/p*100).toFixed(2)}function H(p){let l=new Date(p),y={month:"short",day:"2-digit",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:!1},$=new Intl.DateTimeFormat("en-US",y).formatToParts(l),g={};for(let A=0;A<$.length;A++)g[$[A].type]=$[A].value;return`${g.month} ${g.day}, ${g.weekday} - ${g.hour}:${g.minute}`}function R(p){let l="";if(p.ctrlKey)l+="control";if(p.metaKey)l+="meta";if(p.shiftKey)l+="shift";if(p.altKey)l+="alt";if(p.key==="ArrowLeft")p.preventDefault();if(p.key==="ArrowRight")p.preventDefault();if(p.key==="Backspace"){if(l.length>1)return p.preventDefault(),l+"Backspace";return l+"backspace"}if(p.key===" ")return p.preventDefault(),"space";return l+p.key}function V(p,l){let y=0;for(let M=0;M<l;M++){let g=p.children[M].classList;if(g.contains("completed")&&!g.contains("wrong"))y++}return y}function X(p){let l=Date.now(),y=new Date(l-performance.now()+p),M=String(y.getHours()).padStart(2,"0"),$=String(y.getMinutes()).padStart(2,"0"),g=String(y.getSeconds()).padStart(2,"0"),A=String(y.getMilliseconds()).padStart(3,"0");return`${M}:${$}:${g}.${A}`}var k=document.querySelector(".results section ul"),J=document.querySelector(".results section>div>a"),L=(p,l,y,M)=>`
  <li class="list-group-item">
    <div class="wpm-container">
      <div class="wpm"><span class="property">WPM</span><span class="number">${p}</span></div>
      <div class="raw-wpm"><span class="property">Raw WPM</span><span class="number">${l}</span></div>
      <div class="accuracy"><span class="property">Accuracy</span><span class="number">${y}%</span></div>
    </div>
    <span class="date">${M}</span>
  </li>
`,P=()=>`
  <li class="list-group-item">
    <div class="empty">
      <span>You didn't made any test yet.</span>
      <a href="/test">Make a test</a>
    </div>
  </li>
`,q=JSON.parse(localStorage.getItem("typingStats"));if(!q||q.length===0)k.innerHTML=P(),J.setAttribute("hidden","");else for(let p=q.length-1;p>=0;p--){let{wpm:l,rawWPM:y,accuracy:M,timestamp:$}=q[p];k.innerHTML+=L(l,y,M,H($))}
