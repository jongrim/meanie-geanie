const btn = document.querySelector('.btn');
btn.addEventListener('click', advanceGame);
const textPanel = document.querySelector('.textpanel');
const jewelPanel = document.querySelector('.jewelpanel');
const jewels = document.querySelectorAll('.jewel');

var leftStones, rightStones;

var gameState = {
    dialog: [
        "Below are nine stones, identical in every way except for weight. One contains the mythical Ramanujan. You have "
        + "two opportunities to weigh the stones and elimate options. Can you discover which stone contains the Ramanujan?",
        "Please select the group of stones you would like to weigh on the left side of the scale.",
        "Please select the group of stones you would like to weigh on the right side of the scale.",
        "The stones have been weighed, and the lighest removed. Only these stones remain"
    ],
    stones: [],
    phase: 0
}

function Stone(weight) {
    this.weight = weight;
    this.chaos = Math.random() * 10;
}

function advanceGame() {
    switch (gameState.phase) {
        case 0:
        // intro to game - display the starter text and set up the environment    
            setDialog(0);
            jewelPanel.classList.toggle('hidden');
            jewels.forEach(jewel => toggleHidden(jewel));
            makeStones();
            setPhase();
            break;
        case 1:
        // user is asked to choose the first set of stones for weighing    
            setDialog(1);
            jewels.forEach(jewel => jewel.addEventListener('click', toggleActive));
            setPhase();
            break;
        case 2:
            // user is asked to choose the next set of stones for weighing
            setDialog(2);
            leftStones = retrieveSelectedStones();
            setPhase();
            break;
        case 3:
            // compare the stone groups and discard the extra
            rightStones = retrieveSelectedStones();
            setDialog(3);
            weighStones(leftStones, rightStones);
            setStonesActive();
            setPhase();
            break;
        case 4:
            
            
        default:
            
    }
}

function setPhase(n) {
    if (n) {
        gameState.phase = n;
    }
    gameState.phase++;
}

function setDialog(num) {
    textPanel.textContent = gameState["dialog"][num];
}

function toggleHidden(e) {
    e.classList.toggle('hidden');
}

function toggleActive() {
    this.classList.toggle('active');
}

function makeStones() {
    for (var i = 0; i < 8; i++) {
        gameState.stones.push(new Stone(1));
    }
    gameState.stones.push(new Stone(2));
    gameState.stones.sort(function (a, b) {
        return a.chaos < b.chaos ? -1 : 1;
    });
}

function retrieveSelectedStones() {
    let stones = document.querySelectorAll('.active');
    stones.forEach(stone => toggleHidden(stone));
    stones = Array.from(stones);
    let stoneIds = stones.map(stone => Number(stone.id.slice(-1)));
    return stoneIds;
}

function weighStones(leftSide, rightSide) {
    console.log("Left side is:", leftSide, "Right side is:", rightSide);
    let leftWeight = leftSide.reduce((acc, curr) => { return acc += curr.weight });
    let rightWeight = rightSide.reduce((acc, curr) => { return acc += curr.weight });
    if (leftWeight > rightWeight) {
        removeStones(leftSide);
    } else if (rightWeight > leftWeight) {
        removeStones(rightSide);
    } else {
        removeStones(leftSide);
        removeStones(rightSide);
    }
}

function removeStones(stones) {
    for (var i = 0; i < stones.length; i++) {
            gameState.stones.splice(stones[i], 1);
        }
}

function setStonesActive() {
    jewels.forEach(jewel => { jewel.classList.add('hidden') });
    let stones = gameState.stones
    for (var i = 0; i < stones.length; i++) {
        document.querySelector(`#jewel${stones[i]}`).classList.remove('hidden');

    }
}
