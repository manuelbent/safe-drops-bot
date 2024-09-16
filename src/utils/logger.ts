import pino from 'pino'

const logger = pino({
    level: 'info',
    transport: {
        target: 'pino/file',
        options: {
            destination: './app.log'
        }
    }
})

export default logger
