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

### General advice for running large tests.

When running large stress tests, your script can't assume anything about the HTTP response. 
Often performance tests are written with a "happy path" in mind.
For example, a "happy path" check like the one below is something that we see in k6 often.

```javascript
let checkRes = check(res, {
    "Homepage body size is 11026 bytes": (r) => r.body.length === 11026,
});
```
Code like this runs fine when the system under test (SUT) is not overloaded and returns proper responses.
When the system starts to fail, the above check won't work as expected. 

The issue here is that the check assumes that there's  always a body in a response. The `r.body` may not exist if server is failing.
In such case the check itself won't work as expected and error similar to the one below will be returned: 

```
ERRO[0625] TypeError: Cannot read property 'length' of undefined
```

To fix this issue your checks must be resilient to any response type. This change will fix the above problem.
```javascript
let checkRes = check(res, {
    "Homepage body size is 11026 bytes": (r) => r.status === 200 && r.body && r.body.length === 11026
});
```


## CPU and memory consumption


#### k6_0.26.2 run -o cloud --vus=20000 --duration=10m --compatibility-mode=base scripts/website.es5.js

```shell
root@m5-4xlarge:/home/ubuntu# while sleep 10; do ps -p `pidof k6` -o %cpu,%mem; done
%CPU %MEM
 698 31.8
%CPU %MEM
 695 31.8
%CPU %MEM
 691 32.0
%CPU %MEM
 689 32.0
%CPU %MEM
 688 32.0
%CPU %MEM
 686 32.0
%CPU %MEM
 686 32.0
%CPU %MEM
 685 32.0
%CPU %MEM
 682 32.0
%CPU %MEM
 680 32.0
%CPU %MEM
 673 32.4
%CPU %MEM
 672 32.4
%CPU %MEM
 671 32.4
%CPU %MEM
 670 32.4
%CPU %MEM
 668 32.4
%CPU %MEM
 665 32.4
%CPU %MEM
 660 32.4
%CPU %MEM
 658 32.4
%CPU %MEM
 656 32.4
%CPU %MEM
 656 32.4
%CPU %MEM
 654 32.7
%CPU %MEM
 649 32.7
%CPU %MEM
 647 32.7
%CPU %MEM
 647 32.7
%CPU %MEM
 646 32.7
%CPU %MEM
 642 32.7
%CPU %MEM
 640 32.7
%CPU %MEM
 639 32.7
%CPU %MEM
 637 32.7
%CPU %MEM
 633 32.7
%CPU %MEM
 632 32.7
%CPU %MEM
 631 32.7
%CPU %MEM
 627 32.7
%CPU %MEM
 626 33.1
%CPU %MEM
 625 33.1
%CPU %MEM
 624 33.1
%CPU %MEM
 620 33.1
```

#### k6_new_executors run -o cloud --vus=20000 --duration=10m --compatibility-mode=base scripts/website.es5.js

```shell
root@m5-4xlarge:/home/ubuntu# while sleep 10; do ps -p `pidof k6_new_executors` -o %cpu,%mem; done
%CPU %MEM
 930 27.8
%CPU %MEM
 899 27.9
%CPU %MEM
 871 28.0
%CPU %MEM
 850 28.2
%CPU %MEM
 832 28.3
%CPU %MEM
 819 28.5
%CPU %MEM
 805 28.6
%CPU %MEM
 794 28.6
%CPU %MEM
 786 29.2
%CPU %MEM
 777 29.2
%CPU %MEM
 768 29.5
%CPU %MEM
 761 29.5
%CPU %MEM
 754 29.5
%CPU %MEM
 748 29.7
%CPU %MEM
 743 29.8
%CPU %MEM
 739 29.8
%CPU %MEM
 734 29.8
%CPU %MEM
 731 29.8
%CPU %MEM
 727 29.8
%CPU %MEM
 724 29.8
%CPU %MEM
 721 29.8
%CPU %MEM
 718 29.8
%CPU %MEM
 714 29.8
%CPU %MEM
 709 29.9
%CPU %MEM
 700 29.9
%CPU %MEM
 697 29.9
%CPU %MEM
 693 29.9
%CPU %MEM
 691 29.9
%CPU %MEM
 688 29.9
%CPU %MEM
 684 29.9
%CPU %MEM
 677 30.1
%CPU %MEM
 675 30.1
%CPU %MEM
 673 30.1
%CPU %MEM
 671 30.1
%CPU %MEM
 669 30.1
%CPU %MEM
 662 30.1
%CPU %MEM
 660 30.1
%CPU %MEM
 658 30.1
%CPU %MEM
 657 30.1
%CPU %MEM
 650 30.1
%CPU %MEM
 648 30.6
%CPU %MEM
 647 30.7
%CPU %MEM
 645 30.7
%CPU %MEM
 639 30.7
%CPU %MEM
 638 30.7
%CPU %MEM
 637 30.7
%CPU %MEM
 632 30.7
%CPU %MEM
 630 30.7
%CPU %MEM
 629 30.7
%CPU %MEM
 628 30.7
%CPU %MEM
 623 30.7
%CPU %MEM
 622 30.7
%CPU %MEM
 621 30.7
%CPU %MEM
 617 30.8
%CPU %MEM
 616 30.8
%CPU %MEM
 615 30.8
%CPU %MEM
 610 30.8
%CPU %MEM
 603 30.8
%CPU %MEM
 594 30.8
%CPU %MEM
 586 30.8

```


#### AWS m5.large
m5.large has 8GB of Ram and 2 CPU cores.

The website.es5.js script can be executed with 6000VUs at about 5.5GB memory and 0.7 CPU load. 

`k6 run -o cloud --vus=6000 --duration=10m --compatibility-mode=base scripts/website.es5.js `

Sample test-run: https://app.k6.io/runs/public/dd48df93cfaa4c3dbd74ac205c6686d3

