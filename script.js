const $=id=>document.getElementById(id);

const scene=$("scene");
const playBtn=$("playBtn");
const restartBtn=$("restartBtn");
const stageTag=$("stageTag");
const stageName=$("stageName");
const stageText=$("stageText");
const ploidy=$("ploidy");
const chromosomesCount=$("chromosomesCount");
const chromatidsCount=$("chromatidsCount");
const dnaContent=$("dnaContent");
const noteTitle=$("noteTitle");
const noteText=$("noteText");
const progressBar=$("progressBar");
const phaseItems=[...document.querySelectorAll("#phaseList li")];

let paused=false;
let started=false;

const mainCell=$("mainCell"), nucleus=$("nucleus"), chromatin=$("chromatin"), chromatinCopies=$("chromatinCopies");
const replicationText=$("replicationText"), equatorI=$("equatorI"), spindleI=$("spindleI");
const mLong=$("mLong"), pLong=$("pLong"), mShort=$("mShort"), pShort=$("pShort");
const crossGlow=$("crossGlow"), crossText=$("crossText"), leftCell=$("leftCell"), rightCell=$("rightCell");
const spindleII=$("spindleII"), equatorIILeft=$("equatorIILeft"), equatorIIRight=$("equatorIIRight");
const singleGroup=$("singleGroup"), divisionLabel=$("divisionLabel");
const finalCells=[$("f1"),$("f2"),$("f3"),$("f4")];
const singles=[$("s1"),$("s2"),$("s3"),$("s4"),$("s5"),$("s6"),$("s7"),$("s8")];

function lerp(a,b,t){return a+(b-a)*t}
function ease(t){return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2}

function tween(duration,update){
  return new Promise(resolve=>{
    let elapsed=0,last=performance.now();
    function frame(now){
      if(!paused){
        elapsed+=now-last;
        const t=Math.min(elapsed/duration,1);
        update(ease(t));
        if(t>=1){resolve();return;}
      }
      last=now;
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  });
}
function hold(duration){return tween(duration,()=>{})}
function fade(el,from,to,d=550){
  el.style.opacity=from;
  return tween(d,t=>{el.style.opacity=lerp(from,to,t)});
}
function setPos(el,x,y){el.setAttribute("transform",`translate(${x} ${y})`)}
function move(el,from,to,d=1000){
  return tween(d,t=>setPos(el,lerp(from[0],to[0],t),lerp(from[1],to[1],t)));
}
function attr(el,name,from,to,d=700){
  return tween(d,t=>el.setAttribute(name,lerp(from,to,t)));
}
function setStage(s){
  stageTag.textContent=`ETAPA ${s.n} DE 10`;
  stageName.textContent=s.name; stageText.textContent=s.text;
  ploidy.textContent=s.ploidy; chromosomesCount.textContent=s.chrom; chromatidsCount.textContent=s.chromatids; dnaContent.textContent=s.dna;
  noteTitle.textContent=s.noteTitle; noteText.textContent=s.note;
  progressBar.style.width=`${s.progress}%`;
  phaseItems.forEach(li=>{
    const n=Number(li.dataset.stage);
    li.classList.toggle("active",n===s.n);
    li.classList.toggle("done",n<s.n);
  });
}

function placeInitialChromosomes(){
  setPos(mLong,410,245);setPos(pLong,590,245);setPos(mShort,410,385);setPos(pShort,590,385);
}
placeInitialChromosomes();

async function stage1(){
  setStage({n:1,name:"Interfase pré-meiótica — fase S",text:"A cromatina permanece descondensada enquanto o DNA é replicado antes da Meiose I.",ploidy:"2n",chrom:"4",chromatids:"4 → 8",dna:"2C → 4C",noteTitle:"A replicação não altera a ploidia",note:"O número de cromossomos continua 4. O que dobra é a quantidade de DNA e o número de cromátides.",progress:10});
  await Promise.all([fade(chromatinCopies,0,1,1000),fade(replicationText,0,1,500)]);
  await hold(700);
  await fade(replicationText,1,0,350);
}
async function stage2(){
  setStage({n:2,name:"Prófase I",text:"Os cromossomos condensam, os homólogos fazem sinapse e ocorre crossing-over entre cromátides não-irmãs.",ploidy:"2n",chrom:"4",chromatids:"8",dna:"4C",noteTitle:"Sinapse, bivalentes e crossing-over",note:"Cada par de homólogos forma um bivalente (tétrade). A troca de segmentos cria novas combinações genéticas.",progress:22});
  await Promise.all([fade(chromatin,1,0,650),fade(chromatinCopies,1,0,650),fade(nucleus,1,0.12,700),
    fade(mLong,0,1,600),fade(pLong,0,1,600),fade(mShort,0,1,600),fade(pShort,0,1,600)]);
  await Promise.all([move(mLong,[410,245],[470,240],900),move(pLong,[590,245],[530,240],900),
    move(mShort,[410,385],[470,390],900),move(pShort,[590,385],[530,390],900)]);
  await Promise.all([fade(crossGlow,0,1,350),fade(crossText,0,1,350)]);
  $("mLongArm").setAttribute("stroke","#3e78d6");
  $("pLongArm").setAttribute("stroke","#df5960");
  await hold(850);
  await Promise.all([fade(crossGlow,1,0,350),fade(crossText,1,0,350),fade(nucleus,0.12,0,350)]);
}
async function stage3(){
  setStage({n:3,name:"Metáfase I",text:"Os bivalentes alinham-se no plano equatorial. A orientação mostrada é uma das possibilidades.",ploidy:"2n",chrom:"4",chromatids:"8",dna:"4C",noteTitle:"Alinhamento dos pares homólogos",note:"A orientação independente dos pares homólogos é outra fonte de variabilidade genética.",progress:34});
  await Promise.all([fade(equatorI,0,1,350),fade(spindleI,0,1,500),
    move(mLong,[470,240],[470,235],650),move(pLong,[530,240],[530,235],650),
    move(mShort,[470,390],[470,390],650),move(pShort,[530,390],[530,390],650)]);
  await hold(600);
}
async function stage4(){
  setStage({n:4,name:"Anáfase I",text:"Os cromossomos homólogos separam-se. As cromátides-irmãs continuam unidas pelo centrômero.",ploidy:"n por polo",chrom:"2 por polo",chromatids:"4 por polo",dna:"2C por polo",noteTitle:"O X continua inteiro",note:"Na Anáfase I, cada cromossomo duplicado migra inteiro para um polo; as cromátides ainda não se separam.",progress:46});
  await Promise.all([move(mLong,[470,235],[270,245],1300),move(pShort,[530,390],[325,385],1300),
    move(pLong,[530,235],[730,245],1300),move(mShort,[470,390],[675,385],1300)]);
  await hold(350);
}
async function stage5(){
  setStage({n:5,name:"Telófase I + citocinese",text:"A célula origina duas células haploides. Os cromossomos ainda estão duplicados.",ploidy:"n",chrom:"2",chromatids:"4",dna:"2C",noteTitle:"A Meiose I é reducional",note:"O número de conjuntos cromossômicos cai de 2n para n.",progress:57});
  leftCell.style.opacity=0;rightCell.style.opacity=0;
  await Promise.all([fade(equatorI,1,0,300),fade(spindleI,1,0,350),fade(mainCell,1,0,650),fade(leftCell,0,1,650),fade(rightCell,0,1,650)]);
  await Promise.all([attr(leftCell,"cx",400,280,900),attr(rightCell,"cx",600,720,900),attr(leftCell,"rx",220,190,900),attr(rightCell,"rx",220,190,900),
    move(mLong,[270,245],[245,275],650),move(pShort,[325,385],[315,365],650),move(pLong,[730,245],[755,275],650),move(mShort,[675,385],[685,365],650)]);
  await hold(450);
}
async function stage6(){
  setStage({n:6,name:"Intercinese",text:"As duas células se preparam para a segunda divisão. Não ocorre uma nova replicação do DNA.",ploidy:"n",chrom:"2",chromatids:"4",dna:"2C",noteTitle:"Não existe nova fase S",note:"O DNA foi duplicado apenas uma vez, antes da Meiose I.",progress:65});
  await hold(1000);
}
async function stage7(){
  setStage({n:7,name:"Prófase II",text:"Forma-se um novo fuso em cada célula para a separação das cromátides-irmãs.",ploidy:"n",chrom:"2",chromatids:"4",dna:"2C",noteTitle:"Começa a Meiose II",note:"A ploidia já é n. A segunda divisão separará as cromátides-irmãs.",progress:73});
  divisionLabel.textContent="MEIOSE II";
  await Promise.all([fade(spindleII,0,1,550),fade(divisionLabel,0,1,350),
    move(mLong,[245,275],[255,310],650),move(pShort,[315,365],[305,330],650),
    move(pLong,[755,275],[745,310],650),move(mShort,[685,365],[695,330],650)]);
}
async function stage8(){
  setStage({n:8,name:"Metáfase II",text:"Os cromossomos alinham-se individualmente no equador de cada célula.",ploidy:"n",chrom:"2",chromatids:"4",dna:"2C",noteTitle:"Agora o alinhamento é individual",note:"Diferentemente da Metáfase I, os cromossomos homólogos não estão emparelhados.",progress:82});
  await Promise.all([fade(equatorIILeft,0,1,350),fade(equatorIIRight,0,1,350)]);
  await hold(850);
}
async function stage9(){
  setStage({n:9,name:"Anáfase II",text:"Os centrômeros se dividem e as cromátides-irmãs migram para polos opostos.",ploidy:"n por polo",chrom:"2 por polo",chromatids:"2 por polo",dna:"1C por polo",noteTitle:"As cromátides-irmãs finalmente se separam",note:"Depois da separação, cada cromátide passa a ser considerada um cromossomo independente.",progress:92});
  await Promise.all([fade(equatorIILeft,1,0,250),fade(equatorIIRight,1,0,250),fade(mLong,1,0,300),fade(pLong,1,0,300),fade(mShort,1,0,300),fade(pShort,1,0,300)]);
  singleGroup.style.opacity=1;
  const starts=[[255,310],[255,310],[745,310],[745,310],[305,330],[305,330],[695,330],[695,330]];
  const ends=[[255,165],[255,455],[745,165],[745,455],[305,165],[305,455],[695,165],[695,455]];
  singles.forEach((el,i)=>setPos(el,starts[i][0],starts[i][1]));
  await Promise.all(singles.map((el,i)=>move(el,starts[i],ends[i],1300)));
  await hold(300);
}
async function stage10(){
  setStage({n:10,name:"Telófase II + citocinese",text:"As duas células se dividem novamente, formando quatro células haploides geneticamente diferentes.",ploidy:"n",chrom:"2",chromatids:"2",dna:"1C",noteTitle:"Resultado final",note:"Uma replicação do DNA seguida por duas divisões celulares produz quatro células haploides.",progress:100});
  finalCells.forEach(f=>f.style.opacity=0);
  await Promise.all([fade(spindleII,1,0,350),fade(leftCell,1,0,650),fade(rightCell,1,0,650),fade(divisionLabel,1,0,300),
    ...finalCells.map(f=>fade(f,0,1,600))]);
  await Promise.all([attr($("f1"),"cy",290,160,850),attr($("f2"),"cy",350,460,850),attr($("f3"),"cy",290,160,850),attr($("f4"),"cy",350,460,850),
    move(singles[0],[255,165],[250,160],850),move(singles[4],[305,165],[310,160],850),
    move(singles[1],[255,455],[250,460],850),move(singles[5],[305,455],[310,460],850),
    move(singles[2],[745,165],[690,160],850),move(singles[6],[695,165],[750,160],850),
    move(singles[3],[745,455],[690,460],850),move(singles[7],[695,455],[750,460],850)]);
  divisionLabel.textContent="4 CÉLULAS HAPLOIDES";
  await fade(divisionLabel,0,1,350);
  stageTag.textContent="CONCLUÍDO";
}

async function run(){
  if(started)return;
  started=true;playBtn.textContent="⏸ Pausar";
  await stage1();await stage2();await stage3();await stage4();await stage5();await stage6();await stage7();await stage8();await stage9();await stage10();
  playBtn.textContent="✓ Concluído";playBtn.disabled=true;
}
playBtn.addEventListener("click",()=>{
  if(!started){run();return;}
  paused=!paused;
  playBtn.textContent=paused?"▶ Continuar":"⏸ Pausar";
});
restartBtn.addEventListener("click",()=>location.reload());
