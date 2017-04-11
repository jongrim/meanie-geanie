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
        "The stones have been weighed, and the lighest removed. Only these stones remain. Please select which stone or stones you "
        + "would like to weigh on the left side next. You have one weighing remaining.",
        "And finally, select which stone or stones to weigh on the right. We will then determine if you have correctly solved "
        + "how to find the Ramanujan.",
        "Congratulations, you have correctly solved for the Ramanujan. Click Continue if you would like to play again.",
        "Sorry, you didn't find the Ramanujan this time. Better luck next time. Click Continue if you would like to play "
        + "again.",
        "You have discovered the Ramanujan, though you have not correctly solved this puzzle. The correct method "
        + "requires two weighings to be sure you will always find the Ramanujan. Click Play Again if you would like "
        + "to play again."
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
        case 0: // intro to game - display the starter text and set up the environment    
            setDialog(0);

            // reset all jewels so they are visible and not selected
            removeHidden(jewelPanel);
            jewels.forEach(jewel => removeHidden(jewel));
            jewels.forEach(jewel => removeActive(jewel));
            gameState.stones = makeStones();
            gameState.weighings = 0;
            setButtonToContinue();
            setPhase();
            break;
        case 1: // user is asked to choose the first set of stones for weighing    
            setDialog(1);
            jewels.forEach(jewel => jewel.addEventListener('click', toggleActive));
            setButtonToGameMode();
            
            break;
        case 2: // user is asked to choose the next set of stones for weighing
            leftStones = retrieveSelectedStones(true);
            setDialog(2);
            
            break;
        case 3: // stones are compared, and a determination is made if the puzzle continues
            rightStones = retrieveSelectedStones(true);

            weighStones(leftStones, rightStones);
            let currentStones = setStonesActive();
            if (!continueGame(currentStones)) {
                setDialog(7);
                setPhase(0);
                break;
            }

            gameState.weighings++;
            setDialog(3);

            break;
        case 4: // next set of stones is chosen        
            leftStones = retrieveSelectedStones(true);
            setDialog(4);
            
            break;
        case 5: // last set of stones has been chosen, outcome is determined
            rightStones = retrieveSelectedStones(true);
            
            weighStones(leftStones, rightStones);
            let finishingStones = setStonesActive();
            if (determineSuccess(finishingStones)) {
                setDialog(5);
                setPhase(0);
                resetButtonToPlayAgain();
            } else {
                setDialog(6);
                setPhase(0);
                resetButtonToPlayAgain();
            }
            
            break;
        default:
            alert("An error has occured. Please reload the page.");
    }
}

function setPhase(n) {
    if (n > -1) {
        gameState.phase = n;
    } else {
        gameState.phase++;
    }
}

function setDialog(num) {
    textPanel.textContent = gameState["dialog"][num];
}

function toggleHidden(e) {
    e.classList.toggle('hidden');
}

function removeHidden(e) {
    e.classList.remove('hidden');
}

function toggleActive() {
    this.classList.toggle('active');
}

function removeActive(stone) {
    stone.classList.remove('active');
}

function resetButtonToPlayAgain() {
    btn.removeEventListener('click', validateSelection);
    btn.setAttribute('value', 'Play Again');
    btn.addEventListener('click', advanceGame);
}

function setButtonToGameMode() {
    btn.removeEventListener('click', advanceGame); //advanceGame is now called by the validator function
    btn.addEventListener('click', validateSelection);
    btn.setAttribute("value", "Select Stones");
}

function setButtonToContinue() {
    btn.setAttribute('value', 'Continue');
}

function makeStones() {
    let stones = [];
    for (var i = 0; i < 8; i++) {
        stones.push(new Stone(1));
    }
    stones.push(new Stone(2));
    stones.sort(function (a, b) {
        return a.chaos < b.chaos ? -1 : 1;
    });
    stones.map((stone, i) => stone.id = i);
    return stones;
}

function retrieveSelectedStones(resetFlag) {
    let stones = document.querySelectorAll('.active');
    if (stones.length < 1) {
        return [];
    }
    if (resetFlag) {
        stones.forEach(stone => toggleHidden(stone));
        stones.forEach(stone => removeActive(stone));
    }
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
    }
    let leftWeight = leftSide.reduce((acc, curr) => { return acc += gameStones[curr].weight }, 0);
    let rightWeight = rightSide.reduce((acc, curr) => { return acc += gameStones[curr].weight }, 0);
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
    let activeStones = [];
    for (var i = 0; i < stones.length; i++) {
        if (stones[i].id != null) {
            document.querySelector(`#jewel${stones[i].id}`).classList.remove('hidden');
            activeStones.push(stones[i]);
        }
    }
    return activeStones;
}

function determineSuccess(remainingStones) {
    if (remainingStones.length == 1 && remainingStones[0].weight == 2) {
        return true;
    } else {
        return false;
    }
}

function continueGame(currentStones) {
    if (currentStones.length > 1 && gameState.weighings < 2) {
        return true;
    } else {
        return false;
    }
}

function validateSelection() {
    stones = retrieveSelectedStones(false);
    if (stones.length < 1) {
        alert("You must select at least one stone!");
    } else { // selection is valid so we can advance the game phase
        setPhase();
        advanceGame();
    }
}
