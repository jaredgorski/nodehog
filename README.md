# NodeHog <img align="left" height="100" src="https://raw.githubusercontent.com/jaredgorski/nodehog/master/.media/nodehog.png">
A simple cpu hog utility.

![](https://raw.githubusercontent.com/jaredgorski/nodehog/master/.media/nodehog_example.png)

## Installation
#### Local use
```shell
npm i -g nodehog
```
#### Project use
```shell
npm i nodehog
```

## Usage
This program can be used to create scheduled stress tests on a given target. Use cases include testing program performance under max CPU load, testing recovery from max CPU load, and testing virtual autoscaling features such as the Kubernetes horizontal pod autoscaler.

### Parameters
- **Type:** The type of resource to stress _(memory | cpu)_
- **Lifespan:** The length of the stress period in milliseconds
- **Deathspan:** The length of the relief period in milliseconds
- **Iterations:** The number of cycles to complete before NodeHog exits _(1 cycle = 1 lifespan + 1 deathspan)_

#### CLI
```shell
$ nodehog memory 30000 15000 20

╔═════════════════════════════════════════════════/
║  nodehog     cpu      30000     60000     10
╚═══════════════════════════════════════════════/
     |          |         |         |       |
     |          |         |         |       |
  command       |         |         |       |
               type       |         |       |
                     lifespan(ms)   |       |
                             deathspan(ms)  |
                                        iterations
```
#### Programmatically
```js
const NodeHog = require('nodehog');

new NodeHog('memory', 30000, 60000, 10).start();
```

---

If you find this useful, leave a star! If it can be improved in any way for your use case, fork it, send a PR, or just let me know 😃
