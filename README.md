# Hardware-sizing for large-scale k6 tests

This is WIP

1. edit main.js (or symlink it)
2. npm run-script webpack
3. Your script is in build/script.es5.js


## Hardware tweaking



```shell
sysctl -w net.ipv4.ip_local_port_range="1024 65535"
sysctl -w net.ipv4.tcp_tw_reuse=1
sysctl -w net.ipv4.tcp_timestamps=1
ulimit -n 250000
```


## k6 execution

`k6 run -o cloud --vus=20000 --duration=10m --compatibility-mode=base scripts/website.es5.js `

### Preliminary Notes


#### AWS m5.large
m5.large has 8GB of Ram and 2 CPU cores.

The website.es5.js script can be executed with 6000VUs at about 5.5GB memory and 0.7 CPU load. 

`k6 run -o cloud --vus=6000 --duration=10m --compatibility-mode=base scripts/website.es5.js `

Sample test-run: https://app.k6.io/runs/public/dd48df93cfaa4c3dbd74ac205c6686d3

