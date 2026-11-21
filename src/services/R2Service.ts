import path from 'path'
import { randomUUID } from 'crypto'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

/**
 * Uploads files to a private Cloudflare R2 bucket.
 */
export default class R2Service {
    private readonly client: S3Client
    private readonly bucket: string

    /**
     * Creates an R2 client using the configured bucket credentials.
     * @throws If required R2 environment variables are missing or blank
     */
    constructor() {
        const accountId = process.env.R2_ACCOUNT_ID
        if (!accountId) {
            throw new Error('R2_ACCOUNT_ID environment variable is not set.')
        }

        const accessKeyId = process.env.R2_ACCESS_KEY_ID
        if (!accessKeyId) {
            throw new Error('R2_ACCESS_KEY_ID environment variable is not set.')
        }

        const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY
        if (!secretAccessKey) {
            throw new Error('R2_SECRET_ACCESS_KEY environment variable is not set.')
        }

        const bucket = process.env.R2_BUCKET_NAME
        if (!bucket) {
            throw new Error('R2_BUCKET_NAME environment variable is not set.')
        }

        this.bucket = bucket
        this.client = new S3Client({
            region: 'auto',
            endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
            credentials: { accessKeyId, secretAccessKey },
            requestChecksumCalculation: 'WHEN_REQUIRED',
        })
    }

    /**
     * Uploads a file with a unique prefix to the specified bucket folder.
     * @param buffer - Contents of the file
     * @param mimetype - MIME type of the file
     * @param originalName - Original filename
     * @param folder - Destination folder in the bucket
     * @throws If the upload fails
     */
    public async upload(buffer: Buffer, mimetype: string, originalName: string, folder: string): Promise<void> {
        const key = path.posix.join(folder, `${randomUUID()}-${path.basename(originalName)}`)

        await this.client.send(new PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            Body: buffer,
            ContentType: mimetype,
            ContentLength: buffer.length
        }))
    }
}
