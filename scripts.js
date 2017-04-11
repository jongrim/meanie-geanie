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
        "The stones have been weighed, and the lighest removed. Only these stones remain. Please select which stones you "
        + "would like to weigh on the left side next. You have one weighing remaining.",
        "And finally, select which stone(s) to weigh on the right. We will then determine if you have correctly solved "
        + "how to find the Ramanujan."
    ],
    stones: [],
    phase: 0,
    weighings: 0
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
            gameState.weighings++;
            setPhase();
            break;
        case 4:
            setDialog(4);
            leftStones = retrieveSelectedStones();
            setPhase();
            break;
        case 5:
            rightStones = retrieveSelectedStones();
            weighStones(leftStones, rightStones);
            setStonesActive();
            // determineSuccess(); TODO
            
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

function removeActive(stone) {
    stone.classList.remove('active');
}

function makeStones() {
    for (var i = 0; i < 8; i++) {
        gameState.stones.push(new Stone(1));
    }
    gameState.stones.push(new Stone(2));
    gameState.stones.sort(function (a, b) {
        return a.chaos < b.chaos ? -1 : 1;
    });
    gameState.stones.map((stone, i) => stone.id = i);
}

function retrieveSelectedStones() {
    let stones = document.querySelectorAll('.active');
    stones.forEach(stone => toggleHidden(stone));
    stones.forEach(stone => removeActive(stone));
    stones = Array.from(stones);
    let stoneIds = stones.map(stone => Number(stone.id.slice(-1)));
    return stoneIds;
}

function weighStones(leftSide, rightSide) {
    let gameStones = gameState.stones;
    // console.log("Left side is:", leftSide, "Right side is:", rightSide);
    let nonSelectedStones = [];
    for (var i = 0; i < gameStones.length; i++) {
        var curStoneId = gameStones[i].id;
        if (leftSide.includes(curStoneId) || rightSide.includes(curStoneId)) {
        } else {
            nonSelectedStones.push(curStoneId);
        }
        // console.log("Nonselected stones:" + nonSelectedStones);
    }
    let leftWeight = leftSide.reduce((acc, curr) => { return acc += gameStones[curr].weight }, 0);
    console.log("Weight of left:", leftWeight);
    let rightWeight = rightSide.reduce((acc, curr) => { return acc += gameStones[curr].weight }, 0);
    console.log("Weight of right:", rightWeight);
    if (leftWeight > rightWeight) {
        removeStones(rightSide.concat(nonSelectedStones));
    } else if (rightWeight > leftWeight) {
        removeStones(leftSide.concat(nonSelectedStones));
    } else {
        removeStones(leftSide.concat(rightSide));
    }
}

function removeStones(stones) {
    gameState.stones.map(stone => {
        if (stones.includes(stone.id)) {
            stone.id = null;
        }
    });
}

function setStonesActive() {
    jewels.forEach(jewel => { jewel.classList.add('hidden') });
    let stones = gameState.stones
    for (var i = 0; i < stones.length; i++) {
        if (stones[i].id) {
            document.querySelector(`#jewel${stones[i].id}`).classList.remove('hidden');
        }

    }
}

function determineSuccess() {
    let remainingStones = document.querySelectorAll('active')
}
