function Y(l){let p="";if(l.ctrlKey)p+="control";if(l.metaKey)p+="meta";if(l.shiftKey)p+="shift";if(l.altKey)p+="alt";if(l.key==="ArrowLeft")l.preventDefault();if(l.key==="ArrowRight")l.preventDefault();if(l.key==="Backspace"){if(p.length>1)return l.preventDefault(),p+"Backspace";return p+"backspace"}if(l.key===" ")return l.preventDefault(),"space";return p+l.key}function f(l,p){let y=0;for(let M=0;M<p;M++){let g=l.children[M].classList;if(g.contains("completed")&&!g.contains("wrong"))y++}return y}function j(l,p,y,M,$,g,A){p.timeoutId=null,p.startTime=null,p.endTime=null,p.isRunning=!1,p.isFinished=!1,l.numberOfLines=0,l.lineIndex=0,l.lastLineIndex=0,l.numberOfWords=0,l.numberOfNewWords=0,l.wordIndex=0,l.charIndex=0,l.totalIndex=0,l.correctWords=0,l.incorrectCharacters=0,y.length=0,M.innerHTML="",$.innerText="60",g.focus(),A()}function z(l,p,y){let M=(l-p)/1000;return y/M*60}function F(l,p,y){let M=(l-p)/1000;return y/5/(M/60)}function K(l,p){return((l-p)/l*100).toFixed(2)}function H(l){let p=new Date(l),y={month:"short",day:"2-digit",weekday:"short",hour:"2-digit",minute:"2-digit",hour12:!1},$=new Intl.DateTimeFormat("en-US",y).formatToParts(p),g={};for(let A=0;A<$.length;A++)g[$[A].type]=$[A].value;return`${g.month} ${g.day}, ${g.weekday} - ${g.hour}:${g.minute}`}function Q(l){let p=Date.now(),y=new Date(p-performance.now()+l),M=String(y.getHours()).padStart(2,"0"),$=String(y.getMinutes()).padStart(2,"0"),g=String(y.getSeconds()).padStart(2,"0"),A=String(y.getMilliseconds()).padStart(3,"0");return`${M}:${$}:${g}.${A}`}var k=document.querySelector(".results section ul"),J=document.querySelector(".results section>div>a"),L=(l,p,y,M)=>`
  <li class="list-group-item">
    <div class="wpm-container">
      <div class="wpm"><span class="property">WPM</span><span class="number">${l}</span></div>
      <div class="raw-wpm"><span class="property">Raw WPM</span><span class="number">${p}</span></div>
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
`,q=JSON.parse(localStorage.getItem("typingStats"));if(!q||q.length===0)k.innerHTML=P(),J.setAttribute("hidden","");else for(let l=q.length-1;l>=0;l--){let{wpm:p,rawWPM:y,accuracy:M,timestamp:$}=q[l];k.innerHTML+=L(p,y,M,H($))}
