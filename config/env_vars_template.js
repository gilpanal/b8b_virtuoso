const MODE = 'DEV' // DEV, STAGE, PROD

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

export default  {
    TELEGRAM_TOKEN: ENVIRONMENTS[MODE].TELEGRAM_TOKEN,
    DATABASE_URL: ENVIRONMENTS[MODE].DATABASE_URL  
}