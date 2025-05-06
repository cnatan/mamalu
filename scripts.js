const timers = {
    mamada: {
        id: 'mamada',
        displayElement: document.getElementById('mamada-time'),
        intervalId: null,
        startTime: null,
        elapsedTime: 0,
        totalAccumulatedTime: 0,
        isRunning: false,
        sessionStartTime: null,
        side: 'esquerdo'
    },
    chupetada: {
        id: 'chupetada',
        displayElement: document.getElementById('chupetada-time'),
        intervalId: null,
        startTime: null,
        elapsedTime: 0,
        totalAccumulatedTime: 0,
        isRunning: false,
        sessionStartTime: null,
        side: 'esquerdo'
    }
};

let historyLog = [];
let timerToReset = null;

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const ms = Math.floor((milliseconds % 1000) / 100);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${ms}`;
}

function updateTimerDisplay(timerId) {
    const timer = timers[timerId];
    const currentTime = timer.totalAccumulatedTime + timer.elapsedTime;
    timer.displayElement.textContent = formatTime(currentTime);
}

function tick(timerId) {
    const timer = timers[timerId];
    const now = Date.now();
    timer.elapsedTime = now - timer.startTime;
    updateTimerDisplay(timerId);
}

function startTimer(timerId) {
    const timerToStart = timers[timerId];
    const otherTimerId = timerId === 'mamada' ? 'chupetada' : 'mamada';
    const otherTimer = timers[otherTimerId];

    if (otherTimer.isRunning) {
        pauseTimer(otherTimerId);
    }

    if (!timerToStart.isRunning) {
        timerToStart.isRunning = true;
        timerToStart.startTime = Date.now();
        timerToStart.sessionStartTime = timerToStart.startTime;

        const side = timers[timerId].side;
        timerToStart.side = side;

        document.getElementById(`${timerId}-side-toggle`).disabled = true;

        clearInterval(timerToStart.intervalId);
        timerToStart.intervalId = setInterval(() => tick(timerId), 100);
        updateTimerDisplay(timerId);
        console.log(`${timerId} iniciado no lado ${side} às ${new Date(timerToStart.sessionStartTime).toLocaleString()}`);
    }
}

function pauseTimer(timerId) {
    const timer = timers[timerId];

    if (timer.isRunning) {
        timer.isRunning = false;
        clearInterval(timer.intervalId);
        timer.intervalId = null;

        const sessionEndTime = Date.now();
        timer.elapsedTime = sessionEndTime - timer.startTime;
        timer.totalAccumulatedTime += timer.elapsedTime;
        timer.elapsedTime = 0;

        if (timer.sessionStartTime) {
            historyLog.push({
                type: timer.id.charAt(0).toUpperCase() + timer.id.slice(1),
                side: timer.side,
                start: timer.sessionStartTime,
                end: sessionEndTime
            });
            console.log(`${timerId} pausado. Lado: ${timer.side}. Sessão: ${formatTime(sessionEndTime - timer.sessionStartTime)}.`);
        }

        timer.startTime = null;
        timer.sessionStartTime = null;
        updateTimerDisplay(timerId);

        document.getElementById(`${timerId}-side-toggle`).disabled = false;
    }
}

function resetTimer(timerId) {
    const timer = timers[timerId];

    pauseTimer(timerId);

    // Remover registros do histórico relacionados ao cronômetro resetado
    historyLog = historyLog.filter(entry => entry.type.toLowerCase() !== timerId);

    timer.totalAccumulatedTime = 0;
    timer.elapsedTime = 0;
    timer.isRunning = false;
    timer.startTime = null;
    timer.sessionStartTime = null;
    clearInterval(timer.intervalId);
    timer.intervalId = null;

    timer.displayElement.textContent = formatTime(0);

    document.getElementById(`${timerId}-side-toggle`).disabled = false;

    console.log(`${timerId} resetado e registros do histórico removidos.`);
}

function printHistory() {
    const historyTextArea = document.getElementById('history-log');
    historyTextArea.value = '';

    if (historyLog.length === 0) {
        historyTextArea.value = 'Nenhum registro ainda.';
        return;
    }

    historyLog.sort((a, b) => a.start - b.start);

    let historyString = '';
    let totalMamada = 0;
    let totalMamadaEsq = 0;
    let totalMamadaDir = 0;
    let totalChupetada = 0;
    let totalChupetadaEsq = 0;
    let totalChupetadaDir = 0;

    historyLog.forEach(entry => {
        const startTimeStr = new Date(entry.start).toLocaleString('pt-BR');
        const endTimeStr = new Date(entry.end).toLocaleString('pt-BR');
        const durationMs = entry.end - entry.start;
        const durationStr = formatTime(durationMs);

        historyString += `${entry.type} (seio ${entry.side}) iniciou às ${startTimeStr} encerrou às ${endTimeStr} (Duração: ${durationStr})\n`;

        if (entry.type === 'Mamada') {
            totalMamada += durationMs;
            if (entry.side === 'esquerdo') {
                totalMamadaEsq += durationMs;
            } else {
                totalMamadaDir += durationMs;
            }
        } else if (entry.type === 'Chupetada') {
            totalChupetada += durationMs;
            if (entry.side === 'esquerdo') {
                totalChupetadaEsq += durationMs;
            } else {
                totalChupetadaDir += durationMs;
            }
        }
    });

    historyString += `\nTotal de mamadas: ${formatTime(totalMamada)}\n`;
    historyString += `Total de mamadas lado esquerdo: ${formatTime(totalMamadaEsq)}\n`;
    historyString += `Total de mamadas lado direito: ${formatTime(totalMamadaDir)}\n`;
    historyString += `Total de chupetadas: ${formatTime(totalChupetada)}\n`;
    historyString += `Total de chupetadas lado esquerdo: ${formatTime(totalChupetadaEsq)}\n`;
    historyString += `Total de chupetadas lado direito: ${formatTime(totalChupetadaDir)}`;

    historyTextArea.value = historyString.trim();
    console.log("Histórico impresso.");
}

function copyHistory() {
    const historyTextArea = document.getElementById('history-log');
    historyTextArea.select();
    document.execCommand('copy');
    alert('Histórico copiado para a área de transferência!');
}

function clearHistoryLog() {
    const historyTextArea = document.getElementById('history-log');
    historyTextArea.value = '';
    console.log("Histórico visual limpo.");
}

function showConfirmationModal(timerId) {
    timerToReset = timerId;
    const modal = document.getElementById('confirmation-modal');
    modal.classList.add('active');
}

function hideConfirmationModal() {
    timerToReset = null;
    const modal = document.getElementById('confirmation-modal');
    modal.classList.remove('active');
}

document.getElementById('confirm-reset').addEventListener('click', () => {
    if (timerToReset) {
        resetTimer(timerToReset);
    }
    hideConfirmationModal();
});

document.getElementById('cancel-reset').addEventListener('click', hideConfirmationModal);

function updateSide(timerId) {
    const toggle = document.getElementById(`${timerId}-side-toggle`);
    const label = document.getElementById(`${timerId}-side-label`);
    const side = toggle.checked ? 'direito' : 'esquerdo';
    timers[timerId].side = side;
    label.textContent = side.charAt(0).toUpperCase() + side.slice(1);
}

document.addEventListener('DOMContentLoaded', () => {
    updateTimerDisplay('mamada');
    updateTimerDisplay('chupetada');
    console.log("Página carregada e cronômetros inicializados.");
});
