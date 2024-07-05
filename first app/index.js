function performCalculations() {
    var errors = false;
    var bandwidth = parseFloat(document.getElementById('bandWidth').value);
    var bitQuantizer = parseFloat(document.getElementById('bitQuantizer').value);
    var sourceEncoderRate = parseFloat(document.getElementById('sourceEncoderRate').value);
    var channelEncoderRate = parseFloat(document.getElementById('channelEncoderRate').value);
    var interleaverBits = parseFloat(document.getElementById('interleaverBits').value);

    clearErrors();  // Clear previous error messages

    var resultsHtml = "";

    // Calculate Sampling Frequency if bandwidth is provided
    if (!isNaN(bandwidth) && bandwidth >= 0) {
        var fs = 2 * bandwidth;
        resultsHtml += `<p>The Sampling Frequency = <b>${fs}</b> Samples/s</p>`;
    } else if (document.getElementById('bandWidth').value !== '') {
        document.getElementById('errorBandwidth').textContent = "Must be a non-negative number.";
        errors = true;
    }

    // Calculate Number of Quantization Levels if bitQuantizer is provided
    if (!isNaN(bitQuantizer) && bitQuantizer >= 0 && bitQuantizer % 1 === 0) {
        var L = Math.pow(2, bitQuantizer);
        resultsHtml += `<p>The Number of Quantization Levels = <b>${L}</b> Levels</p>`;
    } else if (document.getElementById('bitQuantizer').value !== '') {
        document.getElementById('errorBitQuantizer').textContent = "Must be a non-negative integer (no decimals).";
        errors = true;
    }

  // Calculate Bit Rate at the Output of the Source Encoder
if (!isNaN(fs) && !isNaN(bitQuantizer) && !isNaN(sourceEncoderRate)) {
    if (sourceEncoderRate > 0 && sourceEncoderRate <= 1) {
        var sourceEncoderOutput = fs * bitQuantizer * sourceEncoderRate;
        resultsHtml += `<p>The Bit Rate at the Output of the Source Encoder = <b>${sourceEncoderOutput}</b> bits/s</p>`;
    } 
} else if (document.getElementById('sourceEncoderRate').value !== '') {
    document.getElementById('errorSourceEncoderRate').textContent = "Must be between 0 and 1.";
    errors = true;
}

// Calculate Bit Rate at the Output of the Channel Encoder
if (!isNaN(sourceEncoderOutput) && !isNaN(channelEncoderRate)) {
    if (channelEncoderRate > 0 && channelEncoderRate <= 1) {
        var channelEncoderOutput = sourceEncoderOutput / channelEncoderRate;
        resultsHtml += `<p>The Bit Rate at the Output of the Channel Encoder = <b>${channelEncoderOutput}</b> bits/s</p>`;
    } 
} else if (document.getElementById('channelEncoderRate').value !== '') {
    document.getElementById('errorChannelEncoderRate').textContent = "Must be between 0 and 1.";
    errors = true;
}

// Calculate Bit Rate at the Output of the Interleaver
if (!isNaN(sourceEncoderOutput) && !isNaN(interleaverBits) && isPowerOfTwo(interleaverBits)) {
    if (interleaverBits >= 0 && interleaverBits % 1 === 0) {
        var interleaverOutput = sourceEncoderOutput / channelEncoderRate; // Ensure this uses interleaverBits, not channelEncoderRate unless intended
        resultsHtml += `<p>The Bit Rate at the Output of the Interleaver =<b>${interleaverOutput}</b> bits/s</p>`;
    } 
} else if (document.getElementById('interleaverBits').value !== '') {
    document.getElementById('errorInterleaverBits').textContent = "Must be a non-negative integer (no decimals) and a power of 2.";
    errors = true;
}


    // Display results or clear if there are errors
    if (!errors) {
        document.getElementById('results').innerHTML = resultsHtml;
    } else {
        document.getElementById('results').innerHTML = '';
    }
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');  // Clear any displayed error messages
}
function isPowerOfTwo(number) {
    return number > 0 && (number & (number - 1)) === 0;
    }

