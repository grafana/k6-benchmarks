# WIP WIP WIP

This document is work in progress. 

# Hardware-sizing for large-scale k6 tests

This document explains how to launch a large k6 test on a single machine without the need of distributed execution. 

The common misconception of many load-testers is that distributed-execution (ability to launch a load test on multiple machines) is required to generate large load. This is not the case with k6.

k6 is different from many other load-testing tools in a way it handles hardware resources. A single k6 process will efficiently use all CPU cores on a load-generator machine.
Single instance of k6 is often enough to generate load of 30.000-40.000 simultaneus users (VUs). This amount of VUs can generate upwards of 300.000 requests per second (RPS). 

Unless you need more than 100.000-300.000 requests per second, a single instance of k6 will likely be sufficient for your needs.

Below we will explore what hardware is needed for generating different levels of load.


## OS finetuning for maximum performance

For the purpose of this demonstration, we are using a Linix (Ubuntu Server) machine. The instructions will be the same for any Linux distribution. This has not been tested on Windows or MacOS.

The following configuration changes are required to allow the k6 instance to use the full network capacity of the server.
Detailed information about these settings can be found in our [OS Fine tuning article](https://k6.io/docs/misc/fine-tuning-os).

```shell
sysctl -w net.ipv4.ip_local_port_range="1024 65535"
sysctl -w net.ipv4.tcp_tw_reuse=1
sysctl -w net.ipv4.tcp_timestamps=1
ulimit -n 250000
```

For quick testing, you can paste these commands in the root terminal window. To make these changes permanent, refer to the instructions of your Linux distribution.


### Hardware considerations

#### Network
Network throughput of the machine is an important consideration when running large tests. Many AWS EC2 machines come with 1Gbit/s connection which may limit the amount of load k6 can generate.

When running the test, you can use `iftop` in the terminal to view in real time the amount of network traffic generated. If the traffic is constant at 1Gbit/s, your test is probably limited by the network card. Consider upgrading to a different EC2 instance.

FIXME: better screenshot.
![image](https://user-images.githubusercontent.com/442646/80501039-3e6e1b80-896f-11ea-9fa3-3d97a4a08ffd.png)

In my tests the m5.4xlarge instance is capped at about 1Gbit/s network throughput on average. Amazon claims that it can do "up to 10Gbit/s", but that number is not guaranteed. 


#### CPU
Unlike many other load testing tools, k6 is heavily multithreaded. It will effectively use all available CPU cores.

The amount of CPU you need depends on your test file (sometimes called test script). 
Regarless of the test file, you can assume that large tests require significant amount of CPU power. We recommend that you size the machine to have at least 20% idle cycles (up to 80% used by k6, 20% idle). If k6 uses 100% to generate load, it won't have enough CPU to measure the responses correctly. This may result in result metrics to have much larger response time than in reality.

#### Memory
k6 likes memory, but [it isn't as greedy as other load testing tools](https://k6.io/blog/comparing-best-open-source-load-testing-tools#memory-usage). 
Memory consumption heavily depend on your test scenarios. To estimate the memory requirement of your test, run the test on your laptop with 100VUs and multiply the consumed memory by the target number of VUs. 

Simple tests will use ~3-5MB per VU. (1000VUs = 3-10GB). 
Tests that are using file-uploads can consume tens of megabytes per VU.

## k6 execution

`k6 run -o cloud --vus=20000 --duration=10m --compatibility-mode=base scripts/website.es5.js `

## General advice for running large tests.

### Make your test code resilient

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

## Additional k6 flags to achieve better performance

### --compatibility-mode=base

If you are pushing the limits of the hardware, this is the most important k6 setting you can enable.



1. edit main.js (or symlink it)
2. npm run-script webpack
3. Your script is in build/script.es5.js


### --no-thresholds --no-summary 

If you are running a cloud test with loacal execution (`k6 run -o cloud`), you may want to disable the terminal summary and local threshold calculation because thresholds and summary will be displayed in the cloud. 
This will save you some memory and CPU cycles.



Here aer all the mentioned flags, all in one:
k6 run -o cloud --vus=20000 --duration=10m --compatibility-mode=base --no-thresholds --no-summary scripts/website.es5.js

![image](https://user-images.githubusercontent.com/442646/80499911-d408ab80-896d-11ea-83ad-a4f22adccd75.png)



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

#### AWS m5.4xlarge

![image](https://user-images.githubusercontent.com/442646/80501377-a886c080-896f-11ea-95b8-ecdab853485d.png)


#### File upload - data stress testing.

Special considerations must be taken when testing file-uploads. 

#### Network throughput

The network throughput of the load-generator machine, as well as the SUT will likely be the bottleneck.

#### Memory
k6 needs a very significant amount of memory when uploading files, as every VU will hold the file in memory.
26MB file upload from the `scripts/file-upload.js` test 

#### Data transfer costs
k6 can upload a large amount data in a very short period of time. Make sure you understand the data transfer costs before commencing a large scale test.

[Outbound Data Transfer is expensive in AWS EC2](https://www.cloudmanagementinsider.com/data-transfer-costs-everything-you-need-to-know/). The price ranges between 0.08 to 0.20 per GB depending on the region. 
If you use the cheapest region the cost is about $0.080 per GB. Uploading 1TB therefore costs about $80. Long running test can cost several hundreds of dollars in data transfer alone.


### spot instances are much cheaper.
TODO

# Script preparation


1. edit main.js (or symlink it)
2. npm run-script webpack
3. Your script is in build/script.es5.js

