(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
function norm(s){return (s||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
var q=$("#q"),pl=$("#pl"),cat=$("#cat"),cont=$("#cont"),vazio=$("#vazio"),limpar=$("#limpar");
var itens=$$("article.mat,article.corpo");
function aplicar(save){
  var t=norm(q?q.value.trim():""),p=pl?pl.value:"",c=cat?cat.value:"";
  var vis=0;
  itens.forEach(function(el){
    var ok=true;
    if(t){t.split(/\s+/).forEach(function(w){if((el.getAttribute("data-q")||"").indexOf(w)<0)ok=false})}
    if(ok&&p){ok=(el.getAttribute("data-pl")||"").split("|").indexOf(p)>=0}
    if(ok&&c){ok=el.getAttribute("data-cat")===c}
    el.hidden=!ok;if(ok)vis++;
  });
  $$("section.grupo,section.sistema").forEach(function(s){s.hidden=!s.querySelector("article:not([hidden])")});
  // matriz: sombra na borda direita enquanto houver o que rolar
  $$(".matriz-wrap").forEach(function(wp){var bx=wp.parentNode;function f(){bx.classList.toggle("fim",wp.scrollLeft+wp.clientWidth>=wp.scrollWidth-4)}wp.addEventListener("scroll",f);window.addEventListener("resize",f);f()});
  // matriz: destaca colunas/linhas
  $$("table.matriz tbody tr").forEach(function(tr){
    var ok=!t||(tr.getAttribute("data-q")||"").indexOf(t)>=0;
    tr.hidden=!ok&&!!t&&!hasMatch(tr.getAttribute("data-q"),t);
  });
  $$("table.matriz [data-pl]").forEach(function(c2){c2.classList.toggle("dim",!!p&&c2.getAttribute("data-pl")!==p)});
  if(cont){cont.textContent=(t||p||c)?(vis+" resultado"+(vis===1?"":"s")):""}
  if(vazio){vazio.hidden=vis>0}
  if(save!==false){var u=new URLSearchParams();if(q&&q.value)u.set("q",q.value);if(p)u.set("corpo",p);if(c)u.set("tipo",c);
    var s=u.toString();try{history.replaceState(null,"",location.pathname+(s?"?"+s:"")+location.hash)}catch(e){}}
}
function hasMatch(dq,t){return t.split(/\s+/).every(function(w){return (dq||"").indexOf(w)>=0})}
[q,pl,cat].forEach(function(e){if(e)e.addEventListener(e===q?"input":"change",function(){aplicar()})});
if(limpar)limpar.addEventListener("click",function(){if(q)q.value="";if(pl)pl.value="";if(cat)cat.value="";aplicar();if(q)q.focus()});
var u=new URLSearchParams(location.search);
if(q&&u.get("q"))q.value=u.get("q");
if(pl&&u.get("corpo"))pl.value=u.get("corpo");
if(cat&&u.get("tipo"))cat.value=u.get("tipo");
aplicar(false);
// ao abrir um link #material, garante que ele não esteja filtrado
if(location.hash){var el=document.getElementById(location.hash.slice(1));if(el&&el.hidden){if(q)q.value="";if(pl)pl.value="";if(cat)cat.value="";aplicar(false);el.scrollIntoView()}}
})();
