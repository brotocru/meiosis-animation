const $ = (id) => document.getElementById(id);

const playBtn = $("playBtn");
const restartBtn = $("restartBtn");
const phaseTag = $("phaseTag");
const phaseName = $("phaseName");
const phaseDescription = $("phaseDescription");
const ploidyMetric = $("ploidyMetric");
const chromosomeMetric = $("chromosomeMetric");
const chromatidMetric = $("chromatidMetric");
const dnaMetric = $("dnaMetric");
const observeTitle = $("observeTitle");
const observeText = $("observeText");
const progressBar = $("progressBar");

const timelineItems = [...document.querySelectorAll("#timeline li")];

const primaryCell = $("primaryCell");
const nucleus = $("nucleus");
const chromatinG1 = $("chromatinG1");
const chromatinCopies = $("chromatinCopies");
const replicationLabel = $("replicationLabel");

const equatorI = $("equatorI");
const equatorIILeft = $("equatorIILeft");
const equatorIIRight = $("equatorIIRight");
const spindleI = $("spindleI");
const spindleII = $("spindleII");

const cellLeft = $("cellLeft");
const cellRight = $("cellRight");
const finalCells = [$("final1"), $("final2"), $("final3"), $("final4")];

const chrMLong = $("chrMLong");
const chrPLong = $("chrPLong");
const chrMShort = $("chrMShort");
const chrPShort = $("chrPShort");
const chromosomes = [chrMLong, chrPLong, chrMShort, chrPShort];

const chiasmaGlow = $("chiasmaGlow");
const chiasmaMark = $("chiasmaMark");
const chiasmaLabel = $("chiasmaLabel");

const meiosisILabel = $("meiosisILabel");
const meiosisIILabel = $("meiosisIILabel");
const finalLabel = $("finalLabel");

const singleGroup = $("singleChromosomes");
const singles = [
  $("sc1"), $("sc2"), $("sc3"), $("sc4"),
  $("sc5"), $("sc6"), $("sc7"), $("sc8")
];

let started = false;
let paused = false;
const activeAnimations = new Set();

function setOpacity(el, value) {
  el.style.opacity = value;
}

function transformString(p) {
  const x = p.x ?? 0;
  const y = p.y ?? 0;
  const r = p.r ?? 0;
  const s = p.s ?? 1;
  return `translate(${x}px, ${y}px) rotate(${r}deg) scale(${s})`;
}

function place(el, x, y, r = 0, s = 1) {
  el.style.transform = transformString({ x, y, r, s });
}

function animateElement(el, keyframes, options = {}) {
  const animation = el.animate(keyframes, {
    duration: options.duration ?? 900,
    easing: options.easing ?? "ease-in-out",
    fill: "forwards"
  });

  activeAnimations.add(animation);
  if (paused) animation.pause();

  return animation.finished
    .catch(() => {})
    .finally(() => activeAnimations.delete(animation));
}

function fade(el, from, to, duration = 650) {
  el.style.opacity = to;
  return animateElement(el, [{ opacity: from }, { opacity: to }], { duration });
}

function move(el, from, to, duration = 1100) {
  const start = transformString(from);
  const end = transformString(to);
  el.style.transform = end;
  return animateElement(el, [{ transform: start }, { transform: end }], { duration });
}

function scaleFade(el, fromScale, toScale, fromOpacity, toOpacity, duration = 800) {
  el.style.opacity = toOpacity;
  el.style.transform = `scale(${toScale})`;
  return animateElement(
    el,
    [
      { transform: `scale(${fromScale})`, opacity: fromOpacity },
      { transform: `scale(${toScale})`, opacity: toOpacity }
    ],
    { duration }
  );
}

function hold(duration = 650) {
  return animateElement(document.body, [{ opacity: 1 }, { opacity: 1 }], { duration });
}

function updateTimeline(stage) {
  timelineItems.forEach((item) => {
    const n = Number(item.dataset.stage);
    item.classList.toggle("active", n === stage);
    item.classList.toggle("done", n < stage);
  });
}

function updateStage(data) {
  phaseTag.textContent = `ETAPA ${data.stage} DE 10`;
  phaseName.textContent = data.name;
  phaseDescription.textContent = data.description;
  ploidyMetric.textContent = data.ploidy;
  chromosomeMetric.textContent = data.chromosomes;
  chromatidMetric.textContent = data.chromatids;
  dnaMetric.textContent = data.dna;
  observeTitle.textContent = data.observeTitle;
  observeText.textContent = data.observeText;
  progressBar.style.width = `${data.progress}%`;
  updateTimeline(data.stage);
}

function colorCrossingOver() {
  $("mLongSwap").style.stroke = "var(--paternal)";
  $("pLongSwap").style.stroke = "var(--maternal)";
}

function resetCrossingOverColor() {
  $("mLongSwap").style.stroke = "";
  $("pLongSwap").style.stroke = "";
}

function initialPositions() {
  // posições usadas quando os cromossomos condensam na Prófase I
  place(chrMLong, 445, 265, -8);
  place(chrPLong, 635, 265, 8);
  place(chrMShort, 445, 400, 5);
  place(chrPShort, 635, 400, -5);

  singles.forEach((el) => place(el, 0, 0));
}

initialPositions();

async function stage1Interphase() {
  updateStage({
    stage: 1,
    name: "Interfase pré-meiótica — fase S",
    description: "A cromatina está descondensada. O DNA é replicado uma única vez antes do início da Meiose I.",
    ploidy: "2n",
    chromosomes: "4",
    chromatids: "4 → 8",
    dna: "2C → 4C",
    observeTitle: "A ploidia não muda na fase S",
    observeText: "Mesmo após a duplicação do DNA, a célula continua 2n = 4. O número de cromossomos não dobra; o que dobra é a quantidade de DNA e o número de cromátides.",
    progress: 10
  });

  await fade(replicationLabel, 0, 1, 500);
  await fade(chromatinCopies, 0, 1, 1200);
  await hold(800);
  await fade(replicationLabel, 1, 0, 450);
}

async function stage2ProphaseI() {
  updateStage({
    stage: 2,
    name: "Prófase I — sinapse e crossing-over",
    description: "Os cromossomos condensam, os homólogos se emparelham formando bivalentes (tétrades) e pode ocorrer crossing-over.",
    ploidy: "2n",
    chromosomes: "4",
    chromatids: "8",
    dna: "4C",
    observeTitle: "Crossing-over gera novas combinações",
    observeText: "A troca acontece entre cromátides não-irmãs de cromossomos homólogos. Os pontos de contato visíveis são chamados de quiasmas.",
    progress: 22
  });

  await Promise.all([
    fade(chromatinG1, 1, 0, 700),
    fade(chromatinCopies, 1, 0, 700),
    fade(nucleus, 1, 0.15, 900),
    ...chromosomes.map((c) => fade(c, 0, 1, 700)),
    fade(meiosisILabel, 0, 1, 550)
  ]);

  // sinapse: homólogos se aproximam
  await Promise.all([
    move(chrMLong, {x:445,y:265,r:-8}, {x:505,y:255,r:-10}, 1000),
    move(chrPLong, {x:635,y:265,r:8}, {x:575,y:255,r:10}, 1000),
    move(chrMShort, {x:445,y:400,r:5}, {x:505,y:405,r:-7}, 1000),
    move(chrPShort, {x:635,y:400,r:-5}, {x:575,y:405,r:7}, 1000)
  ]);

  await Promise.all([
    fade(chiasmaGlow, 0, 1, 400),
    fade(chiasmaMark, 0, 1, 400),
    fade(chiasmaLabel, 0, 1, 400)
  ]);

  colorCrossingOver();
  await hold(1000);

  await Promise.all([
    fade(chiasmaGlow, 1, 0, 420),
    fade(chiasmaMark, 1, 0, 420),
    fade(chiasmaLabel, 1, 0, 420),
    fade(nucleus, 0.15, 0, 420)
  ]);
}

async function stage3MetaphaseI() {
  updateStage({
    stage: 3,
    name: "Metáfase I",
    description: "Os bivalentes alinham-se no plano equatorial. A orientação de cada par é independente e, na célula real, é aleatória.",
    ploidy: "2n",
    chromosomes: "4",
    chromatids: "8",
    dna: "4C",
    observeTitle: "Aqui estão alinhados pares de homólogos",
    observeText: "Essa é uma diferença central em relação à Metáfase II. A orientação independente dos bivalentes também contribui para a variabilidade genética.",
    progress: 34
  });

  await Promise.all([
    fade(equatorI, 0, 1, 450),
    fade(spindleI, 0, 1, 650),
    move(chrMLong, {x:505,y:255,r:-10}, {x:505,y:250,r:0}, 850),
    move(chrPLong, {x:575,y:255,r:10}, {x:575,y:250,r:0}, 850),
    move(chrMShort, {x:505,y:405,r:-7}, {x:505,y:405,r:0}, 850),
    move(chrPShort, {x:575,y:405,r:7}, {x:575,y:405,r:0}, 850)
  ]);

  await hold(650);
}

async function stage4AnaphaseI() {
  updateStage({
    stage: 4,
    name: "Anáfase I",
    description: "Os cromossomos homólogos migram para polos opostos. As cromátides-irmãs permanecem unidas pelo centrômero.",
    ploidy: "n por polo",
    chromosomes: "2 por polo",
    chromatids: "4 por polo",
    dna: "2C por polo",
    observeTitle: "O X continua inteiro",
    observeText: "Na Anáfase I não há separação das cromátides-irmãs. Cada cromossomo duplicado inteiro vai para um polo.",
    progress: 46
  });

  await Promise.all([
    move(chrMLong, {x:505,y:250,r:0}, {x:275,y:255,r:-7}, 1450),
    move(chrPShort, {x:575,y:405,r:0}, {x:330,y:400,r:6}, 1450),
    move(chrPLong, {x:575,y:250,r:0}, {x:805,y:255,r:7}, 1450),
    move(chrMShort, {x:505,y:405,r:0}, {x:750,y:400,r:-6}, 1450)
  ]);

  await hold(450);
}

async function stage5TelophaseI() {
  updateStage({
    stage: 5,
    name: "Telófase I + citocinese",
    description: "A célula divide-se em duas. Cada célula é haploide, mas os cromossomos ainda estão duplicados.",
    ploidy: "n",
    chromosomes: "2",
    chromatids: "4",
    dna: "2C",
    observeTitle: "A Meiose I é reducional",
    observeText: "O número de conjuntos cromossômicos cai de 2n para n. Porém, as cromátides-irmãs continuam juntas.",
    progress: 57
  });

  await Promise.all([
    fade(equatorI, 1, 0, 400),
    fade(spindleI, 1, 0, 500),
    scaleFade(primaryCell, 1, 0.9, 1, 0, 700),
    scaleFade(cellLeft, .45, 1, 0, 1, 900),
    scaleFade(cellRight, .45, 1, 0, 1, 900)
  ]);

  await Promise.all([
    move(chrMLong, {x:275,y:255,r:-7}, {x:265,y:285,r:0}, 650),
    move(chrPShort, {x:330,y:400,r:6}, {x:335,y:380,r:0}, 650),
    move(chrPLong, {x:805,y:255,r:7}, {x:745,y:285,r:0}, 650),
    move(chrMShort, {x:750,y:400,r:-6}, {x:815,y:380,r:0}, 650)
  ]);

  await hold(500);
}

async function stage6Interkinesis() {
  updateStage({
    stage: 6,
    name: "Intercinese",
    description: "As duas células entram em uma breve transição antes da Meiose II. Não ocorre uma nova fase S.",
    ploidy: "n",
    chromosomes: "2",
    chromatids: "4",
    dna: "2C",
    observeTitle: "Não há nova replicação do DNA",
    observeText: "O DNA foi replicado apenas uma vez, antes da Meiose I. A Meiose II começa com cromossomos ainda duplicados.",
    progress: 64
  });

  await hold(1200);
}

async function stage7ProphaseII() {
  updateStage({
    stage: 7,
    name: "Prófase II",
    description: "Em cada célula, organiza-se um novo fuso para separar as cromátides-irmãs.",
    ploidy: "n",
    chromosomes: "2",
    chromatids: "4",
    dna: "2C",
    observeTitle: "Começa a segunda divisão",
    observeText: "A célula já é haploide. A Meiose II não reduz novamente a ploidia; ela separa as cromátides-irmãs.",
    progress: 72
  });

  await Promise.all([
    fade(meiosisILabel, 1, 0, 350),
    fade(meiosisIILabel, 0, 1, 450),
    fade(spindleII, 0, 1, 700)
  ]);

  await Promise.all([
    move(chrMLong, {x:265,y:285,r:0}, {x:270,y:320,r:0}, 750),
    move(chrPShort, {x:335,y:380,r:0}, {x:330,y:340,r:0}, 750),
    move(chrPLong, {x:745,y:285,r:0}, {x:750,y:320,r:0}, 750),
    move(chrMShort, {x:815,y:380,r:0}, {x:810,y:340,r:0}, 750)
  ]);
}

async function stage8MetaphaseII() {
  updateStage({
    stage: 8,
    name: "Metáfase II",
    description: "Os cromossomos alinham-se individualmente no equador de cada célula.",
    ploidy: "n",
    chromosomes: "2",
    chromatids: "4",
    dna: "2C",
    observeTitle: "Agora o alinhamento é individual",
    observeText: "Diferentemente da Metáfase I, os cromossomos homólogos não estão emparelhados.",
    progress: 81
  });

  await Promise.all([
    fade(equatorIILeft, 0, 1, 450),
    fade(equatorIIRight, 0, 1, 450)
  ]);

  await hold(950);
}

async function stage9AnaphaseII() {
  updateStage({
    stage: 9,
    name: "Anáfase II",
    description: "As cromátides-irmãs se separam no centrômero e migram para polos opostos.",
    ploidy: "n por polo",
    chromosomes: "2 por polo",
    chromatids: "2 por polo",
    dna: "1C por polo",
    observeTitle: "Cada cromátide passa a ser um cromossomo",
    observeText: "Depois da separação, cada cromátide-irmã é considerada um cromossomo independente.",
    progress: 91
  });

  await Promise.all([
    fade(equatorIILeft, 1, 0, 300),
    fade(equatorIIRight, 1, 0, 300),
    ...chromosomes.map((c) => fade(c, 1, 0, 350))
  ]);

  setOpacity(singleGroup, 1);

  const starts = [
    [270,320], [270,320], [750,320], [750,320],
    [330,340], [330,340], [810,340], [810,340]
  ];

  const ends = [
    [270,165], [270,495], [750,165], [750,495],
    [330,165], [330,495], [810,165], [810,495]
  ];

  singles.forEach((el, i) => {
    place(el, starts[i][0], starts[i][1], 0, 1);
    setOpacity(el, 1);
  });

  await Promise.all(
    singles.map((el, i) =>
      move(
        el,
        {x:starts[i][0], y:starts[i][1], r:0},
        {x:ends[i][0], y:ends[i][1], r:0},
        1450
      )
    )
  );

  await hold(350);
}

async function stage10TelophaseII() {
  updateStage({
    stage: 10,
    name: "Telófase II + citocinese",
    description: "As duas células se dividem novamente, formando quatro células haploides geneticamente diferentes.",
    ploidy: "n",
    chromosomes: "2",
    chromatids: "2",
    dna: "1C",
    observeTitle: "Resultado da meiose",
    observeText: "Uma única replicação do DNA foi seguida por duas divisões celulares. O crossing-over e a orientação independente aumentam a variabilidade genética.",
    progress: 100
  });

  await Promise.all([
    fade(spindleII, 1, 0, 450),
    fade(meiosisIILabel, 1, 0, 350),
    scaleFade(cellLeft, 1, .9, 1, 0, 700),
    scaleFade(cellRight, 1, .9, 1, 0, 700),
    ...finalCells.map((cell) => scaleFade(cell, .45, 1, 0, 1, 900))
  ]);

  await fade(finalLabel, 0, 1, 500);
  phaseTag.textContent = "PROCESSO CONCLUÍDO";
}

async function playSequence() {
  if (started) return;

  started = true;
  paused = false;
  playBtn.textContent = "⏸ Pausar";

  await stage1Interphase();
  await stage2ProphaseI();
  await stage3MetaphaseI();
  await stage4AnaphaseI();
  await stage5TelophaseI();
  await stage6Interkinesis();
  await stage7ProphaseII();
  await stage8MetaphaseII();
  await stage9AnaphaseII();
  await stage10TelophaseII();

  playBtn.textContent = "✓ Concluído";
  playBtn.disabled = true;
}

playBtn.addEventListener("click", () => {
  if (!started) {
    playSequence();
    return;
  }

  paused = !paused;

  activeAnimations.forEach((animation) => {
    if (paused) animation.pause();
    else animation.play();
  });

  playBtn.textContent = paused ? "▶ Continuar" : "⏸ Pausar";
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});
