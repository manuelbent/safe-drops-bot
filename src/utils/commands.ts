import { promisify } from 'node:util'
import { exec as e } from 'node:child_process'

export const exec = promisify(e)

export const sleep = (s: number) => new Promise(resolve => setTimeout(resolve, s * 1000))
