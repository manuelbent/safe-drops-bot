import { promisify } from 'node:util'
import { exec } from 'node:child_process'

// make exec promise based
const _exec = promisify(exec)

export {
    _exec
}
