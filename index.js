window.onload = function () {
    // page elements
    let barsContainer  = document.getElementById('content');
    let elementCount   = document.getElementById('elements');
    let startButton    = document.getElementById('startButton');
    let selectAlgo     = document.getElementById('sortingAlgorithm');
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // sorting data
    let barcount     = 200;
    let selectedAlgo = selectAlgo.options[selectAlgo.selectedIndex].value;
    let isSorting = false;
    let totalSwaps   = 0;
    let bars         = generateBars(barcount);
    let barsValues   = Array.from(bars, bar => parseFloat(bar.style.height));
    
    // execute selected algorithm
    startButton.addEventListener('click', function () {
        if (isSorting){
            return;
        } else {
            isSorting = true;
            switch (selectedAlgo) {
                case 'bubble':
                    bubbleSort().finally(() => {
                        isSorting = false;  // Only reset flag when sorting finishes
                    });
                    break;
            }
        }
    });

    // generate bars with random heights to represent values
    function generateBars(barCount) {
        let bars = [];
        elementCount.innerHTML = "Elements: " + barCount;
        barsContainer.innerHTML = '';

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

    // Custom sleep function using requestAnimationFrame for smooth delay
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Map the bar height (value) to a frequency range
    function mapValueToFrequency(value, min, max, targetMin, targetMax) {
        return targetMin + (value - min) * (targetMax - targetMin) / (max - min);
    }

    // Create sound based on frequency
    function playSound(frequency) {
        // Ensure audioContext is defined and the page is interactive
        if (!audioContext) return;

        let oscillator = audioContext.createOscillator(); // Create oscillator
        oscillator.type = 'sine';  // 'sine' wave, you can change it for different sounds
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // Set frequency

        let gainNode = audioContext.createGain(); // Create gain node (volume control)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Set volume (lower value = softer sound)

        oscillator.connect(gainNode); // Connect oscillator to gain node
        gainNode.connect(audioContext.destination); // Connect gain node to the output (speakers)

        oscillator.start(); // Start oscillator
        oscillator.stop(audioContext.currentTime + 0.1); // Stop after 0.1 seconds
    }

    // bubble sort algorithm
    async function bubbleSort() {
        let sorted = false;
        do {
            let swapped = 0;
            for (let i = 0; i < bars.length - 1; i++) {
                currentBar = bars[i];
                currentBar.style.backgroundColor = 'red';
                // Play sound based on bar height
                let minVal = Math.min(...barsValues);
                let maxVal = Math.max(...barsValues);
                let range = maxVal - minVal;
                let normalizedFreq = mapValueToFrequency(parseFloat(currentBar.style.height), minVal, maxVal, 523.25 - range / 2, 523.25 + range / 2);
                playSound(normalizedFreq);

                if (barsValues[i] > barsValues[i + 1]) {
                    // Swap values
                    [barsValues[i], barsValues[i + 1]] = [barsValues[i + 1], barsValues[i]];
                    // Swap heights
                    [bars[i].style.height, bars[i + 1].style.height] = [bars[i + 1].style.height, bars[i].style.height];
                    swapped++;
                    // Wait so we can see the change
                    await sleep(0);
                }
                currentBar.style.backgroundColor = 'aqua';
            }
            if (swapped === 0) {
                sorted = true;
            }
        } while (!sorted);
    }
};