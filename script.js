//-------------------------------------------
//          SISTEMA DE ÁUDIO (WebAudio)     |
//-------------------------------------------

// Inicializa o contexto de áudio (obrigatório para navegadores modernos)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

/**
 * Som de Saída (Arcade): Tocado quando o peão sai da casa inicial.
 * Usa osciladores para criar bips sintéticos.
 */
function playArcadeExit() {
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator(); // Cria o som
  const g = audioCtx.createGain();       // Controle de volume
  o.type = 'square';                     // Onda quadrada (som de videogame antigo)
  o.frequency.setValueAtTime(880, now);  // Frequência da nota
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(0.16, now + 0.01); // Fade-in rápido
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.22); // Fade-out suave
  o.connect(g).connect(audioCtx.destination);
  o.start(now); o.stop(now + 0.26);

  // Segundo oscilador para dar corpo ao som (sawtooth = dente de serra)
  const o2 = audioCtx.createOscillator();
  const g2 = audioCtx.createGain();
  o2.type = 'sawtooth';
  o2.frequency.setValueAtTime(1400, now);
  g2.gain.setValueAtTime(0, now);
  g2.gain.linearRampToValueAtTime(0.08, now + 0.005);
  g2.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
  o2.connect(g2).connect(audioCtx.destination);
  o2.start(now); o2.stop(now + 0.18);
}

/**
 * Som de Vitória (Epic): Tocado ao chegar no final do tabuleiro.
 * Cria uma harmonia com tons graves, médios e agudos (bell).
 */
function playPrizeEpic() {
  const now = audioCtx.currentTime;
  
  // Parte Grave (Bass)
  const bass = audioCtx.createOscillator();
  bass.type = 'sine';
  bass.frequency.setValueAtTime(220, now);
  const gb = audioCtx.createGain();
  gb.gain.linearRampToValueAtTime(0.22, now + 0.03);
  gb.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
  bass.connect(gb).connect(audioCtx.destination);
  bass.start(now); bass.stop(now + 1.3);

  // Parte Média
  const mid = audioCtx.createOscillator();
  mid.type = 'triangle';
  mid.frequency.setValueAtTime(660, now + 0.02);
  const gm = audioCtx.createGain();
  gm.gain.linearRampToValueAtTime(0.16, now + 0.06);
  gm.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);
  mid.connect(gm).connect(audioCtx.destination);
  mid.start(now); mid.stop(now + 1.05);

  // Sequência de 4 "Sinos" agudos que sobem de tom
  for(let i=0; i<4; i++){
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

/**
 * Som de Derrota: Tocado em capturas ou "Erro Fatal".
 * A frequência cai (efeito 'slide down').
 */
function playLossSound() {
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator();
  o.type = 'sine';
  o.frequency.setValueAtTime(600, now);
  o.frequency.linearRampToValueAtTime(320, now + 0.22); // Cai de 600Hz para 320Hz
  const g = audioCtx.createGain();
  g.gain.linearRampToValueAtTime(0.18, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
  o.connect(g).connect(audioCtx.destination);
  o.start(now); o.stop(now + 0.45);
}

// Sons de alerta simples para as casas especiais
function playAlertA() { /* Beep curto em sawtooth */ }
function playAlertB() { /* Beep mais grave em triangle */ }

//-------------------------------------------
//          MAPEMANTO DO DOM (HTML)         |
//-------------------------------------------

// Seleciona os elementos da tela para o JS poder mudar o texto/cor
const boardCard = document.getElementById('boardCard');
const tokensLayer = document.getElementById('tokensLayer'); // Onde as peças ficam
const rollBtn = document.getElementById('rollBtn');         // Botão de jogar dado
const startBtn = document.getElementById('startBtn');       // Botão de começar

//-------------------------------------------
//          ESTADO GLOBAL DO JOGO           |
//-------------------------------------------

let players = [];        // Lista de objetos: {nome, posição, cor, status}
let currentIdx = 0;      // De quem é a vez agora
let gameOver = false;    // Trava o jogo se alguém vencer
let routeOccupied = [null,null,null,null]; // R1, R2, R3, R4 estão livres?

//-------------------------------------------
//          DICIONÁRIO EDUCATIVO            |
//-------------------------------------------

/**
 * Este objeto armazena o que cada casa significa.
 * Quando o jogador cai na casa X, o sistema busca aqui o Título e Texto.
 */
const explanations = {
  'basic:1': {title:'01 – POST', text:'Teste de hardware ao ligar o PC.'},
  'basic:9': {title:'09 – Erro Fatal!', text:'O peão volta para a Casa OFF.'},
  'basic:16': {title:'16 – MALWARE', text:'Fica 2 rodadas sem jogar.'},
  // ... (e assim por diante para todas as casas)
};

//-------------------------------------------
//          LÓGICA VISUAL DOS PEÕES         |
//-------------------------------------------

/**
 * Cria o "Emblema" (ícone pequeno) sobre a cabeça do peão.
 * @param {string} stage - 'active' (estrela), 'cross' (escudo), 'prize' (coroa)
 */
function createEmblemForStage(stage){
  const e = document.createElement('div');
  e.className = 'emblem';
  if(stage === 'active'){ e.textContent = '⋆'; }
  else if(stage === 'cross'){ e.textContent = '🛡'; }
  else if(stage === 'prize'){ e.textContent = '♛'; }
  return e;
}

/**
 * Organiza a posição das peças na Casa OFF (Início).
 * Como as peças são círculos, os 'offsets' evitam que uma fique em cima da outra.
 */
const offOffsets = [
  {x:-26, y:-20}, // Jogador 1
  {x:26,  y:-20}, // Jogador 2
  {x:-26, y:20},  // Jogador 3
  {x:26,  y:20}   // Jogador 4
];
///-------------------------------------------
//      MOVIMENTAÇÃO E ANIMAÇÃO DOS PEÕES   |
//-------------------------------------------

/**
 * Função de animação que move o peão passo a passo.
 * Em vez de "pular" para o destino, ela percorre um caminho de casas.
 */
function animateTokenTo(pl, pathTiles, onComplete){
  if(!pl.elem){ if(onComplete) onComplete(); return; }
  let i = 0;
  function next(){
    // Se chegou ao fim do caminho, executa a função de conclusão
    if(i >= pathTiles.length){ if(onComplete) onComplete(); return; }
    
    const tileEl = pathTiles[i];
    placeTokenOnElement(pl.elem, tileEl); // Move para a próxima casa
    applyJump(pl.elem);                  // Faz o peão "pular" visualmente
    i++;
    setTimeout(next, 260);               // Aguarda 260ms para o próximo passo
  }
  next();
}

/**
 * Construtor de Caminhos: Define quais casas o peão deve pisar 
 * para sair da posição A e chegar na posição B.
 */
function buildPathForMove(pl, targetState){
  const path = [];
  // Exemplo: Se está saindo da Casa OFF para o Tabuleiro Principal
  if(pl.state.type === 'off' && targetState.type === 'main'){
    path.push(offEl); path.push(tileByMain(1)); return path;
  }
  // Se está se movendo dentro do tabuleiro principal (casas 1 a 20)
  if(pl.state.type === 'main' && targetState.type === 'main'){
    const from = pl.state.index; const to = targetState.index;
    for(let k=from+1; k<=to; k++) path.push(tileByMain(k+1));
    return path;
  }
  // (O código continua mapeando caminhos para Cruzamento, Rotas e Prêmio)
  return path;
}

//-------------------------------------------
//      SISTEMA DE CARTAS E EXPLICAÇÕES     |
//-------------------------------------------

/**
 * Atualiza o painel lateral com a explicação pedagógica da casa onde o peão caiu.
 * Também destaca visualmente o "deck" (baralho) correspondente na tela.
 */
function updateCardExplanationFromState(state){
  if(!state){ 
    explainTextEl.textContent = 'Passe o peão em uma casa...'; 
    clearDeckHighlights(); return; 
  }
  
  if(state.type === 'main'){
    const idx = state.index + 1;
    const key = `basic:${idx}`;
    const obj = explanations[key];
    highlightDeck('basic', key); // Destaca o baralho "Básico"
    explainTextEl.textContent = (obj ? (obj.title + ' — ' + obj.text) : `Casa ${idx}`);
  } 
  // Repete a lógica para Crossing (Cruzamento) e Rotas específicas
}

//-------------------------------------------
//      REGRAS DE CONFLITO E VITÓRIA        |
//-------------------------------------------

/**
 * Resolve CAPTURAS: Se um jogador cai na mesma casa de outro.
 * Se o alvo tiver IMUNIDADE, nada acontece. Caso contrário, volta ao início.
 */
function resolveCaptures(pl){
  const key = positionKey(pl.state);
  players.forEach(target=>{
    if(target.id === pl.id) return;
    if(positionKey(target.state) === key){
      if(immunity[target.id] && immunity[target.id] > 0){
        logMsg(`${target.name} está imune!`);
      } else {
        playLossSound(); // Som de erro/captura
        target.state = { type: 'off' }; // Reseta o jogador capturado
        target.skipTurns = 0;
        placeTokenByState(target.elem, target.state, target.id);
      }
    }
  });
}

/**
 * Ranking Final: Quando 3 jogadores terminam, o jogo acaba.
 * Calcula quem ficou em 4º baseado no "progresso" (quem estava mais longe).
 */
function buildAndShowFinalRanking(){
  const ordered = finishOrder.slice(); // Jogadores que já cruzaram a linha de chegada
  const remaining = players.filter(p => !ordered.includes(p.letter));
  
  // Ordena os que sobraram por quem estava mais perto do fim
  remaining.sort((a,b) => computeProgress(b) - computeProgress(a));
  remaining.forEach(p => ordered.push(p.letter));
  
  // Monta a lista visual no Modal de Ranking
  rankingList.innerHTML = '';
  ordered.forEach((letter, idx) => {
    const obj = players.find(x => x.letter === letter);
    const li = document.createElement('li');
    li.textContent = `${idx+1}º — ${obj ? obj.name : letter}`;
    rankingList.appendChild(li);
  });
  rankingModal.style.display = 'flex';
}

//-------------------------------------------
//      INTERFACE E LISTA DE JOGADORES      |
//-------------------------------------------

/**
 * renderPlayersList: Atualiza a barra lateral com os nomes, 
 * estados (onde estão) e penalidades (bloqueios) de cada um.
 */
function renderPlayersList(){
  playersListEl.innerHTML = '';
  players.forEach((p, idx) => {
    const row = document.createElement('div');
    row.className = 'player-row' + (p.state.type === 'prize' ? ' prize' : '');
    
    // Destaca o jogador da vez com uma borda especial
    row.style.border = (currentIdx === idx && !gameOver) ? '2px solid #e6f0ff' : '1px solid #eef2ff';
    
    let desc = describeState(p.state);
    if(immunity[p.id] > 0) desc += ` • 🛡 Imune`;
    if(p.skipTurns > 0) desc += ` • ❌ Bloqueado: ${p.skipTurns} turn(s)`;
    
    let crown = (p.state.type === 'prize') ? '♛' : '';
    row.innerHTML = `<strong>${p.name} ${crown}</strong><br>${desc}`;
    playersListEl.appendChild(row);
  });
}


//-------------------------------
//      terceira parte          |
//------------------------------
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

//-------------------------------------------
//                Quarta parte            |
//-------------------------------------------
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
