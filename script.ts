// כתובת הAPI
const BASE_URL: string = "https://nbaserver-q21u.onrender.com/api/filter";

interface Player {
    playerName?: string
    position: string;
    twoPercent: number; 
    threePercent: number;
    points: number;
}

// סלקטורים גלובליים 
const POSITION = (document.getElementById('position') as HTMLSelectElement);
const POINTS = (document.getElementById('points') as HTMLInputElement);
const TWO_PERCENT = (document.getElementById('two-percent') as HTMLInputElement);
const THREE_PERCENT = (document.getElementById('three-percent') as HTMLInputElement);



// האזנה לאירוע כשנלחץ על כפתור החיפוש
document.getElementById('search-button')?.addEventListener('click', async () => {
    const bodyRequest: Player = {
        position: POSITION.value,
        points: +POINTS.value,
        twoPercent: +TWO_PERCENT.value,
        threePercent: +THREE_PERCENT.value,
    }

    try {
        // שליחת האובייקט לפונקציה שפונה לשרת
        const result: Player[] = await getPlayer(bodyRequest);
        // עדכון הטבלה ע"פ הנתונים שהתקבלו
        UpdateTable(result);
    } catch (error) {
        console.error(error);
    }
})

//  פונקציה שמעדכת את הטבלה ע"פ הנתונים הספציפיים שהתקבלו 
function UpdateTable(players: Player[]): void {
    const resultsBody = document.getElementById('results-body') as HTMLTableSectionElement;
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

        actionButton.addEventListener('click', function(){
            addToTeam(player)
        })
        
        row.append(playerNameCell, positionCell,pointsCell,fgPercentCell,threePercentCell,actionCell);
        
        resultsBody.appendChild(row);
    });
}



// פןנקציה להצגה בכרטיסיות התחילת העמוד
function addToTeam(player: Player) {
    
    const teamDiv = document.getElementById(player.position) as HTMLElement;

    teamDiv.innerHTML = ``;
    
    const playerDiv = document.createElement('div');
    playerDiv.classList.add('player-container'); 

    const nameElement = document.createElement('p');
    nameElement.innerText = `${player.playerName ?? 'Unknown Player'}`;
    
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
function updateRangeLabels(): void {
    const pointsInput = document.getElementById('points') as HTMLInputElement;
    const twoPercentInput = document.getElementById('two-percent') as HTMLInputElement;
    const threePercentInput = document.getElementById('three-percent') as HTMLInputElement;
    
    const pointsLabel = document.querySelector('.input-label-points') as HTMLSpanElement;
    const twoPercentLabel = document.querySelector('.input-label-two-percent') as HTMLSpanElement;
    const threePercentLabel = document.querySelector('.input-label-three-percent') as HTMLSpanElement;
    
    const updateLabel = (input: HTMLInputElement, label: HTMLSpanElement, percent: string) => {
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
async function getPlayer(player: Player): Promise<Player[]> {
    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(player) 
        });

        if (!response.ok) {
            throw new Error("network error");
        }

        const playerList: Player[] = await response.json();
        return playerList;
    } catch (error) {
        console.error("Error in getPlayer:", error);
        throw error;
    }
}











