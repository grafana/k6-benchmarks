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

### Monitor the load-generator server

iftop htop
memor


### Remove unnecessary checks, groups and custom metrics

This is the last resort 
If you are trying to squeeze more performance out of the hardware, you can consider removing checks, 


### reduce iterations. 


## Additional k6 flags to achieve better performance

### --compatibility-mode=base

This setting disables the internal babel transpilation between ES6 to ES5 and inclusion of core.js.

If you are pushing the limits of the hardware, this is the most important k6 setting you can enable.


*Some background:*

> k6 at its core executes ECMAScript 5.1 code. Most k6 script examples and documentation is written in ECMAScript 6+. 
> When k6 gets ES6+ code as an input, it transpiles it to ES5.1 using babel and loads corejs to enable commonly used APIs.
> This works very well for 99% of use cases, but it adds significant overheard with large tests.

To get the best performance out of k6, it's best transpile the scripts outside of k6 using webpack.

In this repository we have prepared an efficient transpilation scheme that produces performant ES5.1 output for k6. 

Use it like this:

1. `git clone https://github.com/loadimpact/k6-hardware-benchmark/`
2. `cd k6-hardware-benchmark`
3. `yarn install`
4. `yarn run to-es5 someplace/yourscript.js`
5. Your ES5.1 script is in `someplace/yourscript.es5.js`

Once your script is transpiled run it like this:
`k6 run -o cloud --compatibility-mode=base someplace/yourscript.es5.js`

### discardResponseBodies

You can tell k6 to not process the body of the response by setting `discardResponseBodies` in the options object like this:
```
export let options = {
	discardResponseBodies: true,
};
```
k6 by default loads the response body of the request into memory. This causes much higher memory consumption
If you are retrieving website data or static assets, 


### --no-thresholds --no-summary 

If you are running a cloud test with local execution (`k6 run -o cloud`), you may want to disable the terminal summary and local threshold calculation because thresholds and summary will be displayed in the cloud. 
This will save you some memory and CPU cycles.


Here are all the mentioned flags, all in one:
k6 run -o cloud --vus=20000 --duration=10m --compatibility-mode=base --no-thresholds --no-summary scripts/website.es5.js

![image](https://user-images.githubusercontent.com/442646/80499911-d408ab80-896d-11ea-83ad-a4f22adccd75.png)



## File upload testing
Special considerations must be taken when testing file-uploads. 

##### Network throughput
The network throughput of the load-generator machine, as well as the SUT will likely be the bottleneck. 

##### Memory
k6 needs a very significant amount of memory when uploading files, as every VU will hold the file in memory.
26MB file upload from the `scripts/file-upload.js` test 

##### Data transfer costs
k6 can upload a large amount data in a very short period of time. Make sure you understand the data transfer costs before commencing a large scale test.

[Outbound Data Transfer is expensive in AWS EC2](https://www.cloudmanagementinsider.com/data-transfer-costs-everything-you-need-to-know/). The price ranges between 0.08 to 0.20 per GB depending on the region. 
If you use the cheapest region the cost is about $0.080 per GB. Uploading 1TB therefore costs about $80. Long running test can cost several hundreds of dollars in data transfer alone.

##### EC2 costs
The AWS EC2 instances are relatively cheap. Even the largest instance we have used in this benchmark m5.24xlarge costs only $4.6 per hour. Make sure to turn off the load-gen servers once you are done with your testing. Forgotten server will cost $3312 per month.  
Tip: it's often possible to launch "spot instances" of the same hardware for 10-20% of the cost. 


### Errors

If you run into errors during the execution, it's good to understand if they were caused by the load-generator or by the failing SUT. 

#### read: connection reset by peer

Error similar to this one is caused by the target system resetting the TCP connection. This happens when the Load balancer or the server itself isn't able to handle the traffic.

```
WARN[0013] Request Failed                                error="Get http://test.k6.io: read tcp 172.31.72.209:35288->63.32.205.136:80: read: connection reset by peer"
```

#### context deadline exceeded

Error like this happens when k6 was able to send a request, but the target system didn't respond in time. The default timeout in k6 is 60 seconds. If your system doesn't produce the response in this timeframe, this error will appear.

```
WARN[0064] Request Failed                                error="Get http://test.k6.io: context deadline exceeded"
```

#### dial tcp 52.18.24.222:80: i/o timeout

This is a similar error to the one above, but in this case k6 wasn't even able to make a request. The target system isn't able to establish a connection.
```
WARN[0057] Request Failed                                error="Get http://pawel.staging.loadimpact.com/static/logo.svg?url=v3: dial tcp 52.18.24.222:80: i/o timeout"
```


Note: you should decide what level of errors is acceptable. At large scale some errors are always present.
If you make 5.000.000 requests with 50 failures, this is genrally a good result (0.0001% errors).



# Benchmarking k6 on AWS hardware

## Real-life test of a website.

Setup:
- All tests were executed on AWS EC2 instances
- The "discardResponseBodies" recommendatio was NOT used. (results would be better with this setting).
- Scripts used for testing are available in the `/scripts` directory. The results are reproducible
- k6 0.26.2 was used 
- Note: the target system (test.k6.io) was pre-scaled for performance before the test. 

The "website.js" test file tries to use many different k6 features. It used plenty of custom metrics, checks, parametrization, thresholds and groups. It's a heavy test that should represent well the "real life" use case.

NOTE: the test.k6.io is a PHP website, not optimized for performance. 

### AWS m5.large server

The `m5.large` instance has 8GB of RAM and 2 CPU cores. 

`sleep(5)`

The following command was used to execute the test
`k6 run -o cloud --vus=6000 --duration=10m --compatibility-mode=base --no-thresholds --no-summary -e TEST_NAME="AWS EC2 m5.large" scripts/website.es5.js`

Results
- Maximum VUS reached: 6000
- Memory used: 6.09 GB  (out of 8.0)
- CPU load (avg): 1.49 (out of 2.0). 
- Peak RPS: ~6000 (note, this test was not optimized for RPS).
https://app.k6.io/runs/720172

### AWS m5.4xlarge
The `m5.4xlarge` instance has 64GB of RAM and 16 CPU cores.
https://app.k6.io/runs/720179

`k6 run -o cloud --vus=20000 --duration=10m --compatibility-mode=base --no-thresholds --no-summary -e TEST_NAME="AWS EC2 m5.4xlarge website test" scripts/website.es5.js`

Results
- Maximum VUS reached: 20.000
- Memory used: 20.1 GB  (out of 61.4)
- CPU load (avg): 8.5 (out of 16.0). 
- Peak RPS: ~20.000 (note, this test was not optimized for RPS).
- `sleep(5)` (in both places)


### AWS m5.24xlarge
The m5.24xlarge has 384GB of RAM and 96 CPU cores.
NOTE: sleep has been reduced to 1s instead of 3s to produce more requests.

`k6 run -o cloud --vus=30000 --duration=5m --compatibility-mode=base --no-thresholds --no-summary -e TEST_NAME="AWS EC2 m5.24xlarge website test" scripts/website.es5.js`

Results
- Maximum VUS reached: 20.000
- Memory used: XXX GB  (out of 370 available)
- CPU load (avg): XXX (out of 96.0). 
- Peak RPS: ~61.500.
- `sleep(1)` (in both places)

## Testing for RPS.

As stated at the beginning, k6 can produce a lot of requests very quickly. 

### AWS m5.24xlarge

Results
- Maximum VUS reached: 30.000
- Memory used: 24 GB  (out of 370 available)
- CPU load (avg): 80 (out of 96.0). 
- Peak RPS: ~188.500.

https://app.k6.io/runs/720216



## File upload - data stress testing.

Results
- Maximum VUS reached: 1.000
- Memory used: 81 GB  (out of 370 available)
- CPU load (avg): 9 (out of 96.0). 
- Network throughput reached *4.7Gbit/s*

https://app.k6.io/runs/720228



# Old notes below
-------------------------------------


#### AWS m5.large
m5.large has 8GB of Ram and 2 CPU cores.

The website.es5.js script can be executed with 6000VUs at about 5.5GB memory and 0.7 CPU load. 

`k6 run -o cloud --vus=6000 --duration=10m --compatibility-mode=base scripts/website.es5.js `

Sample test-run: https://app.k6.io/runs/public/dd48df93cfaa4c3dbd74ac205c6686d3

#### AWS m5.4xlarge

![image](https://user-images.githubusercontent.com/442646/80501377-a886c080-896f-11ea-95b8-ecdab853485d.png)

