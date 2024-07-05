// Constants
const K = 1.38e-23; // Boltzmann's constant in Joules/Kelvin

// BER and Eb/N0 mapping based on the graph
const BER_map = {
    "BPSK/QPSK": [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001], 
    "8-PSK": [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001],
    "16-PSK": [0.1, 0.01, 0.001, 0.0001, 0.00001, 0.000001, 0.0000001]
};

const EbN0_dB_map = {
    "BPSK/QPSK": [0.1, 4, 7, 8.2, 9.7, 11, 11.5],  
    "8-PSK": [2, 7, 10, 11.8, 13, 14, 15],  
    "16-PSK": [5, 11.3, 14.2, 16, 17.5, 18, 19]   
};


function convertToDb(value, unit) {
    if (unit === 'watt') {
        return 10 * Math.log10(value);
    } else if (unit === 'dBm') {
        return value - 30; // Convert dBm to dB
    }
    return value; // Assume the value is already in dB if not specified as watt or dBm
}

function getUnit(elementId) {
    const selectElement = document.getElementById(elementId);
    return selectElement.value;
}

function getValue(elementId) {
    return parseFloat(document.getElementById(elementId).value);
}

function calculateTransmitPower() {
    clearErrors(); // Clear all previous error messages
    let errorsPresent = false; // Flag to track if any errors are present
    let resultsHtml = "";

    // Retrieve input values and convert if necessary
    const pathLoss = convertToDb(getValue('pathLossValue'), getUnit('pathLossUnit'));
    const transmitGain = convertToDb(getValue('transmitGainValue'), getUnit('transmitGainUnit'));
    const receiveGain = convertToDb(getValue('receiveGainValue'), getUnit('receiveGainUnit'));
    const feedLoss = convertToDb(getValue('feedLoss'), getUnit('feedLossUnit'));
    const otherLosses = convertToDb(getValue('otherLosses'), getUnit('otherLossesUnit'));
    const fadeMargin = convertToDb(getValue('fadeMargin'), getUnit('fadeMarginUnit'));
    const amplifierGain = convertToDb(getValue('amplifierGain'), getUnit('amplifierGainUnit'));
    const noiseFigure = convertToDb(getValue('noiseFigure'), getUnit('noiseFigureUnit'));
    const linkMargin = convertToDb(getValue('linkMargin'), getUnit('linkMarginUnit'));

    const dataRate = parseFloat(document.getElementById('dataRate').value) * 1e3; // Convert kbps to bps
    if (dataRate < 0) {
        document.getElementById('errorDataRate').textContent = 'Data Rate must be a non-negative number.';
        errorsPresent = true;
    }

    const frequency = parseFloat(document.getElementById('frequency').value) * 1e6; // Convert MHz to Hz
    if (frequency < 0) {
        document.getElementById('errorFrequency').textContent = 'Frequency must be a non-negative number.';
        errorsPresent = true;
    }

    if (errorsPresent) {
        return; // Stop the function if there are any errors
    }

    const noiseTemperature = parseFloat(document.getElementById('noiseTemperature').value);
    const modulationType = document.getElementById('modulationType').value;
    const bitErrorRate = parseFloat(document.getElementById('bitErrorRate').value);

    // Calculate required Eb/N0 based on modulation type and target BER
    const requiredEbN0dB = getRequiredEbN0(modulationType, bitErrorRate);
    let pr = linkMargin + (10 * Math.log10(dataRate)) + (10 * Math.log10(K)) + (10 * Math.log10(noiseTemperature)) + noiseFigure + requiredEbN0dB;

    // Calculate required transmit power
    let requiredTransmitPower = pr + pathLoss + feedLoss + otherLosses + fadeMargin - amplifierGain - transmitGain - receiveGain;

    resultsHtml += `<p>Required Transmit Power in dB: <b>${requiredTransmitPower.toFixed(2)}</b> dB</p>`;
    resultsHtml += `<p>Required Transmit Power in watt: <b>${Math.pow(10, requiredTransmitPower / 10).toFixed(2)}</b> watt</p>`;
    resultsHtml += `<p>Required Transmit Power in dBm: <b>${(requiredTransmitPower + 30).toFixed(2)}</b> dBm</p>`;

    document.getElementById('results').innerHTML = resultsHtml;
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = ''); // Clear any displayed error messages
}

function getRequiredEbN0(modulationType, targetBER) {
    const berIndex = BER_map[modulationType].indexOf(targetBER);
    return berIndex !== -1 ? EbN0_dB_map[modulationType][berIndex] : null;
}


document.getElementById('calculateBtn').addEventListener('click', calculateTransmitPower);
