import fetch from 'node-fetch'

const RESULTS_ENPOINT = 'http://localhost:3001/files'

const validClasses = ['guitar', 'drums', 'piano', 'violin', 'vocal', 'female', 'male', 'singing', 'vocals', 'harpsichord', 'flute', 'woman', 'male vocal', 'sitar', 'man', 'classic', 'choir', 'voice', 'male voice', 'female vocal', 'harp', 'cello', 'female voice', 'choral']

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

    if (!jsonIs[audio.file_name]) {

        ExperimentResult = {}
        ExperimentResult['file_name'] = audio.file_name //when file_name is too long Telegram cuts it        
        ExperimentResult['purpose'] = ''
        ExperimentResult['instrument'] = ''
        ExperimentResult['mixed'] = false
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
