/* ====== WebAudio helpers ====== */
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// Exit sound (arcade)
function playArcadeExit() {
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'square';
  o.frequency.setValueAtTime(880, now);
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.16, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  o.connect(g).connect(audioCtx.destination);
  o.start(now); o.stop(now + 0.26);

  const o2 = audioCtx.createOscillator();
  o2.type = 'sawtooth';
  o2.frequency.setValueAtTime(1400, now);
  const g2 = audioCtx.createGain();
  g2.gain.setValueAtTime(0, now);
  g2.gain.linearRampToValueAtTime(0.08, now + 0.005);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  o2.connect(g2).connect(audioCtx.destination);
  o2.start(now); o2.stop(now + 0.18);
}

// Prize epic sound
function playPrizeEpic() {
  const now = audioCtx.currentTime;
  const bass = audioCtx.createOscillator();
  bass.type = 'sine';
  bass.frequency.setValueAtTime(220, now);
  const gb = audioCtx.createGain();
  gb.gain.setValueAtTime(0, now);
  gb.gain.linearRampToValueAtTime(0.22, now + 0.03);
  gb.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
  bass.connect(gb).connect(audioCtx.destination);
  bass.start(now); bass.stop(now + 1.3);

  const mid = audioCtx.createOscillator();
  mid.type = 'triangle';
  mid.frequency.setValueAtTime(660, now + 0.02);
  const gm = audioCtx.createGain();
  gm.gain.setValueAtTime(0, now);
  gm.gain.linearRampToValueAtTime(0.16, now + 0.06);
  gm.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
  mid.connect(gm).connect(audioCtx.destination);
  mid.start(now); mid.stop(now + 1.05);

  for(let i=0;i<4;i++){
    const bell = audioCtx.createOscillator();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(880 + i*120, now + 0.08 + i*0.06);
    const gbell = audioCtx.createGain();
    gbell.gain.setValueAtTime(0, now + 0.08 + i*0.06);
    gbell.gain.linearRampToValueAtTime(0.12, now + 0.12 + i*0.06);
    gbell.gain.exponentialRampToValueAtTime(0.0001, now + 0.8 + i*0.06);
    bell.connect(gbell).connect(audioCtx.destination);
    bell.start(now + 0.08 + i*0.06);
    bell.stop(now + 0.9 + i*0.06);
  }
}

// Loss sound (when captured or Erro Fatal)
function playLossSound() {
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(600, now);
  o.frequency.linearRampToValueAtTime(320, now + 0.22);
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.18, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  o.connect(g).connect(audioCtx.destination);
  o.start(now); o.stop(now + 0.45);
  const o2 = audioCtx.createOscillator();
  o2.type = 'square';
  o2.frequency.setValueAtTime(120, now + 0.05);
  const g2 = audioCtx.createGain();
  g2.gain.setValueAtTime(0, now + 0.05);
  g2.gain.linearRampToValueAtTime(0.08, now + 0.06);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  o2.connect(g2).connect(audioCtx.destination);
  o2.start(now + 0.05); o2.stop(now + 0.22);
}

// NEW: Alert sound for houses 09/19 (short beep)
function playAlertA() {
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(880, now);
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.12, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
  o.connect(g).connect(audioCtx.destination);
  o.start(now); o.stop(now + 0.28);
}

// NEW: Alert sound for house 16 (distinct, lower tone)
function playAlertB() {
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  o.type = 'triangle';
  o.frequency.setValueAtTime(440, now);
  const g = audioCtx.createGain();
  g.gain.setValueAtTime(0.001, now);
  g.gain.linearRampToValueAtTime(0.16, now + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
  o.connect(g).connect(audioCtx.destination);
  o.start(now); o.stop(now + 0.6);
}

/* ===== DOM refs ===== */
const boardCard = document.getElementById('boardCard');
const tokensLayer = document.getElementById('tokensLayer');
const confettiContainer = document.getElementById('confettiContainer');
const diceBox = document.getElementById('diceBox');
const rollBtn = document.getElementById('rollBtn');
const startBtn = document.getElementById('startBtn');
const numPlayersSel = document.getElementById('numPlayers');
const nameInputs = [document.getElementById('name1'), document.getElementById('name2'), document.getElementById('name3'), document.getElementById('name4')];
const playersListEl = document.getElementById('playersList');
const currentNameEl = document.getElementById('currentName');
const logEl = document.getElementById('log');
const routeStatusEl = document.getElementById('routeStatus');
const ruleDisplayEl = document.getElementById('ruleDisplay');
const explainTextEl = document.getElementById('explainText');
const deckCards = document.querySelectorAll('.deck-card');

const rankingModal = document.getElementById('rankingModal');
const rankingList = document.getElementById('rankingList');
const closeRankingBtn = document.getElementById('closeRankingBtn');
const restartBtn = document.getElementById('restartBtn');

rollBtn.disabled = true;

/* ===== State ===== */
let players = []; // {id,name,letter,state,elem,finishedOrder,skipTurns}
let currentIdx = 0;
let routeOccupied = [null,null,null,null];
let routeAssigned = [null,null,null,null]; // permanent assignment
let gameOver = false;
let immunity = {};
let lastDice = 0;
let finishOrder = [];

/* Helpers to select tiles/elements */
function tileByMain(n){ return document.querySelector(`.tile[data-main="${n}"]`); }
function routeCell(route,i){ return document.querySelector(`.tile[data-routecell="${route}-${i}"]`); }
function prizeCell(route){ return document.querySelector(`.tile[data-prize="${route}"]`); }
const crossingEl = document.getElementById('crossLabel');
const offEl = document.getElementById('casaOff');

/* ======= Card explanations data ======= */
const explanations = {
  'basic:1': {title:'01 – POST', text:'POST é a verificação realizada em toda estrutura física durante a inicialização do computador.'},
  'basic:2': {title:'02 – Placa-mãe', text:'Placa-mãe: placa principal que conecta os componentes (CPU, memória, periféricos).'},
  'basic:3': {title:'03 – CPU', text:'CPU: unidade de processamento central; é o “cérebro” do computador.'},
  'basic:4': {title:'04 – Memória Principal', text:'Memória principal (RAM): armazena temporariamente dados e instruções.'},
  'basic:5': {title:'05 – Passar a vez', text:'Seu Peão caiu na casa 05: na próxima rodada você perderá sua vez.'},
  'basic:6': {title:'06 – BOOT', text:'BOOT: processo de carregamento do sistema operacional.'},
  'basic:7': {title:'07 – Área de trabalho', text:'Área de trabalho (Desktop): espaço visual principal do sistema.'},
  'basic:8': {title:'08 – Barra de tarefas', text:'Barra de tarefas: atalhos e apps abertos.'},
  'basic:9': {title:'09 – Erro Fatal!', text:'Seu Peão caiu em uma casa perigosa e por isso voltou para a “Casa OFF”.'},
  'basic:10': {title:'10 – Área de transferência', text:'Área de transferência (Clipboard) para copiar/colar.'},
  'basic:11': {title:'11 – Gerenciador de Arquivos', text:'Ferramenta para organizar arquivos e pastas.'},
  'basic:12': {title:'12 – Painel de Controle', text:'Configurações do sistema.'},
  'basic:13': {title:'13 – Passar a vez', text:'Seu Peão caiu na casa 13: perderá a próxima rodada.'},
  'basic:14': {title:'14 – Janelas', text:'Janelas exibem conteúdo de aplicativos.'},
  'basic:15': {title:'15 – Gerenciador de Tarefas', text:'Gerenciador de processos e encerramento de apps.'},
  'basic:16': {title:'16 – PERIGO – MALWARE', text:'PERIGO (MALWARE): você ficará 2 rodadas sem participar do sorteio. Pergunta: O que é Malware?'},
  'basic:17': {title:'17 – Limpeza de Disco', text:'Remove arquivos temporários para liberar espaço.'},
  'basic:18': {title:'18 – Desfragmentador', text:'Reorganiza arquivos no disco (HDD) para melhorar desempenho.'},
  'basic:19': {title:'19 – Erro Fatal!', text:'Seu Peão caiu em uma casa perigosa e por isso voltou para a “Casa OFF”.'},
  'basic:20': {title:'20 – Periféricos', text:'Periféricos: dispositivos de entrada/saída, como teclado, mouse.'},

  'r1:1': {title:'R1-01 – Pharming', text:'Pharming: redirecionamento para sites falsos.'},
  'r1:2': {title:'R1-02 – Phishing', text:'Phishing: tentativa de obter dados por engano.'},
  'r1:3': {title:'R1-03 – Virus', text:'Vírus: software malicioso que se replica.'},
  'r1:4': {title:'R1-04 – Ransomware', text:'Ransomware: sequestra dados e exige resgate.'},
  'r1:5': {title:'R1-05 – Worms', text:'Worms: espalham-se automaticamente por redes.'},
  'r1:6': {title:'R1-06 – Firewall', text:'Firewall: controla tráfego de rede.'},
  'r1:7': {title:'R1-07 – Backup', text:'Backup: cópias de segurança de dados.'},
  'r1:8': {title:'R1-08 – Hash', text:'Hash: assinatura fixa usada para verificar integridade.'},
  'r1:9': {title:'R1-09 – Criptografia', text:'Criptografia protege informações codificando-as.'},
  'r1:10': {title:'R1-10 – Captcha', text:'Captcha: distingue humanos de bots.'},

  'r2:1': {title:'R2-01 – Navegadores', text:'Programas para acessar a internet.'},
  'r2:2': {title:'R2-02 – Site', text:'Conjunto de páginas web em um domínio.'},
  'r2:3': {title:'R2-03 – E-mail', text:'Sistema de mensagens eletrônicas.'},
  'r2:4': {title:'R2-04 – WWW', text:'World Wide Web — rede de páginas via HTTP.'},
  'r2:5': {title:'R2-05 – FTP', text:'Protocolo de transferência de arquivos.'},
  'r2:6': {title:'R2-06 – Pop-up', text:'Janela extra no navegador.'},
  'r2:7': {title:'R2-07 – Motor de busca', text:'Serviços que indexam páginas (Google).'},
  'r2:8': {title:'R2-08 – URL', text:'Endereço que localiza recursos na web.'},
  'r2:9': {title:'R2-09 – Streaming', text:'Transmissão contínua de áudio/vídeo.'},
  'r2:10': {title:'R2-10 – Navegação Anônima', text:'Modo que não salva histórico local.'},

  'r3:1': {title:'R3-01 – Ambientes de Redes', text:'Contextos onde equipamentos se conectam.'},
  'r3:2': {title:'R3-02 – Arquitetura de Redes', text:'Organização de camadas e componentes.'},
  'r3:3': {title:'R3-03 – Switch', text:'Dispositivo que conecta dispositivos em LAN.'},
  'r3:4': {title:'R3-04 – ISP', text:'Provedor de acesso à internet.'},
  'r3:5': {title:'R3-05 – Wireless', text:'Tecnologias sem fio (Wi-Fi).'},
  'r3:6': {title:'R3-06 – PAN/LAN', text:'Redes pessoais e locais.'},
  'r3:7': {title:'R3-07 – MAN/WAN', text:'Redes metropolitanas e de longa distância.'},
  'r3:8': {title:'R3-08 – IP', text:'Protocolo que endereça pacotes.'},
  'r3:9': {title:'R3-09 – MAC', text:'Endereço físico de uma interface de rede.'},
  'r3:10': {title:'R3-10 – DNS', text:'Traduz domínios em endereços IP.'},

  'r4:1': {title:'R4-01 – Editor de texto', text:'Programas para editar documentos.'},
  'r4:2': {title:'R4-02 – Revisão Ortográfica', text:'Identifica e corrige erros ortográficos.'},
  'r4:3': {title:'R4-03 – Formatação', text:'Aplicar estilos a textos.'},
  'r4:4': {title:'R4-04 – Apresentação', text:'Criar slides para apresentações.'},
  'r4:5': {title:'R4-05 – PDF', text:'Formato de documento portátil.'},
  'r4:6': {title:'R4-06 – Planilha', text:'Ferramenta para cálculos e tabelas.'},
  'r4:7': {title:'R4-07 – Fórmulas', text:'Automatizam cálculos em planilhas.'},
  'r4:8': {title:'R4-08 – Gráficos', text:'Representações visuais de dados.'},
  'r4:9': {title:'R4-09 – Formatação Condicional', text:'Destaques com regras visuais.'},
  'r4:10': {title:'R4-10 – Filtros', text:'Filtrar e classificar dados em tabelas.'}
};

/* ===== Visual / UI helpers ===== */
function logMsg(msg){
  const time = new Date().toLocaleTimeString();
  const d = document.createElement('div');
  d.textContent = `[${time}] ${msg}`;
  logEl.prepend(d);
}

function updateRuleDisplay(msg){
  ruleDisplayEl.textContent = msg || "Nenhuma regra ativa";
}

function updateRouteStatus(){
  const parts = routeAssigned.map((v,i) => {
    if(v) return `R${i+1}: tomada por J${v}`;
    if(routeOccupied[i]) return `R${i+1}: ocupada (J${routeOccupied[i]})`;
    return `R${i+1}: livre`;
  });
  routeStatusEl.textContent = parts.join(' • ');
}

/* ===== Token creation & emblem ===== */
function createEmblemForStage(stage){
  const e = document.createElement('div');
  e.className = 'emblem';
  if(stage === 'active'){ e.classList.add('spark'); e.textContent = '⋆'; }
  else if(stage === 'cross'){ e.classList.add('shield'); e.textContent = '🛡'; }
  else if(stage === 'prize'){ e.classList.add('crown'); e.textContent = '♛'; }
  return e;
}

function createPlayerElement(label, pid){
  const div = document.createElement('div');
  div.className = 'token';
  div.setAttribute('data-player', pid);
  div.setAttribute('title', `Jogador ${label}`);
  div.innerHTML = `<span class="letter">${label}</span>`;
  const em = document.createElement('div');
  em.className = 'emblem';
  em.style.display = 'none';
  div.appendChild(em);
  div.tabIndex = 0;
  tokensLayer.appendChild(div);
  return div;
}

function updateEmblemForPlayer(pl){
  if(!pl.elem) return;
  let em = pl.elem.querySelector('.emblem');
  em.innerHTML = '';
  em.style.display = 'none';
  if(pl.state.type === 'off') return;
  if(pl.state.type === 'main'){
    const newe = createEmblemForStage('active');
    em.replaceWith(newe);
    pl.elem.querySelector('.emblem').style.display = 'flex';
  } else if(pl.state.type === 'crossing' || pl.state.type === 'route'){
    const newe = createEmblemForStage('cross');
    em.replaceWith(newe);
    pl.elem.querySelector('.emblem').style.display = 'flex';
  } else if(pl.state.type === 'prize'){
    const newe = createEmblemForStage('prize');
    em.replaceWith(newe);
    pl.elem.querySelector('.emblem').style.display = 'flex';
  }
}

/* Off offsets to keep tokens visible */
const offOffsets = [
  {x:-26,y:-20},
  {x:26,y:-20},
  {x:-26,y:20},
  {x:26,y:20}
];
const tileSharedOffsets = [
  {x:-12,y:-8},{x:12,y:-8},{x:-12,y:8},{x:12,y:8}
];

function placeTokenOnElement(tokenEl, tileEl, offsetIdx=null){
  if(!tileEl) return;
  const boardRect = boardCard.getBoundingClientRect();
  const tRect = tileEl.getBoundingClientRect();
  const cx = tRect.left - boardRect.left + tRect.width/2;
  const cy = tRect.top - boardRect.top + tRect.height/2;
  let offX = 0, offY = 0;
  if(tileEl === offEl){
    if(offsetIdx !== null && offOffsets[offsetIdx]){ offX = offOffsets[offsetIdx].x; offY = offOffsets[offsetIdx].y; }
  } else {
    if(offsetIdx !== null && tileSharedOffsets[offsetIdx]){ offX = tileSharedOffsets[offsetIdx].x; offY = tileSharedOffsets[offsetIdx].y; }
  }
  tokenEl.style.left = `${cx + offX}px`;
  tokenEl.style.top = `${cy + offY}px`;
}

function positionKey(state){
  if(!state) return 'off';
  if(state.type === 'off') return 'off';
  if(state.type === 'crossing') return 'crossing';
  if(state.type === 'main') return `main:${state.index}`;
  if(state.type === 'route') return `route:${state.route}:${state.index}`;
  if(state.type === 'prize') return `prize:${state.route}`;
  return '';
}

function placeTokenByState(tokenEl, state, plId){
  // compute occupants to choose offset index
  let occupants = [];
  players.forEach(p=>{
    if(!p.elem) return;
    const key = positionKey(p.state);
    if(state.type === 'off' && key === 'off') occupants.push(p.id);
    else if(state.type === 'main' && p.state.type === 'main' && p.state.index === state.index) occupants.push(p.id);
    else if(state.type === 'crossing' && p.state.type === 'crossing') occupants.push(p.id);
    else if(state.type === 'route' && p.state.type === 'route' && p.state.route === state.route && p.state.index === state.index) occupants.push(p.id);
    else if(state.type === 'prize' && p.state.type === 'prize' && p.state.route === state.route) occupants.push(p.id);
  });
  occupants.sort();
  let offsetIdx = occupants.indexOf(plId);
  if(offsetIdx < 0) offsetIdx = 0;
  if(state.type === 'off') placeTokenOnElement(tokenEl, offEl, plId-1);
  else if(state.type === 'main') placeTokenOnElement(tokenEl, tileByMain(state.index+1), offsetIdx);
  else if(state.type === 'crossing') placeTokenOnElement(tokenEl, crossingEl, offsetIdx);
  else if(state.type === 'route') {
    if(state.index >= 10) placeTokenOnElement(tokenEl, prizeCell(state.route), offsetIdx);
    else placeTokenOnElement(tokenEl, routeCell(state.route, state.index+1), offsetIdx);
  } else if(state.type === 'prize') {
    placeTokenOnElement(tokenEl, prizeCell(state.route), offsetIdx);
  }
}

/* Jump animation: add class then remove */
function applyJump(plElem){
  if(!plElem) return;
  plElem.classList.remove('jump');
  void plElem.offsetWidth;
  plElem.classList.add('jump');
  setTimeout(()=> plElem.classList.remove('jump'), 300);
}

/* Confetti generation on prize */
function showConfetti(){
  confettiContainer.innerHTML = '';
  const colors = ['#f59e0b','#f97316','#34d399','#60a5fa','#f43f5e'];
  const count = 28;
  for(let i=0;i<count;i++){
    const piece = document.createElement('div');
    piece.className = 'piece';
    const left = 80 + Math.random()*(boardCard.clientWidth-160);
    piece.style.left = left + 'px';
    piece.style.top = (20 + Math.random()*40) + 'px';
    piece.style.background = colors[Math.floor(Math.random()*colors.length)];
    piece.style.transform = `rotate(${Math.random()*360}deg)`;
    piece.style.animationDuration = (1.2 + Math.random()*0.8) + 's';
    confettiContainer.appendChild(piece);
  }
  confettiContainer.style.opacity = 1;
  setTimeout(()=> confettiContainer.innerHTML = '', 1600);
}

/* animate token along path (DOM elements) with jump on each step */
function animateTokenTo(pl, pathTiles, onComplete){
  if(!pl.elem){ if(onComplete) onComplete(); return; }
  let i = 0;
  function next(){
    if(i >= pathTiles.length){ if(onComplete) onComplete(); return; }
    const tileEl = pathTiles[i];
    placeTokenOnElement(pl.elem, tileEl);
    applyJump(pl.elem);
    i++;
    setTimeout(next, 260);
  }
  next();
}

/* Build simple path of tiles */
function buildPathForMove(pl, targetState){
  const path = [];
  if(pl.state.type === 'off' && targetState.type === 'main'){
    path.push(offEl); path.push(tileByMain(1)); return path;
  }
  if(pl.state.type === 'main' && targetState.type === 'main'){
    const from = pl.state.index; const to = targetState.index;
    for(let k=from+1;k<=to;k++) path.push(tileByMain(k+1));
    return path;
  }
  if(pl.state.type === 'main' && targetState.type === 'crossing'){
    const from = pl.state.index;
    for(let k=from+1;k<=19;k++) path.push(tileByMain(k+1));
    path.push(crossingEl);
    return path;
  }
  if(pl.state.type === 'crossing' && targetState.type === 'route'){
    path.push(crossingEl); path.push(routeCell(targetState.route,1)); return path;
  }
  if(pl.state.type === 'route' && targetState.type === 'route'){
    const route = pl.state.route; const from = pl.state.index; const to = targetState.index;
    for(let k=from+1;k<=to;k++) path.push(routeCell(route,k+1));
    return path;
  }
  if(targetState.type === 'prize'){
    if(pl.state.type === 'route'){
      const route = pl.state.route;
      for(let k = pl.state.index+1; k<=10; k++){
        path.push(routeCell(route, Math.min(k,10)));
      }
      path.push(prizeCell(pl.state.route));
    }
    return path;
  }
  if(targetState.type === 'main') path.push(tileByMain(targetState.index+1));
  else if(targetState.type === 'crossing') path.push(crossingEl);
  else if(targetState.type === 'route') path.push(routeCell(targetState.route, targetState.index+1));
  else if(targetState.type === 'prize') path.push(prizeCell(targetState.route));
  return path;
}

/* ===== Deck highlight & badge helpers ===== */
function clearDeckHighlights(){
  deckCards.forEach(dc => {
    dc.classList.remove('highlight');
    const badge = dc.querySelector('.deck-badge');
    if(badge) badge.remove();
  });
}
function highlightDeck(deckKey, explanationKey){
  clearDeckHighlights();
  const el = document.querySelector(`.deck-card[data-deck="${deckKey}"]`);
  if(el) el.classList.add('highlight');
  if(explanationKey){
    const obj = explanations[explanationKey];
    if(obj && el){
      const badge = document.createElement('div');
      badge.className = 'deck-badge';
      // show both deck name and card title (e.g., "Trilha Básica — 01 – POST")
      badge.textContent = `${obj.title}`;
      el.appendChild(badge);
    }
  }
}

/* ===== Card explanation update ===== */
function updateCardExplanationFromState(state){
  if(!state){ explainTextEl.textContent = 'Passe o peão em uma casa para ver a explicação da carta correspondente.'; clearDeckHighlights(); return; }
  if(state.type === 'main'){
    const idx = state.index + 1;
    const key = `basic:${idx}`;
    const obj = explanations[key];
    highlightDeck('basic', key);
    explainTextEl.textContent = (obj ? (obj.title + ' — ' + obj.text) : `Casa ${idx}: explicação não disponível.`);
    const tile = tileByMain(idx);
    if(tile){ tile.classList.add('highlight'); setTimeout(()=> tile.classList.remove('highlight'), 900); }
  } else if(state.type === 'crossing'){
    clearDeckHighlights();
    explainTextEl.textContent = 'CRUZAMENTO: role 1..4 para tentar entrar em uma rota. Se a rota já estiver tomada, você perde a vez.';
  } else if(state.type === 'route'){
    const deckKey = `r${state.route}`;
    const idx = state.index + 1;
    const key = `${deckKey}:${idx}`;
    const obj = explanations[key];
    highlightDeck(deckKey, key);
    explainTextEl.textContent = (obj ? (obj.title + ' — ' + obj.text) : `Rota ${state.route} — Casa ${idx}: explicação não disponível.`);
    const tile = routeCell(state.route, idx);
    if(tile){ tile.classList.add('highlight'); setTimeout(()=> tile.classList.remove('highlight'), 900); }
  } else if(state.type === 'prize'){
    highlightDeck(`r${state.route}`, `r${state.route}:10`);
    explainTextEl.textContent = `Casa PRÊMIO da ROTA ${state.route}: Parabéns! Você chegou ao prêmio da rota.`;
    const tile = prizeCell(state.route);
    if(tile){ tile.classList.add('highlight'); setTimeout(()=> tile.classList.remove('highlight'), 900); }
  }
}

/* ===== Game logic (adapted with new rules & sounds) ===== */
function resolveCaptures(pl){
  const key = positionKey(pl.state);
  players.forEach(target=>{
    if(target.id === pl.id) return;
    if(positionKey(target.state) === key){
      if(immunity[target.id] && immunity[target.id] > 0){
        logMsg(`${pl.name} encontrou ${target.name} mas ${target.name} está imune — sem captura.`);
        updateRuleDisplay(`${target.name} estava imune — captura negada.`);
      } else {
        if(audioCtx.state === 'suspended') audioCtx.resume();
        playLossSound();
        logMsg(`${pl.name} capturou ${target.name}! ${target.name} volta para CASA OFF.`);
        updateRuleDisplay(`${pl.name} capturou ${target.name} — enviado para CASA OFF.`);
        if(target.state.type === 'route'){
          const r = target.state.route - 1;
          if(routeOccupied[r] === target.id) routeOccupied[r] = null;
        }
        target.state = { type: 'off' };
        target.finishedOrder = null;
        target.skipTurns = 0;
        updateEmblemForPlayer(target);
        placeTokenByState(target.elem, target.state, target.id);
      }
    }
  });
  updateRouteStatus();
}

function computeMoveToMilestone(currentIndex, milestoneIndex, dado){
  const distance = (milestoneIndex + 1) - currentIndex;
  if(dado === distance) return 'TARGET';
  if(dado < distance) return currentIndex + dado;
  return null;
}

function checkFinishCondition(){
  if(finishOrder.length >= 3 && !gameOver){
    gameOver = true;
    buildAndShowFinalRanking();
  }
}

function buildAndShowFinalRanking(){
  const ordered = finishOrder.slice();
  const remaining = players.filter(p => !ordered.includes(p.letter)).slice();
  remaining.sort((a,b)=> computeProgress(b) - computeProgress(a));
  remaining.forEach(p => ordered.push(p.letter));
  rankingList.innerHTML = '';
  ordered.forEach((letter, idx)=>{
    const obj = players.find(x=>x.letter===letter);
    const li = document.createElement('li');
    li.textContent = `${idx+1}º — ${obj ? obj.name : letter}`;
    rankingList.appendChild(li);
  });
  rankingModal.style.display = 'flex';
}

function computeProgress(pl){
  if(pl.state.type === 'prize') return 100000 + (pl.finishedOrder || 0);
  if(pl.state.type === 'route') return 5000 + pl.state.route*100 + (pl.state.index || 0);
  if(pl.state.type === 'crossing') return 3000;
  if(pl.state.type === 'main') return 1000 + (pl.state.index || 0);
  return 0;
}

function passTurn(){
  if(gameOver) return;
  let next = (currentIdx + 1) % players.length;
  let attempts = 0;
  while(attempts < players.length){
    const candidate = players[next];
    if(candidate.state.type === 'prize'){ next = (next + 1) % players.length; attempts++; continue; }
    if(candidate.skipTurns && candidate.skipTurns > 0){
      candidate.skipTurns = Math.max(0, candidate.skipTurns - 1);
      logMsg(`${candidate.name} está impedido de jogar (skip). Restam ${candidate.skipTurns} turnos de bloqueio.`);
      updateRuleDisplay(`${candidate.name} perdeu a vez (skip).`);
      next = (next + 1) % players.length; attempts++; continue;
    }
    break;
  }
  currentIdx = next;
  updateCurrentName();
  renderPlayersList();
}

function renderPlayersList(){
  playersListEl.innerHTML = '';
  players.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'player-row' + (p.state.type === 'prize' ? ' prize' : '');
    row.style.border = (currentIdx===idx && !gameOver) ? '2px solid #e6f0ff' : '1px solid #eef2ff';
    const dot = document.createElement('div'); dot.className='dot';
    dot.textContent = (p.name && p.name.length>0) ? p.name[0].toUpperCase() : p.letter;
    row.appendChild(dot);
    const text = document.createElement('div');
    let desc = describeState(p.state);
    if(immunity[p.id] && immunity[p.id] > 0){
      desc += ` • 🛡 Imune: ${immunity[p.id]} turn(s)`;
    }
    if(p.skipTurns && p.skipTurns > 0) desc += ` • ❌ Bloqueado: ${p.skipTurns} turn(s)`;
    let crown = '';
    if(p.state.type === 'prize') crown = `<span class="crown-inline">♛</span>`;
    text.innerHTML = `<div style="font-weight:800">${p.name || p.letter} ${crown}</div><div style="font-size:13px;color:#334155">${desc}</div>`;
    row.appendChild(text);
    playersListEl.appendChild(row);
  });
  updateCurrentName();
}

function describeState(s){
  if(!s) return 'Casa OFF';
  if(s.type==='off') return 'Casa OFF';
  if(s.type==='main') return `Caminho ${s.index+1}/20`;
  if(s.type==='crossing') return 'No CRUZAMENTO';
  if(s.type==='route') return `Rota ${s.route} — casa ${Math.min(s.index+1,10)}/10`;
  if(s.type==='prize') return `Casa PRÊMIO — Rota ${s.route}`;
  return '';
}

function updateCurrentName(){
  if(gameOver){ currentNameEl.textContent = '—'; return; }
  const pl = players[currentIdx];
  currentNameEl.textContent = pl ? (pl.name || pl.letter) : '—';
}

/* Render tokens */
function renderPlayers(){
  players.forEach(pl=>{
    if(!pl.elem){
      const label = (pl.name && pl.name.length > 0) ? pl.name[0].toUpperCase() : pl.letter;
      pl.elem = createPlayerElement(label, pl.id);
      pl.elem.addEventListener('click', ()=> {
        pl.elem.style.boxShadow = '0 8px 18px rgba(0,0,0,0.2)';
        setTimeout(()=> pl.elem.style.boxShadow = '', 600);
      });
    }
    updateEmblemForPlayer(pl);
    placeTokenByState(pl.elem, pl.state, pl.id);
  });
}

/* move with animation, update state at end */
function movePlayerWithAnimation(pl, targetState, callback){
  const pathTiles = buildPathForMove(pl, targetState);
  if(pathTiles.length === 0){
    pl.state = JSON.parse(JSON.stringify(targetState));
    updateEmblemForPlayer(pl);
    placeTokenByState(pl.elem, pl.state, pl.id);
    updateCardExplanationFromState(pl.state);
    if(callback) callback();
    return;
  }
  animateTokenTo(pl, pathTiles, ()=> {
    pl.state = JSON.parse(JSON.stringify(targetState));
    updateEmblemForPlayer(pl);
    placeTokenByState(pl.elem, pl.state, pl.id);
    updateCardExplanationFromState(pl.state);
    if(callback) callback();
  });
}

/* ===== Main roll handler (with new houses logic & icons + sounds) ===== */
function handleRoll(){
  if(gameOver) return;
  const pl = players[currentIdx];
  if(pl.state.type === 'prize'){ passTurn(); renderPlayersList(); return; }
  let dado = (pl.state.type === 'crossing') ? Math.floor(Math.random()*4)+1 : Math.floor(Math.random()*6)+1;
  lastDice = dado;
  diceBox.textContent = dado;
  logMsg(`${pl.name} rolou ${dado}.`);
  updateRuleDisplay('');

  // OFF -> exit on 1
  if(pl.state.type === 'off'){
    if(dado === 1){
      const target = { type:'main', index:0 };
      if(audioCtx.state === 'suspended') audioCtx.resume();
      playArcadeExit();
      if(!pl.elem) renderPlayers();
      pl.elem && pl.elem.classList.add('prize-anim');
      setTimeout(()=> pl.elem && pl.elem.classList.remove('prize-anim'), 360);
      movePlayerWithAnimation(pl, target, ()=> {
        logMsg(`${pl.name} saiu da CASA OFF para a casa 1.`);
        updateCardExplanationFromState(pl.state);
        resolveCaptures(pl);
        updateEmblemForPlayer(pl);
        postMoveCleanup(pl);
      });
      return;
    } else {
      logMsg(`${pl.name} permanece na CASA OFF (sai somente com 1).`);
      updateRuleDisplay(`${pl.name} precisa tirar 1 para sair.`);
      passTurn(); renderPlayersList(); return;
    }
  }

  // MAIN path
  if(pl.state.type === 'main'){
    const idx = pl.state.index;
    const res = computeMoveToMilestone(idx, 19, dado);
    if(res === 'TARGET'){
      const target = { type:'crossing' };
      movePlayerWithAnimation(pl, target, ()=> {
        logMsg(`${pl.name} entrou no CRUZAMENTO (saiu da casa ${idx+1}).`);
        resolveCaptures(pl);
        postMoveCleanup(pl);
      });
      return;
    } else if(res === null){
      logMsg(`${pl.name} rolou ${dado} e isso ultrapassa o CRUZAMENTO. Perde a vez.`);
      updateRuleDisplay(`${pl.name} ultrapassou o CRUZAMENTO — perde a vez.`);
      passTurn(); renderPlayersList(); return;
    } else {
      const target = { type:'main', index: res };
      movePlayerWithAnimation(pl, target, ()=> {
        logMsg(`${pl.name} avançou para a casa ${pl.state.index+1}.`);
        // special houses 4 and 12 (index 3 and 11)
        if(pl.state.index === 3 || pl.state.index === 11){
          if(dado % 2 === 0){
            pl.state.index = Math.min(pl.state.index + 3, 19);
            logMsg(`${pl.name} casa especial (PAR) -> avança +3 para ${pl.state.index+1}.`);
            updateRuleDisplay(`${pl.name}: casa especial (PAR) → avançou +3 casas.`);
            placeTokenByState(pl.elem, {type:'main', index:pl.state.index}, pl.id);
          } else {
            pl.state.index = Math.max(pl.state.index - 3, 0);
            logMsg(`${pl.name} casa especial (ÍMPAR) -> recua -3 para ${pl.state.index+1}.`);
            updateRuleDisplay(`${pl.name}: casa especial (ÍMPAR) → recuou -3 casas.`);
            placeTokenByState(pl.elem, {type:'main', index:pl.state.index}, pl.id);
          }
        }

        // house 5 index 4 => pass next turn
        if(pl.state.index === 4){
          pl.skipTurns = (pl.skipTurns || 0) + 1;
          logMsg(`${pl.name} caiu na casa 05 → perderá 1 rodada.`);
          updateRuleDisplay(`${pl.name} perderá 1 rodada (casa 05).`);
        }

        // house 9 index 8 => Erro Fatal => back to OFF (play alert)
        if(pl.state.index === 8){
          if(audioCtx.state === 'suspended') audioCtx.resume();
          playAlertA(); // alert sound for 9/19
          playLossSound();
          logMsg(`${pl.name} caiu na casa 09 (Erro Fatal!) e volta para CASA OFF.`);
          updateRuleDisplay(`${pl.name} ERRO FATAL — voltou à Casa OFF.`);
          pl.state = { type:'off' };
          pl.skipTurns = 0;
          placeTokenByState(pl.elem, pl.state, pl.id);
          resolveCaptures(pl);
          postMoveCleanup(pl);
          return;
        }

        // house 13 index 12 => pass next turn
        if(pl.state.index === 12){
          pl.skipTurns = (pl.skipTurns || 0) + 1;
          logMsg(`${pl.name} caiu na casa 13 → perderá 1 rodada.`);
          updateRuleDisplay(`${pl.name} perderá 1 rodada (casa 13).`);
        }

        // house 16 index 15 => Malware: lose 2 rounds + ask question (alert sound)
        if(pl.state.index === 15){
          if(audioCtx.state === 'suspended') audioCtx.resume();
          playAlertB();
          pl.skipTurns = (pl.skipTurns || 0) + 2;
          const answer = prompt(`${pl.name} — PERIGO: MALWARE!\nFique 2 rodadas sem participar.\nPergunta: O que é Malware?`);
          logMsg(`${pl.name} caiu na casa 16 (MALWARE). Resposta: ${answer ? answer : '(sem resposta)'}`);
          updateRuleDisplay(`${pl.name}: MALWARE — bloqueado por 2 rodadas.`);
        }

        // house 19 index 18 => Erro Fatal -> back to OFF
        if(pl.state.index === 18){
          if(audioCtx.state === 'suspended') audioCtx.resume();
          playAlertA();
          playLossSound();
          logMsg(`${pl.name} caiu na casa 19 (Erro Fatal!) e volta para CASA OFF.`);
          updateRuleDisplay(`${pl.name} ERRO FATAL — voltou à Casa OFF.`);
          pl.state = { type:'off' };
          pl.skipTurns = 0;
          placeTokenByState(pl.elem, pl.state, pl.id);
          resolveCaptures(pl);
          postMoveCleanup(pl);
          return;
        }

        resolveCaptures(pl);
        postMoveCleanup(pl);
      });
      return;
    }
  }

  // CROSSING
  if(pl.state.type === 'crossing'){
    const routeNum = dado; // 1..4
    if(routeAssigned[routeNum-1] && routeAssigned[routeNum-1] !== pl.id){
      logMsg(`${pl.name} tirou ${dado}, mas a ROTA ${routeNum} já foi tomada. Perde a vez.`);
      updateRuleDisplay(`R${routeNum} já tomada — próxima vez.`);
      passTurn(); renderPlayersList(); return;
    }
    if(routeOccupied[routeNum-1] === null && (!routeAssigned[routeNum-1] || routeAssigned[routeNum-1] === pl.id)){
      if(!routeAssigned[routeNum-1]) routeAssigned[routeNum-1] = pl.id;
      routeOccupied[routeNum-1] = pl.id;
      const target = { type:'route', route: routeNum, index: 0 };
      movePlayerWithAnimation(pl, target, ()=> {
        logMsg(`${pl.name} escolheu a ROTA ${routeNum} e entrou na casa 1 da rota.`);
        updateRouteStatus();
        resolveCaptures(pl);
        postMoveCleanup(pl);
      });
      return;
    } else {
      logMsg(`${pl.name} tirou ${dado}, mas a ROTA ${routeNum} está ocupada ou tomada. Perde a vez.`);
      updateRuleDisplay(`${pl.name} tentou entrar na R${routeNum} mas não está disponível.`);
      passTurn(); renderPlayersList(); return;
    }
  }

  // ROUTE
  if(pl.state.type === 'route'){
    const r = pl.state.route - 1;
    const idx = pl.state.index;
    const res = computeMoveToMilestone(idx, 9, dado);
    if(res === 'TARGET'){
      const target = { type:'prize', route: r+1 };
      movePlayerWithAnimation(pl, target, ()=> {
        logMsg(`${pl.name} entrou na CASA PRÊMIO da ROTA ${r+1}!`);
        routeOccupied[r] = null;
        updateRouteStatus();
        if(audioCtx.state === 'suspended') audioCtx.resume();
        playPrizeEpic();
        showConfetti();
        if(!finishOrder.includes(pl.letter)) finishOrder.push(pl.letter);
        pl.finishedOrder = finishOrder.length;
        pl.state = { type:'prize', route: r+1 };
        updateEmblemForPlayer(pl);
        renderPlayersList();
        resolveCaptures(pl);
        checkFinishCondition();
        postMoveCleanup(pl);
      });
      return;
    } else if(res === null){
      logMsg(`${pl.name} rolou ${dado} e isso ultrapassa a PRÊMIO. Perde a vez.`);
      passTurn(); renderPlayersList(); return;
    } else {
      const target = { type:'route', route: pl.state.route, index: res };
      movePlayerWithAnimation(pl, target, ()=> {
        logMsg(`${pl.name} avançou para a casa ${pl.state.index+1} da ROTA ${pl.state.route}.`);
        updateCardExplanationFromState(pl.state);
        resolveCaptures(pl);
        postMoveCleanup(pl);
      });
      return;
    }
  }

  // PRIZE
  if(pl.state.type === 'prize'){
    logMsg(`${pl.name} já está na casa prêmio.`);
    passTurn(); renderPlayersList(); return;
  }
}

/* cleanup after move */
function postMoveCleanup(pl){
  if(immunity[pl.id] && immunity[pl.id] > 0){
    immunity[pl.id] = Math.max(0, immunity[pl.id] - 1);
    if(immunity[pl.id] === 0){
      logMsg(`${pl.name} perdeu a imunidade.`);
      updateRuleDisplay(`${pl.name} não está mais imune.`);
    }
  }
  renderPlayersList();
  passTurn();
}

/* Initialization and UI events */
function resetGame(){
  tokensLayer.innerHTML = '';
  confettiContainer.innerHTML = '';
  players = []; routeOccupied = [null,null,null,null]; routeAssigned = [null,null,null,null];
  currentIdx = 0; gameOver = false; immunity = {}; lastDice = 0; finishOrder = [];
  diceBox.textContent = '—'; rollBtn.disabled = true; currentNameEl.textContent = '—';
  playersListEl.innerHTML = ''; logEl.innerHTML = '<div>Logs do jogo</div>';
  updateRuleDisplay(); updateRouteStatus(); updateCardExplanationFromState(null);
}

function createPlayers(n){
  players = [];
  const defaultLetters = ['A','B','C','D'];
  for(let i=0;i<n;i++){
    const raw = (nameInputs[i].value && nameInputs[i].value.trim().length>0) ? nameInputs[i].value.trim() : defaultLetters[i];
    const nameVal = raw;
    players.push({
      id: i+1,
      name: nameVal,
      letter: defaultLetters[i],
      state: { type:'off' },
      elem: null,
      finishedOrder: null,
      skipTurns: 0
    });
    immunity[i+1] = 0;
  }
  renderPlayers();
  renderPlayersList();
  updateRouteStatus();
  updateCardExplanationFromState(null);
}

startBtn.addEventListener('click', ()=>{ 
  resetGame();
  const n = parseInt(numPlayersSel.value,10);
  createPlayers(n);
  rollBtn.disabled = false;
  currentIdx = 0;
  updateCurrentName();
  logMsg(`Jogo iniciado com ${n} jogadores.`);
  renderPlayersList();
  renderPlayers();
  updateRouteStatus();
});

rollBtn.addEventListener('click', ()=>{ 
  if(audioCtx.state === 'suspended') audioCtx.resume();
  if(players.length === 0 || gameOver) return;
  handleRoll();
});

closeRankingBtn.addEventListener('click', ()=> { rankingModal.style.display = 'none'; });
restartBtn.addEventListener('click', ()=> { rankingModal.style.display = 'none'; resetGame(); });

/* initial ready */
resetGame();
createPlayers(2);
rollBtn.disabled = false;
updateRouteStatus();
renderPlayersList();
renderPlayers();

/* also update explanation when page resizes and tokens move */
window.addEventListener('resize', ()=> {
  renderPlayers();
});
