import { promisify } from 'node:util'
import { exec } from 'node:child_process'

// make exec promise based
const _exec = promisify(exec)

const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000))

export {
    _exec,
    sleep
}
