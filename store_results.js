import fetch from 'node-fetch'

const RESULTS_ENPOINT = 'http://localhost:3001/files'

const validClasses = ['guitar', 'drums', 'piano', 'violin', 'vocal', 'female', 'male', 'singing', 'vocals', 'harpsichord', 'flute', 'woman', 'male vocal', 'sitar', 'man', 'classic', 'choir', 'voice', 'male voice', 'female vocal', 'harp', 'cello', 'female voice', 'choral']

function removeExtension(filename) {
    return filename.substring(0, filename.lastIndexOf('.')) || filename;
  }

export async function storeResultsExperiment1(audio, predictionInfo) {

    const labs = Object.keys(predictionInfo.labels)
    let predLabels = []
    for (let label of labs) {

        if (validClasses.includes(label)) {
            predLabels.push(predictionInfo.labels[label])
        }
    }
    predictionInfo.labels = predLabels

    let fetchCurrentData = await fetch(RESULTS_ENPOINT)
    let jsonIs = await fetchCurrentData.json()
    let ExperimentResult = null
    if(!audio.file_name){
        audio.file_name = audio.file_unique_id + '.ogg'
    }
    if (!jsonIs[audio.file_name]) {

        // this is valid due naming of files: <instrument><index>
        let instrument_name = audio.file_name
        instrument_name = removeExtension(instrument_name)
        //remove numbers from file name to get the instrument label
        // Example: harp12 => harp
        instrument_name = instrument_name.replace(/\d+/g, '')

        ExperimentResult = {}
        ExperimentResult['file_name'] = audio.file_name //when file_name is too long Telegram cuts it        
        //ExperimentResult['purpose'] = '' // this prop needs to be set manually later on
        ExperimentResult['instrument'] = instrument_name
        ExperimentResult['mixed'] = false // IMPORTANT! Don't forget set manually to true when required
        ExperimentResult['execs'] = []

    } else {

        ExperimentResult = jsonIs[audio.file_name]
    }
    ExperimentResult['execs'].push(predictionInfo)
    sendPost(ExperimentResult)
}

function sendPost(newPred) {

    fetch(RESULTS_ENPOINT, {
        method: 'POST',
        body: JSON.stringify(newPred),
        headers: { 'Content-Type': 'application/json' }
    }).then(res => res.json())
        .then(json => console.log(json));
}
