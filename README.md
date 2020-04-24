# Hardware-sizing for large-scale k6 tests

This is WIP

1. edit main.js (or symlink it)
2. npm run-script webpack
3. Your script is in build/script.es5.js



### Preliminary Notes


#### AWS m5.large
m5.large has 8GB of Ram and 2 CPU cores.

The website.es5.js script can be executed with 6000VUs at about 5.5GB memory and 0.7 CPU load. 


`k6 run -o cloud --compatibility-mode=base website.es5.js`

Sample test-run: https://app.k6.io/runs/public/dd48df93cfaa4c3dbd74ac205c6686d3
