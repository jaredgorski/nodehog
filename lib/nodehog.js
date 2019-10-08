class NodeHog {
  constructor(type = 'cpu', lifespan = 300000, deathspan = 300000, iterations = 3) {
    this.type = type.toString() === 'memory' ? 'memory' : 'cpu';
    this.lifespan = parseInt(lifespan, 10) || 300000;
    this.deathspan = parseInt(deathspan, 10) || 300000;
    this.iterations = parseInt(iterations, 10) || 3;
    this.pid = Math.random().toString(36).substr(2, 5);

    this.acc = this.type === 'memory' ? [] : 0;
    this.periodType = this.lifespan > 60000 ? 'minute' : 'second';
    this.period = this.periodType === 'minute' ? 60000 : 1000;
    this.periodCount = 0;

    this.reset = () => {
      this.periodCount = 0;
      delete this.acc;

      if (this.type === 'memory') {
        this.acc = [];
      } else if (this.type === 'cpu') {
        this.acc = 0;
      }

      this.intervals.forEach(interval => clearInterval(interval));
      this.timeouts.forEach(timeout => clearTimeout(timeout));
    };

    this.intervals = [];
    this.timeouts = [];
  }
  
  async start() {
    console.log('\n===========================================\n> Starting new NodeHog [ ' + this.pid + ' ].\n');

    for (let i = 0; i < this.iterations; i++) {
      await this.stress();
      await this.relieve();

      if (i === this.iterations - 1) {
        console.log('\n> Killing NodeHog [ ' + this.pid + ' ].\n-------------------------------------------\n');
      }
    }
  }

  stress() {
    console.log('\n[ ' + this.pid + ' ] --> Stressing ' + this.type.toUpperCase() + '...\n');

    return new Promise(async resolve => {
      const endStress = () => {
        this.reset();
        resolve();
      };

      if (this.type === 'cpu') {
        await this.stressCpu()
        endStress();
      } else if (this.type === 'memory') {
        const endStressGoal = this.lifespan / this.period;
        let endStressInc = 0;
        const maybeEnd = () => {
          if (endStressInc >= endStressGoal) {
            endStress();
          }
        }

        this.intervals.push(setInterval(() => {
          this.periodLogger();
          endStressInc++;
          maybeEnd();
        }, this.period));

        this.stressMemory();
      }
    });
  }

  stressCpu() {
    return new Promise(resolve => {
      const start = Date.now();
      const finish = start + this.lifespan;
      let periodStart = start;
      let periodInc = 0;
      const shouldFinish = () => {
        return Date.now() >= finish;
      }
      const shouldLogPeriod = () => {
        return (Date.now() - periodStart) > this.period;
      }

      while (!shouldFinish()) {
        this.acc += Math.random() * Math.random();

        if (shouldLogPeriod()) {
          periodStart = Date.now();
          periodInc++;
          this.periodLogger();
        }
      }

      this.periodLogger();
      resolve();
    });
  }

  stressMemory() {
    const v8 = require('v8');
    v8.setFlagsFromString('--max_old_space_size=32768');

    const stressMem = () => {
      const {heapTotal, heapUsed} = process.memoryUsage()
      const cushion = 1000;
      const available8Bits = (((heapTotal - heapUsed) / 8) - cushion).toFixed(0);

      if (available8Bits > 0) {
        const heapHog = new Float64Array(available8Bits);
        this.acc.push(heapHog);
      }
    }

    this.intervals.push(setInterval(() => {
      stressMem();
    }, 10));
  }

  relieve() {
    console.log('\n[ ' + this.pid + ' ] --> Relieving...\n');

    return new Promise(resolve => {
      this.timeouts.push(setTimeout(() => {
        this.reset();
        resolve();
      }, this.deathspan));
    });
  }

  periodLogger() {
    this.periodCount++;

    const plural = this.periodCount > 1 ? 's' : '';
    console.log('[ ' + this.pid + ' ] ----> ' + 
      this.periodCount + 
      ' ' + 
      this.periodType + 
      plural + 
      ' of stress period complete.'
    );
  }
}

module.exports = NodeHog;
module.exports.default = NodeHog;

