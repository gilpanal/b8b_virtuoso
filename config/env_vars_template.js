const MODE = 'PROD' // DEV, STAGE, PROD

const ENVIRONMENTS = {
    PROD : {
        TELEGRAM_TOKEN: '',
        DATABASE_URL: ''
    },
    STAGE : {
        TELEGRAM_TOKEN: '',
        DATABASE_URL: ''
    },
    DEV: {
        TELEGRAM_TOKEN: '',
        DATABASE_URL: ''
    }
}

module.exports = {
    TELEGRAM_TOKEN: ENVIRONMENTS[MODE].TELEGRAM_TOKEN,
    DATABASE_URL: ENVIRONMENTS[MODE].DATABASE_URL  
}