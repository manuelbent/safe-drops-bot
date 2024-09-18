import pino from 'pino'

const logger = pino({
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: {
        target: 'pino/file',
        options: {
            destination: './app.log'
        }
    }
})

export default logger
