(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function norm(s){return (s||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")}
var q=$("#q"),cont=$("#cont"),vazio=$("#vazio"),limpar=$("#limpar"),extra=$("#extra");
var sels=$$(".filtros select");
var itens=$$("article[data-q]");
var u0=new URLSearchParams(location.search);
var ext={};
["usa","faz"].forEach(function(k){if(u0.get(k))ext[k]=u0.get(k)});
function tokens(el,a){return (el.getAttribute("data-"+a)||"").split(/[|\s]+/)}
function selVal(id){var s=$("#"+id);return s?s.value:""}
function aplicar(save){
  var t=norm(q?q.value.trim():"");
  var vis=0,filtrando=!!t||Object.keys(ext).length>0;
  itens.forEach(function(el){
    var ok=true;
    if(t){t.split(/\s+/).forEach(function(w){if((el.getAttribute("data-q")||"").indexOf(w)<0)ok=false})}
    sels.forEach(function(s){if(ok&&s.value){ok=tokens(el,s.getAttribute("data-attr")).indexOf(s.value)>=0}});
    Object.keys(ext).forEach(function(k){if(ok){ok=tokens(el,k).indexOf(ext[k])>=0}});
    el.hidden=!ok;if(ok)vis++;
  });
  sels.forEach(function(s){if(s.value)filtrando=true});
  $$("section.grupo,section.sistema").forEach(function(s){s.hidden=!s.querySelector("article:not([hidden])")});
  $$(".matriz-wrap").forEach(function(wp){var bx=wp.parentNode;function f(){bx.classList.toggle("fim",wp.scrollLeft+wp.clientWidth>=wp.scrollWidth-4)}wp.onscroll=f;window.onresize=f;f()});
  var p=selVal("pl");
  $$("table.matriz tbody tr").forEach(function(tr){
    var dq=tr.getAttribute("data-q")||"";
    tr.hidden=!!t&&!t.split(/\s+/).every(function(w){return dq.indexOf(w)>=0});
  });
  $$("table.matriz [data-pl]").forEach(function(c2){c2.classList.toggle("dim",!!p&&c2.getAttribute("data-pl")!==p)});
  if(cont){cont.textContent=filtrando?(vis+" resultado"+(vis===1?"":"s")):""}
  if(vazio){vazio.hidden=vis>0}
  if(extra){
    var ks=Object.keys(ext);extra.hidden=!ks.length;
    if(ks.length){var N=window.WIKI_NOMES||{};
      extra.innerHTML=ks.map(function(k){return (k==="usa"?"Mostrando só o que gasta ":"Mostrando só o que produz ")+"<b>"+(N[ext[k]]||ext[k])+"</b>"}).join(" · ")+' <a href="#" id="tirar-extra">tirar este filtro</a>';
      var te=$("#tirar-extra");if(te)te.onclick=function(e){e.preventDefault();ext={};aplicar()};
    }
  }
  if(save!==false){var u=new URLSearchParams();if(q&&q.value)u.set("q",q.value);
    sels.forEach(function(s){if(s.value)u.set(s.getAttribute("data-param")||s.id,s.value)});
    Object.keys(ext).forEach(function(k){u.set(k,ext[k])});
    var s=u.toString();try{history.replaceState(null,"",location.pathname+(s?"?"+s:"")+location.hash)}catch(e){}}
}
if(q)q.addEventListener("input",function(){aplicar()});
sels.forEach(function(s){s.addEventListener("change",function(){aplicar()})});
if(limpar)limpar.addEventListener("click",function(){if(q)q.value="";sels.forEach(function(s){s.value=""});ext={};aplicar();if(q)q.focus()});
if(q&&u0.get("q"))q.value=u0.get("q");
sels.forEach(function(s){var v=u0.get(s.getAttribute("data-param")||s.id);if(v)s.value=v});
aplicar(false);
if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el&&el.hidden){if(q)q.value="";sels.forEach(function(s){s.value=""});ext={};aplicar(false);el.scrollIntoView()}}
})();
