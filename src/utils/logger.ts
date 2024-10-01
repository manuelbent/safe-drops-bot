import pino from 'pino'

const logger = pino({
    level: 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    transport: process.env.ENV !== 'dev' ? {
        target: 'pino/file',
        options: {
            destination: './app.log'
        }
    } : undefined
})

export default logger
