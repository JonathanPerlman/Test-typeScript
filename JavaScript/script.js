"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
// כתובת הAPI
const BASE_URL = "https://nbaserver-q21u.onrender.com/api/filter";
// סלקטורים גלובליים 
const POSITION = document.getElementById('position');
const POINTS = document.getElementById('points');
const TWO_PERCENT = document.getElementById('two-percent');
const THREE_PERCENT = document.getElementById('three-percent');
// האזנה לאירוע כשנלחץ על כפתור החיפוש
(_a = document.getElementById('search-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
    const bodyRequest = {
        position: POSITION.value,
        points: +POINTS.value,
        twoPercent: +TWO_PERCENT.value,
        threePercent: +THREE_PERCENT.value,
    };
    try {
        // שליחת האובייקט לפונקציה שפונה לשרת
        const result = yield getPlayer(bodyRequest);
        // עדכון הטבלה ע"פ הנתונים שהתקבלו
        UpdateTable(result);
    }
    catch (error) {
        console.error(error);
    }
}));
//  פונקציה שמעדכת את הטבלה ע"פ הנתונים הספציפיים שהתקבלו 
function UpdateTable(players) {
    const resultsBody = document.getElementById('results-body');
    resultsBody.innerHTML = '';
    players.forEach(player => {
        const row = document.createElement('tr');
        const playerNameCell = document.createElement('td');
        playerNameCell.textContent = player.playerName || 'Unknown';
        const positionCell = document.createElement('td');
        positionCell.textContent = player.position;
        const pointsCell = document.createElement('td');
        pointsCell.textContent = player.points.toString();
        const fgPercentCell = document.createElement('td');
        fgPercentCell.textContent = player.twoPercent.toString() + '%';
        const threePercentCell = document.createElement('td');
        threePercentCell.textContent = player.threePercent.toString() + '%';
        const actionCell = document.createElement('td');
        const actionButton = document.createElement('button');
        actionButton.textContent = `Add ${player.playerName} to Current Team`;
        actionCell.appendChild(actionButton);
        actionButton.addEventListener('click', function () {
            addToTeam(player);
        });
        row.append(playerNameCell, positionCell, pointsCell, fgPercentCell, threePercentCell, actionCell);
        resultsBody.appendChild(row);
    });
}
// פןנקציה להצגה בכרטיסיות התחילת העמוד
function addToTeam(player) {
    var _a;
    const teamDiv = document.getElementById(player.position);
    teamDiv.innerHTML = ``;
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-container');
    const nameElement = document.createElement('p');
    nameElement.innerText = `${(_a = player.playerName) !== null && _a !== void 0 ? _a : 'Unknown Player'}`;
    const threePercentElement = document.createElement('p');
    threePercentElement.innerText = `Three Percents: ${player.threePercent}%`;
    const twoPercentElement = document.createElement('p');
    twoPercentElement.innerText = `Two Percents: ${player.twoPercent}%`;
    const pointsElement = document.createElement('p');
    pointsElement.innerText = `Points: ${player.points}`;
    playerDiv.appendChild(nameElement);
    playerDiv.appendChild(threePercentElement);
    playerDiv.appendChild(twoPercentElement);
    playerDiv.appendChild(pointsElement);
    teamDiv.appendChild(playerDiv);
}
/// פונקציה לעדכון תוויות הערכים של שדות הקלט כאשר הם משתנים לפי השינוי של המשתמש
function updateRangeLabels() {
    const pointsInput = document.getElementById('points');
    const twoPercentInput = document.getElementById('two-percent');
    const threePercentInput = document.getElementById('three-percent');
    const pointsLabel = document.querySelector('.input-label-points');
    const twoPercentLabel = document.querySelector('.input-label-two-percent');
    const threePercentLabel = document.querySelector('.input-label-three-percent');
    const updateLabel = (input, label, percent) => {
        label.textContent = `${input.value}${percent}`;
    };
    updateLabel(pointsInput, pointsLabel, '');
    updateLabel(twoPercentInput, twoPercentLabel, '%');
    updateLabel(threePercentInput, threePercentLabel, '%');
    pointsInput.addEventListener('input', () => updateLabel(pointsInput, pointsLabel, ''));
    twoPercentInput.addEventListener('input', () => updateLabel(twoPercentInput, twoPercentLabel, '%'));
    threePercentInput.addEventListener('input', () => updateLabel(threePercentInput, threePercentLabel, '%'));
}
// קריאה לפונקציה שמעדכנת את  תוויות השדות כאשר הדף נטען
document.addEventListener('DOMContentLoaded', updateRangeLabels);
// פונקציה שפונה לשרת ה
function getPlayer(player) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(player)
            });
            if (!response.ok) {
                throw new Error("network error");
            }
            const playerList = yield response.json();
            return playerList;
        }
        catch (error) {
            console.error("Error in getPlayer:", error);
            throw error;
        }
    });
}
