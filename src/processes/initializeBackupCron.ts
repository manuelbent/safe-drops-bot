import fs from 'fs'
import path from 'path'
import cron from 'node-cron'

import { exec, mkdir } from '../utils/commands'
import logger from '../utils/logger'

import R2Service from '../services/R2Service'

/**
 * @description Delete backup files older than specified days
 * @param backupDir - Directory containing backup files
 * @param maxDays - Maximum number of days to keep backups
 */
const cleanupOldBackups = async (backupDir: string, maxDays: number): Promise<void> => {
    try {
        const files = fs.readdirSync(backupDir)
        const now = Date.now()
        const maxAge = maxDays * 24 * 60 * 60 * 1000 // Convert days to milliseconds

        for (const file of files) {
            if (file.startsWith('db-backup-') && file.endsWith('.sqlite')) {
                const filePath = path.join(backupDir, file)
                const stats = fs.statSync(filePath)
                const age = now - stats.mtimeMs

                if (age > maxAge) {
                    fs.unlinkSync(filePath)
                    logger.info(`Deleted old backup: ${file}`)
                }
            }
        }
    } catch (error) {
        logger.error(error, 'Failed to cleanup old backups')
    }
}

/**
 * @description Initialize the backup cron job to run daily at midnight.
 * Performs a backup of the SQLite database using SQLite's native backup command.
 */
export default async (): Promise<void> => {
    const r2Service = new R2Service()
    logger.info('Initializing database backup cron job...')

    // Schedule backup to run every day at midnight (00:00)
    cron.schedule('0 0 * * *', async () => {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
            const sourceFile = path.join('/data', 'db.sqlite')
            const backupDir = path.join('/tmp', 'safe-drops-backups')
            const backupFile = path.join(backupDir, `db-backup-${timestamp}.sqlite`)

            // Create backup directory if it doesn't exist
            if (!fs.existsSync(backupDir)) {
                await mkdir(backupDir, { recursive: true })
                logger.info(`Created backup directory: ${backupDir}`)
            }

            // Check if source database exists
            if (!fs.existsSync(sourceFile)) {
                logger.error(`Source database not found: ${sourceFile}`)
                return
            }

            // Perform the backup using SQLite's native backup command
            const backupCommand = `sqlite3 "${sourceFile}" ".backup '${backupFile}'"`
            await exec(backupCommand)
            logger.info(`Database backup completed successfully: ${backupFile}`)

            await r2Service.upload(
                await fs.promises.readFile(backupFile),
                'application/vnd.sqlite3',
                path.basename(backupFile),
                ''
            )
            logger.info('Database backup uploaded successfully to R2')

            await cleanupOldBackups(backupDir, 30)
        } catch (error) {
            logger.error(error, 'Failed to backup database')
        }
    }, {
        timezone: 'UTC'
    })

    logger.info('Database backup cron job initialized')
}
