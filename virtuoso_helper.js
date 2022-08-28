/* https://github.com/crs4/virtuoso-sparql-client#insertion-triples */
import { Node, Data, Triple } from 'virtuoso-sparql-client'
import { owl } from './bot.js'
import {storeResultsExperiment1} from './store_results.js'

const prf = 'b8b:'

class Virtuoso_Helper {

    constructor(saveclient) {

        this.saveclient = saveclient
    }
    async store(chat_id, message, predictionInfo) {
        if(message.voice || message.document){
            message['audio'] = message.voice || message.document
        }
        message.audio['message_id'] = message.message_id
        message.audio['date'] = message.date

        // if we don't want to do B8B Analisis just comment the line below       
        // It overrides the predictionInfo with only the instruments, which means
        // other labels not related to instruments will be added (classical, strings, etc)
        predictionInfo = await storeResultsExperiment1(message.audio,predictionInfo)
        delete message.message_id;
        delete message.date;

        const labelsInfo = predictionInfo.labels
        delete predictionInfo.labels

        await this.insertAudioProjectInfo(chat_id, message.chat)
        await this.insertAudioTrackInfo(chat_id, message)
        await this.insertUserInfo(message.audio.file_unique_id, message.from)
        await this.insertPredictionInfo(message.audio.file_unique_id, predictionInfo)
        const labs = Object.keys(labelsInfo)
        for (let label of labs) {
            await this.insertLabelInfo(predictionInfo.predict_id, labelsInfo[label])
        }
        let status = 'Something went with Virtuoso!'
        // false/true => verbose
        await this.saveclient.store(false).then((result) => {
            //console.log(result)
            if (result[0].statusCode) {
                status = 'Virtuoso: ' + result[0].statusMessage
            } else {
                status = 'Succesfully stored in Virtuoso!'
            }
        }).catch((err) => {
            console.log(err)
        })

        return status

    }

    async insertAudioProjectInfo(id, audioproject) {
        await this.saveclient.getLocalStore().add(
            new Triple(
                new Node(owl + id),
                'rdf:type',
                prf + 'AudioProject'
            )
        )
        await this.insertIterObjProps(id, audioproject)
    }

    // Insert property "instrument" as a relationship between AudioProject and AudioTrack
    async insertAudioTrackInfo(id, message) {
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + id,
                prf + 'instrument',
                prf + message.audio.file_unique_id
            )
        )
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + message.audio.file_unique_id,
                'rdf:type',
                prf + 'AudioTrack'
            )
        )
        await this.insertIterObjProps(message.audio.file_unique_id, message.audio)
    }

    // Insert property "performed" as a relationship between AudioTrack and User
    async insertUserInfo(id, from) {
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + id,
                prf + 'performed',
                prf + from.id
            )
        )
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + from.id,
                'rdf:type',
                prf + 'User'
            )
        )
        await this.insertIterObjProps(from.id, from)
    }
    // Insert property "prediction" as a relationship between AudioTrack and Prediction
    async insertPredictionInfo(id, prediction) {
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + id,
                prf + 'prediction',
                prf + prediction.predict_id
            )
        )
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + prediction.predict_id,
                'rdf:type',
                prf + 'Prediction'
            )
        )
        await this.insertIterObjProps(prediction.predict_id, prediction)
    }

    // Insert property "label" as a relationship between Prediction and Label
    async insertLabelInfo(id, label) {
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + id,
                prf + 'label',
                prf + label.label_id
            )
        )
        await this.saveclient.getLocalStore().add(
            new Triple(
                prf + label.label_id,
                'rdf:type',
                prf + 'Label'
            )
        )
        await this.insertIterObjProps(label.label_id, label)
    }

    isFloat(value) {
        if (
            typeof value === 'number' &&
            !Number.isNaN(value) &&
            !Number.isInteger(value)
        ) {
            return true;
        }

        return false;
    }

    async insertIterObjProps(id, obj) {
        const props = Object.keys(obj)
        for (let prop of props) {

            let xsdType = 'xsd:'
            if (typeof obj[prop] === 'number') {
                if (this.isFloat(obj[prop])) {
                    xsdType += 'float'
                } else {
                    xsdType += 'integer'
                }
                obj[prop] = obj[prop].toString()
            } else {
                xsdType += typeof obj[prop]
            }
            await this.saveclient.getLocalStore().add(
                new Triple(
                    prf + id,
                    prf + prop,
                    new Data(obj[prop], xsdType)
                )
            )
        }
    }

}

export default Virtuoso_Helper