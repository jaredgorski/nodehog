#!/usr/bin/env node
const NodeHog = require('./lib/nodehog.js');
new NodeHog(process.argv[2], process.argv[3], process.argv[4]).start();
