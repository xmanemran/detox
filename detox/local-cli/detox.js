#!/usr/bin/env node

const program = require('commander');
const detoxCommands = require('../src/cli/commands');

program.arguments('<process>');

for (const command of detoxCommands) {
    const { name, description } = command;
    program.command(name, description);
}

program.parse(process.argv);
