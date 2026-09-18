const $ = (id) => document.getElementById(id);

const playBtn = $("playBtn");
const restartBtn = $("restartBtn");
const stageName = $("stageName");
const stageDescription = $("stageDescription");
const stageCounter = $("stageCounter");
const progressFill = $("progressFill");
const ploidyText = $("ploidyText");
const scienceNote = $("scienceNote");

const primaryCell = $("primaryCell");
const nucleus = $("nucleus");
const equatorI = $("equatorI");
const spindleI = $("spindleI");
const cellILeft = $("cellILeft");
const cellIRight = $("cellIRight");
const spindleII = $("spindleII");
const crossingHighlight = $("crossingHighlight");
const crossingText = $("crossingText");
const finalLabel = $("finalLabel");

const redLong = $("redLong");
const blueLong = $("blueLong");
const redShort = $("redShort");
const blueShort = $("blueShort");
const chromosomes = [redLong, blueLong, redShort, blueShort];

const finalCells = [$("final1"), $("final2"), $("final3"), $("final4")];
const chromatids = [
  $("c1"), $("c2"), $("c3"), $("c4"),
  $("c5"), $("c6"), $("c7"), $("c8")
];

let started = false;
let paused = false;
let activeAnimations = new Set();

function place(el, x, y, rotation = 0, scale = 1) {
  el.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(${scale})`;
}

place(redLong, 430, 260, -6);
place(blueLong, 570, 260, 6);
place(redShort, 430, 370, 4);
place(blueShort, 570, 370, -4);

function updateStage(number, name, description, progress, ploidy, note) {
  stageCounter.textContent = `Etapa ${number} de 10`;
  stageName.textContent = name;
  stageDescription.textContent = description;
  progressFill.style.width = `${progress}%`;
  ploidyText.textContent = ploidy;
  scienceNote.textContent = note;
}

function animate(el, keyframes, options = {}) {
  const animation = el.animate(keyframes, {
    duration: options.duration ?? 1200,
    easing: options.easing ?? "ease-in-out",
    fill: "forwards"
  });

  activeAnimations.add(animation);

  if (paused) animation.pause();

  return animation.finished
    .catch(() => {})
    .finally(() => activeAnimations.delete(animation));
}

function hold(duration = 800) {
  return animate(document.body, [{ opacity: 1 }, { opacity: 1 }], { duration });
}

function move(el, from, to, duration = 1200) {
  const start = `translate(${from.x}px, ${from.y}px) rotate(${from.r ?? 0}deg) scale(${from.s ?? 1})`;
  const end = `translate(${to.x}px, ${to.y}px) rotate(${to.r ?? 0}deg) scale(${to.s ?? 1})`;
  el.style.transform = end;

  return animate(el, [
    { transform: start },
    { transform: end }
  ], { duration });
}

function fade(el, from, to, duration = 700) {
  el.style.opacity = to;
  return animate(el, [{ opacity: from }, { opacity: to }], { duration });
}

async function intro() {
  updateStage(
    1,
    "Interfase pré-meiótica",
    "Antes da meiose, o DNA já foi duplicado. Cada cromossomo está formado por duas cromátides-irmãs.",
    8,
    "2n = 4",
    "A replicação do DNA acontece antes da Meiose I."
  );
  await fade(nucleus, 0.35, 1, 600);
  await hold(900);
}

async function prophaseI() {
  updateStage(
    2,
    "Prófase I",
    "Os cromossomos homólogos se aproximam e formam pares. Nesta fase pode ocorrer crossing-over.",
    20,
    "2n = 4",
    "O crossing-over troca segmentos entre cromátides não-irmãs de cromossomos homólogos."
  );

  await Promise.all([
    move(redLong, {x:430,y:260,r:-6}, {x:475,y:255,r:-10}, 1100),
    move(blueLong, {x:570,y:260,r:6}, {x:525,y:255,r:10}, 1100),
    move(redShort, {x:430,y:370,r:4}, {x:475,y:370,r:-8}, 1100),
    move(blueShort, {x:570,y:370,r:-4}, {x:525,y:370,r:8}, 1100),
    fade(nucleus, 1, 0, 900)
  ]);

  await Promise.all([
    fade(crossingHighlight, 0, 1, 500),
    fade(crossingText, 0, 1, 500)
  ]);

  // Troca visual de segmentos no par de cromossomos longos.
  $("redLongSwap").style.stroke = "var(--paternal)";
  $("blueLongSwap").style.stroke = "var(--maternal)";

  await hold(1000);

  await Promise.all([
    fade(crossingHighlight, 1, 0, 450),
    fade(crossingText, 1, 0, 450)
  ]);
}

async function metaphaseI() {
  updateStage(
    3,
    "Metáfase I",
    "Os pares de cromossomos homólogos alinham-se no plano equatorial da célula.",
    32,
    "2n = 4",
    "Na Metáfase I, os cromossomos homólogos ainda estão emparelhados."
  );

  await Promise.all([
    fade(equatorI, 0, 1, 500),
    fade(spindleI, 0, 1, 650),
    move(redLong, {x:475,y:255,r:-10}, {x:470,y:240,r:0}, 900),
    move(blueLong, {x:525,y:255,r:10}, {x:530,y:240,r:0}, 900),
    move(redShort, {x:475,y:370,r:-8}, {x:470,y:380,r:0}, 900),
    move(blueShort, {x:525,y:370,r:8}, {x:530,y:380,r:0}, 900)
  ]);

  await hold(600);
}

async function anaphaseI() {
  updateStage(
    4,
    "Anáfase I",
    "Os cromossomos homólogos se separam e migram para polos opostos. As cromátides-irmãs permanecem unidas.",
    44,
    "n = 2 por futuro núcleo",
    "Meiose I: separam-se os cromossomos homólogos, não as cromátides-irmãs."
  );

  await Promise.all([
    move(redLong, {x:470,y:240,r:0}, {x:265,y:245,r:-8}, 1500),
    move(blueShort, {x:530,y:380,r:0}, {x:305,y:375,r:5}, 1500),
    move(blueLong, {x:530,y:240,r:0}, {x:735,y:245,r:8}, 1500),
    move(redShort, {x:470,y:380,r:0}, {x:695,y:375,r:-5}, 1500)
  ]);

  await hold(500);
}

async function telophaseI() {
  updateStage(
    5,
    "Telófase I + Citocinese",
    "A célula se divide em duas. Cada célula é haploide, mas seus cromossomos ainda possuem duas cromátides.",
    55,
    "n = 2",
    "Após a Meiose I existem duas células haploides."
  );

  await Promise.all([
    fade(primaryCell, 1, 0, 750),
    fade(equatorI, 1, 0, 500),
    fade(spindleI, 1, 0, 500),
    fade(cellILeft, 0, 1, 900),
    fade(cellIRight, 0, 1, 900)
  ]);

  await Promise.all([
    move(redLong, {x:265,y:245,r:-8}, {x:250,y:270,r:0}, 700),
    move(blueShort, {x:305,y:375,r:5}, {x:310,y:350,r:0}, 700),
    move(blueLong, {x:735,y:245,r:8}, {x:690,y:270,r:0}, 700),
    move(redShort, {x:695,y:375,r:-5}, {x:750,y:350,r:0}, 700)
  ]);

  await hold(650);
}

async function interkinesis() {
  updateStage(
    6,
    "Entre Meiose I e Meiose II",
    "As duas células se preparam para a segunda divisão. Não ocorre uma nova replicação do DNA.",
    63,
    "n = 2",
    "Importante: não existe nova duplicação do DNA entre Meiose I e Meiose II."
  );

  await hold(1100);
}

async function prophaseII() {
  updateStage(
    7,
    "Prófase II",
    "Em cada célula, forma-se um novo fuso e os cromossomos voltam a se organizar para a segunda divisão.",
    70,
    "n = 2",
    "A Meiose II começa com duas células haploides."
  );

  await fade(spindleII, 0, 1, 700);

  await Promise.all([
    move(redLong, {x:250,y:270,r:0}, {x:250,y:310,r:0}, 800),
    move(blueShort, {x:310,y:350,r:0}, {x:310,y:310,r:0}, 800),
    move(blueLong, {x:690,y:270,r:0}, {x:690,y:310,r:0}, 800),
    move(redShort, {x:750,y:350,r:0}, {x:750,y:310,r:0}, 800)
  ]);
}

async function metaphaseII() {
  updateStage(
    8,
    "Metáfase II",
    "Os cromossomos se alinham individualmente no centro de cada uma das duas células.",
    78,
    "n = 2",
    "Na Metáfase II, os cromossomos não estão pareados com seus homólogos."
  );

  await hold(1100);
}

async function anaphaseII() {
  updateStage(
    9,
    "Anáfase II",
    "Os centrômeros se dividem e as cromátides-irmãs finalmente se separam, migrando para polos opostos.",
    89,
    "n = 2",
    "Meiose II: agora ocorre a separação das cromátides-irmãs."
  );

  // Esconde os cromossomos em X e revela cromátides individuais na mesma região.
  await Promise.all(chromosomes.map(c => fade(c, 1, 0, 350)));

  const starts = [
    [250,310], [250,310], [690,310], [690,310],
    [310,310], [310,310], [750,310], [750,310]
  ];
  const ends = [
    [250,165], [250,455], [690,165], [690,455],
    [310,165], [310,455], [750,165], [750,455]
  ];

  chromatids.forEach((c, i) => {
    place(c, starts[i][0], starts[i][1], 0, 1);
    c.style.opacity = 1;
  });

  await Promise.all(
    chromatids.map((c, i) =>
      move(
        c,
        {x: starts[i][0], y: starts[i][1], r:0},
        {x: ends[i][0], y: ends[i][1], r:0},
        1500
      )
    )
  );

  await hold(400);
}

async function telophaseII() {
  updateStage(
    10,
    "Telófase II + Citocinese",
    "As duas células se dividem novamente, formando quatro células haploides geneticamente diferentes.",
    100,
    "n = 2",
    "Resultado final: quatro células haploides, com metade do número cromossômico da célula original."
  );

  await Promise.all([
    fade(cellILeft, 1, 0, 700),
    fade(cellIRight, 1, 0, 700),
    fade(spindleII, 1, 0, 500),
    ...finalCells.map(c => fade(c, 0, 1, 900))
  ]);

  await fade(finalLabel, 0, 1, 600);
  stageCounter.textContent = "Processo concluído";
}

async function playMeiosis() {
  if (started) return;

  started = true;
  playBtn.textContent = "⏸ Pausar";

  await intro();
  await prophaseI();
  await metaphaseI();
  await anaphaseI();
  await telophaseI();
  await interkinesis();
  await prophaseII();
  await metaphaseII();
  await anaphaseII();
  await telophaseII();

  playBtn.textContent = "✓ Concluído";
  playBtn.disabled = true;
}

playBtn.addEventListener("click", () => {
  if (!started) {
    playMeiosis();
    return;
  }

  paused = !paused;

  activeAnimations.forEach(animation => {
    if (paused) animation.pause();
    else animation.play();
  });

  playBtn.textContent = paused ? "▶ Continuar" : "⏸ Pausar";
});

restartBtn.addEventListener("click", () => {
  window.location.reload();
});
