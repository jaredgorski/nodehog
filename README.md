# NodeHog <img align="left" height="100" src="https://raw.githubusercontent.com/jaredgorski/nodehog/master/.media/nodehog.png">
A simple cpu hog utility.

## Usage
### CLI
```shell
╔══════════════════════════════════╗
║  nodehog     30000     60000     10 ║
╚══════════════════════════════════╝
     |          |         |        |
     |          |         |        |
  command       |         |        |
           lifespan(ms)   |        |
                    deathspan(ms)  |
                              iterations
```
### Programmatically
```js
const NodeHog = require('nodehog');

new NodeHog(30000, 60000, 10).start();
```
