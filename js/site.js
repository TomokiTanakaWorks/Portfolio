/* Accessible, responsive portfolio. No jQuery, no framework. */
(() => {
"use strict";
const page = document.body.dataset.page;
document.querySelectorAll(".navigation a").forEach(a => {if(a.dataset.nav===page)a.setAttribute("aria-current","page")});
document.querySelectorAll("[data-year]").forEach(x => x.textContent=String(new Date().getFullYear()));
function path(p){return String(p||"").replace(/^\.\//,"").replace(/\/{2,}/g,"/")}
function optimized(p,thumb=false){
  const original=path(p);
  if(!/^img\/.*\.(png|jpe?g|jfif)$/i.test(original))return original;
  return "assets/optimized/"+original.substring(4).replace(/\.[^/.]+$/,"")+(thumb?".thumb.webp":".webp");
}
function picture(src,thumb,alt,eager=false){
 const img=new Image();img.alt=alt||"";img.decoding="async";img.loading=eager?"eager":"lazy";
 if(eager)img.fetchPriority="high";
 const normal=path(src),webp=optimized(src,thumb);
 if(webp!==normal){
   img.onerror=()=>{img.onerror=null;img.src=normal;};
 }
 img.src=webp;return img;
}
document.querySelectorAll("img[data-optimize]").forEach(img=>{
 const src=img.getAttribute("src"),opt=optimized(src);
 if(opt!==src){img.onerror=()=>{img.onerror=null;img.src=src};img.src=opt;}
});
const projects=window.portfolioProjects||[];
const grid=document.getElementById("project-grid");
if(grid){
 const dialog=document.getElementById("project-dialog"), gallery=document.getElementById("dialog-gallery");
 const title=document.getElementById("dialog-title"),description=document.getElementById("dialog-description"),tools=document.getElementById("dialog-tools"),meta=document.getElementById("dialog-meta");
 document.getElementById("work-count").textContent=projects.length;
 document.getElementById("all-count").textContent=projects.length;
 const featured=projects[1]||projects[0];
 if(featured){
   document.getElementById("featured-art").prepend(picture(featured.thumbnail,false,featured.title,true));
   document.getElementById("featured-title").textContent=featured.title;
 }
 function classes(item){
   const t=(item.title+" "+item.discription);
   const set=new Set(["three-d"]);
   if(/ライブ|ステージ|VICON|劇場|紅白|ショー|イベント|Mocap|収録|LIVE/i.test(t))set.add("stage");
   if(/ディレク|デザイン|制作進行|アシスタント|ADとして|技術的/i.test(t))set.add("direction");
   return set;
 }
 const date=item=>((item.discription||"").match(/20\d{2}年/)||[""])[0].replace("年","");
 const category=item=>{const set=classes(item);return set.has("direction")?"DIRECTION":set.has("stage")?"LIVE / STAGE":"3D / VISUAL"};
 function open(item,index){
   title.textContent=item.title;
   meta.textContent=String(index+1).padStart(2,"0")+" / "+(date(item)||"ARCHIVE")+" / "+category(item);
   description.innerHTML=item.discription||"";gallery.replaceChildren();tools.replaceChildren();
   if(item.icons?.length){
     const label=document.createElement("h3");label.textContent="TOOLS / SOFTWARE";
     const row=document.createElement("div");row.className="tool-icons";
     item.icons.forEach(p=>row.append(picture(p,false,p.split("/").pop().split(".")[0])));
     tools.append(label,row);
   }
   if(item.video){
     const play=document.createElement("button");play.type="button";play.className="play-video";
     const playLabel=document.createElement("span");playLabel.textContent="▶ WATCH PROJECT VIDEO / YOUTUBE";
     const arrow=document.createElement("span");arrow.textContent="↗";play.append(playLabel,arrow);
     play.addEventListener("click",()=>{
       const embed=document.createElement("div");embed.className="video-embed";
       const frame=document.createElement("iframe");frame.title=item.title+" / YouTube";
       frame.src=item.video.replaceAll("&amp;","&");frame.loading="lazy";frame.allowFullscreen=true;
       frame.referrerPolicy="strict-origin-when-cross-origin";
       frame.allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
       embed.append(frame);play.replaceWith(embed);
     },{once:true});
     gallery.append(play);
   }
   (item.modalImages||[]).forEach((source,n)=>{
     const figure=document.createElement("figure"),link=document.createElement("a"),caption=document.createElement("figcaption");
     link.href=path(source);link.target="_blank";link.rel="noopener noreferrer";
     link.setAttribute("aria-label","作品画像 "+(n+1)+" のオリジナルを開く");
     link.append(picture(source,false,item.title+" / "+(n+1)));
     caption.textContent="IMAGE "+String(n+1).padStart(2,"0")+" / OPEN ORIGINAL ↗";
     figure.append(link,caption);gallery.append(figure);
   });
   dialog.showModal();
   document.body.classList.add("locked");
 }
 document.getElementById("dialog-close").addEventListener("click",()=>dialog.close());
 dialog.addEventListener("click",e=>{if(e.target===dialog)dialog.close()});
 dialog.addEventListener("close",()=>{document.body.classList.remove("locked");gallery.replaceChildren()});
 function render(f){
   const frag=document.createDocumentFragment();let shown=0;
   projects.forEach((item,i)=>{
     if(f!=="all"&&!classes(item).has(f))return;
     shown++;
     const card=document.createElement("button");card.className="project-card";card.type="button";
     card.setAttribute("aria-label",item.title+" の詳細を開く");
     const visual=document.createElement("div");visual.className="card-visual";
     visual.append(picture(item.thumbnail,true,item.title,f==="all"&&i<3));
     const num=document.createElement("span");num.className="card-number";num.textContent=String(i+1).padStart(2,"0");
     const arrow=document.createElement("span");arrow.className="card-arrow";arrow.textContent="↗";arrow.setAttribute("aria-hidden","true");
     visual.append(num,arrow);
     const caption=document.createElement("div");caption.className="card-bottom";
     const name=document.createElement("h3");name.textContent=item.title;
     const year=document.createElement("time");year.textContent=date(item);
     caption.append(name,year);
     const type=document.createElement("p");type.className="card-type";type.textContent=category(item);
     card.append(visual,caption,type);
     card.addEventListener("click",()=>open(item,i));frag.append(card);
   });
   grid.replaceChildren(frag);
   document.getElementById("no-results").hidden=shown>0;
 }
 document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{
   const f=b.dataset.filter;document.querySelectorAll(".filter").forEach(x=>{x.classList.toggle("is-active",x===b);x.setAttribute("aria-pressed",String(x===b))});
   render(f);
 }));
 render("all");
}
const consent=document.getElementById("consent-overlay");
if(consent){
 let ok=false;try{ok=localStorage.getItem("disclaimerAgreed")==="true"}catch(_){}
 if(!ok){consent.hidden=false;document.body.classList.add("locked");}
 document.getElementById("agreeButton").addEventListener("click",()=>{
  try{localStorage.setItem("disclaimerAgreed","true")}catch(_){}
  consent.hidden=true;document.body.classList.remove("locked");
 });
 document.getElementById("disagreeButton").addEventListener("click",()=>location.assign("https://www.google.com"));
}
})();
