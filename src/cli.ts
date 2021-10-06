#!/usr/bin/env node

import { runmake } from '.';

runmake('.', ...process.argv.slice(2));
