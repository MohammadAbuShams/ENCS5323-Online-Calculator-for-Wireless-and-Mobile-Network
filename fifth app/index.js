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


function findRequiredChannels(probability, trafficPerCell) {
    let minChannels = Infinity;
    const channels = lookupChannels(probability);
    for (let channelCount in channels) {
        if (channels[channelCount] >= trafficPerCell && parseInt(channelCount) < minChannels) {
            minChannels = parseInt(channelCount);
        }
    }
    return minChannels === Infinity ? 'Not available' : minChannels;
}





function lookupChannels(callDropProbability) {
   
    const channelData = {
        "0.001": {1: 0.001, 2: 0.046, 3: 0.194, 4: 0.439, 5: 0.762, 6: 1.100, 7: 1.600, 8: 2.100, 9: 2.600, 10: 3.100,
                  11: 3.700, 12: 4.200, 13: 4.800, 14: 5.400, 15: 6.100, 16: 6.700, 17: 7.400, 18: 8.000, 19: 8.700, 20: 9.400,
                  21: 10.100, 22: 10.800, 23: 11.500, 24: 12.200, 25: 13.000, 26: 13.700, 27: 14.400, 28: 15.200, 29: 15.900,
                  30: 16.700, 31: 17.400, 32: 18.200, 33: 19.000, 34: 19.700, 35: 20.500, 36: 21.300, 37: 22.100, 38: 22.900,
                  39: 23.700, 40: 24.400, 41: 25.200, 42: 26.000, 43: 26.800, 44: 27.600, 45: 28.400},
        "0.002": {1: 0.002, 2: 0.065, 3: 0.249, 4: 0.535, 5: 0.900, 6: 1.300, 7: 1.800, 8: 2.300, 9: 2.900, 10: 3.400,
                  11: 4.000, 12: 4.600, 13: 5.300, 14: 5.900, 15: 6.600, 16: 7.300, 17: 7.900, 18: 8.600, 19: 9.400, 20: 10.100,
                  21: 10.800, 22: 11.500, 23: 12.300, 24: 13.000, 25: 13.800, 26: 14.500, 27: 15.300, 28: 16.100, 29: 16.800,
                  30: 17.600, 31: 18.400, 32: 19.200, 33: 20.000, 34: 20.800, 35: 21.600, 36: 22.400, 37: 23.200, 38: 24.000,
                  39: 24.800, 40: 25.600, 41: 26.400, 42: 27.200, 43: 28.100, 44: 28.900, 45: 29.7},
        "0.005": {1: 0.005, 2: 0.105, 3: 0.349, 4: 0.701, 5: 1.132, 6: 1.600, 7: 2.200, 8: 2.700, 9: 3.300, 10: 4.000,
                  11: 4.600, 12: 5.300, 13: 6.000, 14: 6.700, 15: 7.400, 16: 8.100, 17: 8.800, 18: 9.600, 19: 10.300, 20: 11.100,
                  21: 11.900, 22: 12.600, 23: 13.400, 24: 14.200, 25: 15.000, 26: 15.800, 27: 16.600, 28: 17.400, 29: 18.200,
                  30: 19.000, 31: 19.900, 32: 20.700, 33: 21.500, 34: 22.300, 35: 23.200, 36: 24.000, 37: 24.800, 38: 25.700,
                  39: 26.500, 40: 27.400, 41: 28.200, 42: 29.100, 43: 29.900, 44: 30.800, 45: 31.7},
        "0.01": {1: 0.010, 2: 0.153, 3: 0.455, 4: 0.869, 5: 1.361, 6: 1.900, 7: 2.500, 8: 3.100, 9: 3.800, 10: 4.500,
                 11: 5.200, 12: 5.900, 13: 6.600, 14: 7.400, 15: 8.100, 16: 8.900, 17: 9.700, 18: 10.400, 19: 11.200, 20: 12.000,
                 21: 12.800, 22: 13.700, 23: 14.500, 24: 15.300, 25: 16.100, 26: 17.000, 27: 17.800, 28: 18.600, 29: 19.500,
                 30: 20.300, 31: 21.200, 32: 22.000, 33: 22.900, 34: 23.800, 35: 24.600, 36: 25.500, 37: 26.400, 38: 27.300,
                 39: 28.100, 40: 29.000, 41: 29.900, 42: 30.800, 43: 31.700, 44: 32.500, 45: 33.4},

        "0.012": {
    1: 0.012, 2: 0.168, 3: 0.489, 4: 0.922, 5: 1.431, 6: 2.000, 7: 2.600, 8: 3.200, 9: 3.900, 10: 4.600,
    11: 5.300, 12: 6.100, 13: 6.800, 14: 7.600, 15: 8.300, 16: 9.100, 17: 9.900, 18: 10.700, 19: 11.500, 20: 12.300,
    21: 13.100, 22: 14.000, 23: 14.800, 24: 15.600, 25: 16.500, 26: 17.300, 27: 18.200, 28: 19.000, 29: 19.900, 30: 20.700,
    31: 21.600, 32: 22.500, 33: 23.300, 34: 24.200, 35: 25.100, 36: 26.000, 37: 26.800, 38: 27.700, 39: 28.600, 40: 29.500,
    41: 30.400, 42: 31.300, 43: 32.200, 44: 33.100, 45: 34.000
},

"0.013": {
    1: 0.013, 2: 0.176, 3: 0.505, 4: 0.946, 5: 1.464, 6: 2.000, 7: 2.700, 8: 3.300, 9: 4.000, 10: 4.700,
    11: 5.400, 12: 6.100, 13: 6.900, 14: 7.700, 15: 8.400, 16: 9.200, 17: 10.000, 18: 10.800, 19: 11.600, 20: 12.400,
    21: 13.300, 22: 14.100, 23: 14.900, 24: 15.800, 25: 16.600, 26: 17.500, 27: 18.300, 28: 19.200, 29: 20.000, 30: 20.900,
    31: 21.800, 32: 22.600, 33: 23.500, 34: 24.400, 35: 25.300, 36: 26.200, 37: 27.000, 38: 27.900, 39: 28.800, 40: 29.700,
    41: 30.600, 42: 31.500, 43: 32.400, 44: 33.300, 45: 34.200
},

"0.015": {
    1: 0.020, 2: 0.190, 3: 0.530, 4: 0.990, 5: 1.520, 6: 2.100, 7: 2.700, 8: 3.400, 9: 4.100, 10: 4.800,
    11: 5.500, 12: 6.300, 13: 7.000, 14: 7.800, 15: 8.600, 16: 9.400, 17: 10.200, 18: 11.000, 19: 11.800, 20: 12.600,
    21: 13.500, 22: 14.300, 23: 15.200, 24: 16.000, 25: 16.900, 26: 17.700, 27: 18.600, 28: 19.500, 29: 20.300, 30: 21.200,
    31: 22.100, 32: 22.900, 33: 23.800, 34: 24.700, 35: 25.600, 36: 26.500, 37: 27.400, 38: 28.300, 39: 29.200, 40: 30.100,
    41: 31.000, 42: 31.900, 43: 32.800, 44: 33.700, 45: 34.600
},


"0.02": {
    1: 0.020, 2: 0.223, 3: 0.602, 4: 1.092, 5: 1.657, 6: 2.300, 7: 2.900, 8: 3.600, 9: 4.300, 10: 5.100, 11: 5.800, 12: 6.600, 
    13: 7.400, 14: 8.200, 15: 9.000, 16: 9.800, 17: 10.700, 18: 11.500, 19: 12.300, 20: 13.200, 21: 14.000, 22: 14.900, 23: 15.800,
     24: 16.600, 25: 17.500, 26: 18.400, 27: 19.300, 28: 20.200, 29: 21.000, 30: 21.900, 31: 22.800, 32: 23.700, 33: 24.600, 
     34: 25.500, 35: 26.400, 36: 27.300, 37: 28.300, 38: 29.200, 39: 30.100, 40: 31.000, 41: 31.900, 42: 32.800, 43: 33.800, 44: 34.700, 45: 35.600
},


"0.03": {
    1: 0.031, 2: 0.282, 3: 0.715, 4: 1.259, 5: 1.875, 6: 2.500, 7: 3.200, 8: 4.000, 9: 4.700, 10: 5.500, 11: 6.300, 12: 7.100, 13: 8.000, 
    14: 8.800, 15: 9.600, 16: 10.500, 17: 11.400, 18: 12.200, 19: 13.100, 20: 14.000, 21: 14.900, 22: 15.800, 23: 16.700, 24: 17.600, 
    25: 18.500, 26: 19.400, 27: 20.300, 28: 21.200, 29: 22.100, 30: 23.100, 31: 24.000, 32: 24.900, 33: 25.800, 34: 26.800, 35: 27.700, 
    36: 28.600, 37: 29.600, 38: 30.500, 39: 31.500, 40: 32.400, 41: 33.400, 42: 34.300, 43: 35.300, 44: 36.200, 45: 37.200
},



"0.05": {
    1: 0.053, 2: 0.381, 3: 0.899, 4: 1.525, 5: 2.218, 6: 3.000, 7: 3.700, 8: 4.500, 9: 5.400, 10: 6.200, 11: 7.100, 12: 8.000,
     13: 8.800, 14: 9.700, 15: 10.600, 16: 11.500, 17: 12.500, 18: 13.400, 19: 14.300, 20: 15.200, 21: 16.200, 22: 17.100, 23: 18.100,
      24: 19.000, 25: 20.000, 26: 20.900, 27: 21.900, 28: 22.900, 29: 23.800, 30: 24.800, 31: 25.800, 32: 26.700, 33: 27.700,
       34: 28.700, 35: 29.700, 36: 30.700, 37: 31.600, 38: 32.600, 39: 33.600, 40: 34.600, 41: 35.600, 42: 36.600, 43: 37.600, 44: 38.600, 45: 39.600
},

"0.07": {
        1: 0.075, 2: 0.470, 3: 1.057, 4: 1.748, 5: 2.504, 6: 3.300, 7: 4.100, 8: 5.000, 9: 5.900, 10: 6.800, 11: 7.700, 12: 8.600, 
        13: 9.500, 14: 10.500, 15: 11.400, 16: 12.400, 17: 13.400, 18: 14.300, 19: 15.300, 20: 16.300, 21: 17.300, 22: 18.200, 
        23: 19.200, 24: 20.200, 25: 21.200, 26: 22.200, 27: 23.200, 28: 24.200, 29: 25.200, 30: 26.200, 31: 27.200, 32: 28.200, 
        33: 29.300, 34: 30.300, 35: 31.300, 36: 32.300, 37: 33.300, 38: 34.400, 39: 35.400, 40: 36.400, 41: 37.400, 42: 38.400,
         43: 39.500, 44: 40.500, 45: 41.500
    },


    "0.1": {
        1: 0.111, 2: 0.595, 3: 1.271, 4: 2.045, 5: 2.881, 6: 3.800, 7: 4.700, 8: 5.600, 9: 6.500, 10: 7.500, 11: 8.500, 12: 9.500,
         13: 10.500, 14: 11.500, 15: 12.500, 16: 13.500, 17: 14.500, 18: 15.500, 19: 16.600, 20: 17.600, 21: 18.700, 22: 19.700,
          23: 20.700, 24: 21.800, 25: 22.800, 26: 23.900, 27: 24.900, 28: 26.000, 29: 27.100, 30: 28.100, 31: 29.200, 32: 30.200,
           33: 31.300, 34: 32.400, 35: 33.400, 36: 34.500, 37: 35.600, 38: 36.600, 39: 37.700, 40: 38.800, 41: 39.900, 42: 40.900, 43: 42.000, 44: 43.100, 45: 44.200
    },

"0.15": {
        1: 0.176, 2: 0.796, 3: 1.602, 4: 2.501, 5: 3.454, 6: 4.400, 7: 5.500, 8: 6.500, 9: 7.600, 10: 8.600, 11: 9.700, 12: 10.800, 
        13: 11.900, 14: 13.000, 15: 14.100, 16: 15.200, 17: 16.300, 18: 17.400, 19: 18.500, 20: 19.600, 21: 20.800, 22: 21.900, 
        23: 23.000, 24: 24.200, 25: 25.300, 26: 26.400, 27: 27.600, 28: 28.700, 29: 29.900, 30: 31.000, 31: 32.100, 32: 33.300, 
        33: 34.400, 34: 35.600, 35: 36.700, 36: 37.900, 37: 39.000, 38: 40.200, 39: 41.300, 40: 42.500, 41: 43.600, 42: 44.800, 43: 45.900, 44: 47.100, 45: 48.200
    },



"0.2": {
        1: 0.250, 2: 1.000, 3: 1.930, 4: 2.950, 5: 4.010, 6: 5.100, 7: 6.200, 8: 7.400, 9: 8.500, 10: 9.700, 11: 10.900, 12: 12.000, 
        13: 13.200, 14: 14.400, 15: 15.600, 16: 16.800, 17: 18.000, 18: 19.200, 19: 20.400, 20: 21.600, 21: 22.800, 22: 24.100,
         23: 25.300, 24: 26.500, 25: 27.700, 26: 28.900, 27: 30.200, 28: 31.400, 29: 32.600, 30: 33.800, 31: 35.100, 32: 36.300, 
         33: 37.500, 34: 38.800, 35: 40.000, 36: 41.200, 37: 42.400, 38: 43.700, 39: 44.900, 40: 46.100, 41: 47.400, 42: 48.600, 43: 49.900, 44: 51.100, 45: 52.300
    },


"0.3": {
        1: 0.429, 2: 1.450, 3: 2.633, 4: 3.890, 5: 5.189, 6: 6.500, 7: 7.900, 8: 9.200, 9: 10.600, 10: 12.000, 11: 13.300, 12: 14.700,
         13: 16.100, 14: 17.500, 15: 18.900, 16: 20.300, 17: 21.700, 18: 23.100, 19: 24.500, 20: 25.900, 21: 27.300, 22: 28.700, 
         23: 30.100, 24: 31.600, 25: 33.000, 26: 34.400, 27: 35.800, 28: 37.200, 29: 38.600, 30: 40.000, 31: 41.500, 32: 42.900, 
         33: 44.300, 34: 45.700, 35: 47.100, 36: 48.600, 37: 50.000, 38: 51.400, 39: 52.800, 40: 54.200, 41: 55.700, 42: 57.100, 43: 58.500, 44: 59.900, 45: 61.300
    }

    };
    
    // Use channelData in your functions as needed
    
    return channelData[callDropProbability];
}


function performCalculations() {
    document.getElementById('results').innerHTML = ''; // Clear previous results
    let errorMessages = []; // To collect error messages

    // Fetch and parse all inputs
    const area = getValue('area');
    const callsPerDay = getValue('callsPerDay');
    const callDuration = getValue('callDuration');
    const baseStationDistance = getValue('baseStationDistance');
    const timeslots = getValue('timeslots');
    const callDropProbability = getValue('callDropProbability');
    const subcarriers = document.getElementById('subcarriers').value; 

    // Validate inputs
    if (area < 0 || callsPerDay < 0 || callDuration < 0 || baseStationDistance < 0 || timeslots < 0 || callDropProbability < 0 || timeslots % 1 !== 0) {
        errorMessages.push('Area, Calls Per Day, Call Duration, Base Station Distance, Time Slots, and Call Drop Probability must be non-negative numbers, and Time Slots must be an integer.');
    }

     if (!isNaN(subcarriers) && (parseFloat(subcarriers) < 0 || parseFloat(subcarriers) % 1 !== 0)) {
        errorMessages.push('Subcarriers must be a non-negative integer and not a decimal number.');
    }

    // Display error messages if any
    if (errorMessages.length > 0) {
        document.getElementById('results').innerHTML = errorMessages.join('<br>'); 
        return; 
    }



    const pathLossExponent = getValue('pathLossExponent');
    const receiverSensitivity = getValue('receiverSensitivity');
    const minimumSIR = convertToDb(getValue('minimumSIR'), getUnit('minimumSIRUnit'));
    const referencePower = convertToDb(getValue('referencePower'), getUnit('referencePowerUnit'));
  





function findNextClusterSize(target) {
    let smallestAboveTarget = Infinity;
    let limit = Math.ceil(Math.sqrt(target)) + 10; // Define a reasonable range to check for i and j

    // Iterate over possible values for i and j
    for (let i = 0; i <= limit; i++) {
        for (let j = 0; j <= limit; j++) {
            let value = i*i + i*j + j*j;
            if (value >= target && value < smallestAboveTarget) {
                smallestAboveTarget = value;
            }
        }
    }

    return smallestAboveTarget; // Return the smallest value found that is >= target
}



    const referencePowerWatt = Math.pow(10, referencePower / 10);
    const d = baseStationDistance / Math.pow((receiverSensitivity * 1e-6 / referencePowerWatt), 1 / pathLossExponent);
    const cellSize = 2.598076211 * Math.pow(d, 2);
    const numberOfCells = area / cellSize;
    const totalTraffic = subcarriers * (callsPerDay / 24) * (callDuration / 60);  // Convert minutes to hours
    const trafficPerCell = totalTraffic / numberOfCells;
    const sirLinear = Math.pow(10, minimumSIR / 10);

    const clusterSize = Math.pow((sirLinear * 6), 2 / pathLossExponent) / 3;
    const clusterSizeAdjusted = findNextClusterSize(clusterSize);



    const requiredChannels = findRequiredChannels(callDropProbability, trafficPerCell);



    const minimumCarriers = requiredChannels / timeslots;


    console.log(`Required Channels: ${requiredChannels}`);
    console.log(`Minimum Carriers: ${minimumCarriers}`);



    // Display results
    let resultsHtml = `
    <p>a) Maximum distance between transmitter and receiver: <b>${d.toFixed(3)}</b> meters</p>
    <p>b) Maximum cell size: <b>${cellSize.toFixed(3)}</b> square meters</p>
    <p>c) Number of cells in the service area: <b>${numberOfCells.toFixed(3)}</b></p>
    <p>d) Total traffic in the system: <b>${totalTraffic.toFixed(3)}</b> Erlangs</p>
    <p>e) Traffic load per cell: <b>${trafficPerCell.toFixed(3)}</b> Erlangs</p>
    <p>f) Number of cells in each cluster: <b>${clusterSize.toFixed(3)}</b> which is <b>${clusterSizeAdjusted}</b></p>
    <p>g) Minimum number of carriers needed: <b>${minimumCarriers.toFixed(3)}</b></p>
`;

    document.getElementById('results').innerHTML = resultsHtml;
}
