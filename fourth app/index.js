function calculateThroughput() {
    clearErrors();
    let resultsHtml = '';

    const bandwidth = parseFloat(document.getElementById('bandwidth').value) * 1e6; // Mbps to bps
    const protocolType = document.getElementById('protocolType').value;
    const propagationDelay = parseFloat(document.getElementById('propagationDelay').value) * 1e-6; // μsec to sec
    const frameSize = parseFloat(document.getElementById('frameSize').value) * 1e3; // Kbits to bits
    const frameRate = parseFloat(document.getElementById('frameRate').value) * 1e3; // Kfps to fps

    if (validateInputs(bandwidth, propagationDelay, frameSize, frameRate)) {
        const T = frameSize / bandwidth; // frame transmission time
        const G = frameRate * T; // offered load
        const alpha = propagationDelay / T; // relative propagation delay

        let S = 0; // throughput
        switch (protocolType) {
            case 'pureALOHA':
                S = G * T * Math.exp(-2* G* T);
                break;
            case 'slottedALOHA':
                S = G * T * Math.exp( -G* T);
                break;

            case 'unslottedCSMA':
                S = G * Math.exp(-2 * alpha * T) / (G * (1 + 2 * alpha) + Math.exp(-alpha * G));
                break; 

            case 'slottedCSMA':
                S = alpha * G * Math.exp(-2 * alpha * T) / (1-Math.exp(-alpha * G) + alpha);
                break;

            case 'unslotted1-persistentCSMA':
                S = (G * (1 + G + alpha * G * (1 + G + (alpha * G) / 2)) * Math.exp(-G * (1 + 2 * alpha))) /
                    (G * (1 + 2 * alpha) - (1 - Math.exp(-alpha * G)) + (1 + alpha * G) * Math.exp(-G * (1 + alpha)));
                break;

            case 'slotted1-persistentCSMA':
                S= (G * (1 + alpha - Math.exp(-alpha * G)) * Math.exp(-G * (1 + alpha))) /
                  ((1 + alpha) * (1 - Math.exp(-alpha * G)) + alpha * Math.exp(-G * (1 + alpha)));
                break;

        }
        
        resultsHtml += `<p>T: <b>${T.toFixed(4)}</b> second</p>`;
        resultsHtml += `<p>G: <b>${G.toFixed(4)}</b></p>`;
        resultsHtml += `<p>alpha: <b>${alpha.toFixed(4)}</b> second</p>`;
        resultsHtml += `<p>Throughput (S): <b>${S}</b></p>`;
        resultsHtml += `<p>Throughput (S): <b>${S.toFixed(4)*100}%</b></p>`;
    } else {
        resultsHtml += `<p>Invalid inputs. Please check the errors above and correct them.</p>`;
    }

    document.getElementById('results').innerHTML = resultsHtml;
}

function validateInputs(bandwidth, propagationDelay, frameSize, frameRate) {
    let isValid = true;
    if (isNaN(bandwidth) || bandwidth <= 0) {
        document.getElementById('errorBandwidth').textContent = 'Data transmission bandwidth must be a non-negative number.';
        isValid = false;
    }
    if (isNaN(propagationDelay) || propagationDelay < 0) {
        document.getElementById('errorPropagationDelay').textContent = 'Maximum time propagation delay must be non-negative number.';
        isValid = false;
    }
    if (isNaN(frameSize) || frameSize <= 0 || !Number.isInteger(frameSize)) {
        document.getElementById('errorFrameSize').textContent = 'Frame size must be non-negative number.';
        isValid = false;
    }
    if (isNaN(frameRate) || frameRate <= 0) {
        document.getElementById('errorFrameRate').textContent = 'Frame rate must be a non-negative number.';
        isValid = false;
    }
    return isValid;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
}
