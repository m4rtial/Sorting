window.onload = function () {
    // page elements
    let barsContainer  = document.getElementById('content');
    let swapsCount     = document.getElementById('swaps');
    let bestRoundSwaps = document.getElementById('bestRound');
    let elementNumInp  = document.getElementById('elementNumInput');
    let elementCounter = document.getElementById('elements');
    let startButton    = document.getElementById('startButton');
    let regenButton    = document.getElementById('regenButton');
    let selectAlgo     = document.getElementById('sortingAlgorithm');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // state variables
    let selectedAlgo = selectAlgo.options[selectAlgo.selectedIndex].value;
    let isSorting = false;
    let isStopped = false;

    // sorting data
    let barcount     = 100;
    let bars         = generateBars(barcount);
    let barsValues   = Array.from(bars, bar => parseFloat(bar.style.height));
    
    // on start button click, start sorting, stop if already sorting
    startButton.addEventListener('click', function () {
        if (isSorting) {
            isStopped = true;
            isSorting = false;
            updateSwaps(0);
            swapsLastPass(0);
            startButton.textContent = "Start";
            return;
        }
        isStopped = false;
        isSorting = true;
        startButton.textContent = "Stop";
        switch (selectedAlgo) {
            case 'bubble':
                bubbleSort(barsValues, bars).finally(() => {
                    isSorting = false;
                    startButton.textContent = "Start";
                });
                break;
        }
    });

    // on regen button click, regenerate bars with new heights
    regenButton.addEventListener('click', function () {
        if (isSorting) { return }
        barcount = parseInt(elementNumInp.value);
        updateElements(barcount);
        barsValues = Array.from(bars, bar => parseFloat(bar.style.height));
        bars.forEach(bar => {
            bar.remove();
        });
        bars = generateBars(barcount);
        barsValues = Array.from(bars, bar => parseFloat(bar.style.height));
    });

    // generate bars with random heights to represent values
    function generateBars(barCount) {
        let bars = [];
        updateElements(barCount);
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'bar';
            bar.id = 'bar' + (i + 1);
            bar.style.height = Math.random() * 100 + '%';
            barsContainer.appendChild(bar);
            bars.push(bar);
        }
        return bars;
    }

    // update number of elements
    function updateElements(barCount) {
        elementCounter.innerHTML = "Elements: " + barCount;
    }

    // update number of total swaps
    function updateSwaps(totalSwaps) {
        swapsCount.innerHTML = "Swaps:  " + totalSwaps;
    }

    // sleep function to create a delay to give dom time to update
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // swap two bars values and heights
    function swapElementAndHeights(barsValues, bars, index) {
        [barsValues[index], barsValues[index + 1]] = [barsValues[index + 1], barsValues[index]];
        [bars[index].style.height, bars[index + 1].style.height] = [bars[index + 1].style.height, bars[index].style.height];
    }

    // generate sound frequency based on array length - middle of range is C5
    function freqGen(barsValues, currentBar) {
        let minVal = Math.min(...barsValues);
        let maxVal = Math.max(...barsValues);
        let range = maxVal - minVal;
        return 523.25 - range / 2 + (parseFloat(currentBar.style.height) - minVal) * (523.25 + range / 2 - (523.25 - range / 2)) / (maxVal - minVal);
    }

    // create a sound based on position within the array
    function playSound(frequency) {
        if (!audioContext) return;
        let oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        let gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
    }

    // number of swaps in the previous round
    function swapsLastPass(roundSwaps) {
        let currentRound = roundSwaps;
        let currentBest = parseInt(bestRoundSwaps.innerHTML.split(': ')[1]);
        if (currentRound < currentBest || currentBest === 0 && currentRound > 0) {
            bestRoundSwaps.innerHTML = "Swaps Last Pass: " + currentRound;
        }
    }

    async function bubbleSort(barsValues, bars) {
        let isSorted   = false;
        let totalSwaps = 0;
        do {
            let swappedThisRound = 0;  // Reset for each pass
            for (let i = 0; i < bars.length - 1; i++) {
                if (isStopped) {
                    return;
                }
                currentBar = bars[i];
                currentBar.style.backgroundColor = 'red';
                playSound(freqGen(barsValues, currentBar));
                if (barsValues[i] > barsValues[i + 1]) {
                    swapElementAndHeights(barsValues, bars, i);
                    totalSwaps++;
                    swappedThisRound++;
                    updateSwaps(totalSwaps);
                    await sleep(0);
                }
                currentBar.style.backgroundColor = 'aqua';
            }
            if (swappedThisRound === 0) {
                isSorted = true;
            }
            swapsLastPass(swappedThisRound);
        } while (!isSorted);
    }
    

    // merge sort algorithm
    async function mergeSort(barsValues, bars) {
        let sorted     = false;
        let totalSwaps = 0;
        do {
            let swapped = 0;
            
        } while (!sorted);
    }
};