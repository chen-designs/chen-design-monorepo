#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'
import { Command } from 'commander'
import icongen from './icongen'

const program = new Command()

const pkg: any = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'))

program.version(pkg.version).name('@chen-design/scripts').usage('command [options]')

program
	.command('icongen')
	.description('generate icon components.')
	.action(() => icongen())

program.parse(process.argv)
