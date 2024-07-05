
function performCalculations() {
    clearErrors(); // Clear all previous error messages
    let resultsHtml = "";

    const bandwidth = parseFloat(document.getElementById('bandwidth').value);
    const subcarrierSpacing = parseFloat(document.getElementById('subcarrierSpacing').value);
    const numOfdmsymbols = parseFloat(document.getElementById('numOfdmsymbols').value);
    const resourceBlockDuration = parseFloat(document.getElementById('resourceBlockDuration').value);
    const qamBits = parseInt(document.getElementById('qamBits').value);
    const parallelResourceBlocks = parseFloat(document.getElementById('parallelResourceBlocks').value);

    let bitsPerResourceElement, bitsPerOfdmSymbol, bitsPerOfdmResourceBlock, maxTransmissionRate;

    if (!isNaN(qamBits) && qamBits > 0 && isPowerOfTwo(qamBits)) {
        bitsPerResourceElement = Math.log2(qamBits);
        resultsHtml += `<p>Bits per Resource Element: <b>${bitsPerResourceElement}</b></p>`;
    } else {
        document.getElementById('errorQamBits').textContent = 'Number of QAM bits must be a non-negative power of 2 (e.g., 16, 32, 1024).';
    }

    if (!isNaN(bandwidth) && bandwidth > 0 && !isNaN(subcarrierSpacing) && subcarrierSpacing > 0 && bandwidth % subcarrierSpacing === 0) {
        if (bitsPerResourceElement !== undefined) {
            bitsPerOfdmSymbol = (bandwidth / subcarrierSpacing) * bitsPerResourceElement;
            resultsHtml += `<p>Bits per OFDM Symbol: <b>${bitsPerOfdmSymbol}</b></p>`;
        }
    } else {
        document.getElementById('errorBandwidth').textContent = 'Bandwidth and subcarrier spacing must be positive numbers, and bandwidth should be divisible by subcarrier spacing.';
    }

    if (!isNaN(numOfdmsymbols) && numOfdmsymbols > 0) {
        if (numOfdmsymbols % 1 !== 0) {
            document.getElementById('errorNumOfdmsymbols').textContent = 'Number of OFDM symbols must be a non-negative integer.';
        } else if (bitsPerOfdmSymbol !== undefined) {
            bitsPerOfdmResourceBlock = numOfdmsymbols * bitsPerOfdmSymbol;
            resultsHtml += `<p>Bits per OFDM Resource Block: <b>${bitsPerOfdmResourceBlock}</b></p>`;
        }
    } else {
        document.getElementById('errorNumOfdmsymbols').textContent = 'Number of OFDM symbols must be a positive integer.';
    }

    if (!isNaN(resourceBlockDuration) && resourceBlockDuration >= 0) {
        if (bitsPerOfdmResourceBlock !== undefined && !isNaN(parallelResourceBlocks) && parallelResourceBlocks > 0 && parallelResourceBlocks % 1 === 0) {
            maxTransmissionRate = (bitsPerOfdmResourceBlock * parallelResourceBlocks) / (resourceBlockDuration / 1000); // convert ms to seconds
            resultsHtml += `<p>Maximum Transmission Rate: <b>${maxTransmissionRate}</b> bits/s</p>`;
        }
    } else {
        document.getElementById('errorResourceBlockDuration').textContent = 'Duration of the resource block must be a non-negative number.';
    }

    if (!isNaN(parallelResourceBlocks) && parallelResourceBlocks >= 0) {
        if (parallelResourceBlocks % 1 !== 0) {
            document.getElementById('errorParallelResourceBlocks').textContent = 'Number of parallel resource blocks must be a non-negative integer.';
        }
    } else {
        document.getElementById('errorParallelResourceBlocks').textContent = 'Number of parallel resource blocks must be a positive integer.';
    }

    document.getElementById('results').innerHTML = resultsHtml || "Please enter valid inputs for calculations.";
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = ''); // Clear any displayed error messages
}

function isPowerOfTwo(number) {
    return number > 0 && (number & (number - 1)) === 0;
}
