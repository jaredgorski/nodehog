class NodeHog {
  constructor(type, lifespan, deathspan, iterations) {
    this.type = type.toString() === 'memory' ? 'memory' : 'cpu';
    this.lifespan = parseInt(lifespan, 10) || 300000;
    this.deathspan = parseInt(deathspan, 10) || 600000;
    this.iterations = parseInt(iterations, 10) || 10;
    this.pid = Math.random().toString(36).substr(2, 5);
  }
  
  async start() {
    console.log('\n===========================================\n> Starting new NodeHog [ ' + this.pid + ' ].\n');

    for (let i = 0; i < this.iterations; i++) {
      this.stress();
      await this.relieve();

      if (i === this.iterations - 1) {
        console.log('\n> Killing NodeHog [ ' + this.pid + ' ].\n-------------------------------------------\n');
      }
    }
  }

  stress() {
    const periodType = this.lifespan > 60000 ? 'minute' : 'second';
    const period = periodType === 'minute' ? 60000 : 1000;
    let start = Date.now(),
      now = start,
      loggerInc = start,
      periodCount = 0,
      acc = this.type === 'memory' ? [] : 0;

    const resource = this.type === 'memory' ? 'MEMORY' : 'CPU';
    console.log('\n[ ' + this.pid + ' ] --> Stressing ' + resource + '...\n');

    const logger = (force) => {
      const timeDiff = now - loggerInc;

      if (timeDiff > period || force) {
        periodCount++;
        const plural = periodCount > 1 ? 's' : '';

        console.log('[ ' + this.pid + ' ] ----> ' + 
          periodCount + 
          ' ' + 
          periodType + 
          plural + 
          ' of stress period complete.');

        loggerInc = Date.now();
      }
    };
    
    while (now - start < this.lifespan) {
      if (this.type === 'memory') {
        const {heapTotal, heapUsed} = process.memoryUsage()
        const available8Bits = (heapTotal - heapUsed) / 8;

        if (available8Bits) {
          const heapHog = new Float64Array(available8Bits);
          acc.push(heapHog);
        }
      } else if (this.type === 'cpu') {
        acc += Math.random() * Math.random();
      }

      logger();
      now = Date.now();
    }

    logger(true);
  }

  relieve() {
    console.log('\n[ ' + this.pid + ' ] --> Relieving...\n');

    return new Promise(resolve => {
      setTimeout(resolve, this.deathspan);
    });
  }
}

module.exports = NodeHog;
module.exports.default = NodeHog;

