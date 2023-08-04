# Usage

This document explains how to benchmark k6 using the scripts found in this repository.


## Prerequisites

Before running anything, we first need to create a suitable environment for running the benchmarks.


## System under test (SUT)

The SUT needs to be very performant and scaled appropriately to handle the significant amount of traffic the benchmarks will generate. Going by [previous benchmark results](/results), this roughly means it needs to handle at least 60,000 VUs and 160,000 RPS, with the ability to saturate a 10 Gbps network link. Ideally it should have ample capacity beyond this, as we don't want the benchmark results to be limited by the SUT performance.

Unfortunately, our public facing sites https://test.k6.io/, https://test-api.k6.io/, and https://httpbin.test.k6.io/ are not suitable for this with their default deployment. For the v0.42.0 test, we received help from the DevOps/Platform team who made a secondary larger deployment of test.k6.io specifically for running the benchmarks, but this was temporary and was shut down as soon as the tests ended, to avoid incurring infrastructure costs. For a scenario where we continuously run benchmarks for every k6 version, this deployment needs to be properly defined (e.g. in Terraform), and the k6-core team should have access to start, stop and scale it as needed.

It's also important for the SUT performance to ideally be stable across benchmark runs. That is, if the SUT performance varies wildly between each k6 benchmark, then it entirely invalidates the purpose of keeping historical benchmark results, since we wouldn't be able to compare the results and detect if an improvement or degradation in performance is due to a change in k6, or a change in the SUT. Failing this, we would need to re-run all previous benchmarks each time, which would be laborious and time intensive, so it's best if the exact same SUT application and deployment is done each time.


## Load generators

We run the benchmarks on a variety of system configurations to showcase how k6 performs under different conditions. We've used AWS EC2 machines with the following specifications:

- `m5.large`: 2 vCPU cores, 8GB RAM

- `m5.4xlarge`: 16 vCPU cores, 64GB RAM

- `m5.24xlarge`: 96 vCPU cores, 384GB RAM

The operating system shouldn't matter, but it should be consistent across all benchmarks, and in the past we used the latest stable version of Debian Linux.

Note that we're deliberately not using distributed execution, but running k6 from a single node at a time. The goal of the benchmarks is not to load test the SUT, but to measure k6 performance on a single machine.


## OS performance tweaks

Before running the benchmarks it's important that some operating system configuration changes are done on the load generator machines to ensure k6 can fully utilize all system resources. This includes increasing the network connection limit and local port range, disabling swap space, among others.

Please consult the [OS fine-tuning section of the "Running large tests"](https://k6.io/docs/testing-guides/running-large-tests/#os-fine-tuning) article for details.


## Test scripts

We currently have 3 k6 [scripts](/scripts) we will run:

- `website.js`: a general purpose script that replicates common real-world scenarios: loading the front page and static assets, and logging in using some predefined credentials. It uses popular k6 features, such as custom metrics, checks, thresholds and `sleep()`.
  The purpose of this script is not to achieve the highest RPS, but to track general performance.

- `RPS-optimized.js`: a simple script that tries to achieve the highest possible RPS.

- `file-upload.js`: a script that uploads a large file, used to track memory usage and network throughput.


## Helper scripts

We use a couple of scripts to help us with running the benchmarks and compiling the results:

- [k6bench.sh](/k6bench.sh): this is a wrapper script around `k6 run` that starts k6 and the metric collection processes in the background.
  It redirects the k6 output to a file, and outputs metric results to stdout in CSV format every 5 seconds by default.

- [k6bench.gnuplot](/k6bench.gnuplot): this is a [gnuplot](http://www.gnuplot.info/) script that generates a graph from the CSV results created by `k6bench.sh`.
  It doesn't create the prettiest graphs, but it was chosen because it's scriptable, so it can be easily automated.


## Dependencies

The benchmarks depend on a few utilities to collect the performance results:

- [`smem`](https://www.selenic.com/smem/) for RAM usage, specifically proportional set size (PSS).

  As it turns out, it's rather tricky to determine the precise physical RAM usage of a single process in Linux. Tools like `ps` and `htop` report the resident set size (RSS), which includes the size of any shared libraries the process may be using, and is not an accurate value of how much physical memory the process is using. The PSS value is more precise, but is more difficult to measure. `smem` is seemingly the only tool that simplifies tracking this, but it's unfortunately written in Python, so its own performance is not great, and it can use a lot of CPU and take some time to generate the result.

- [`jq`](https://stedolan.github.io/jq/) is used to extract the VUs and RPS values from the JSON output returned by the k6 REST API.

- [`curl`](https://curl.se/) to make requests to the k6 REST API.

- GNU `coreutils` like `ps`, `top`, `cat`, `awk`, and Bash itself, of course.


## Benchmarking strategy

We will run one test at a time, to avoid overloading the SUT and skewing the results.

We won't run all scripts on all machines, but will use the following strategy:

- From the machine with the lowest specs, i.e. `m5.large`, we will only run the `website.js` script, with a high sleep time between iterations in order to not overwhelm the load generator. The goal of this test is to track overall CPU and memory usage, not reach maximum throughput.

- From the middle-spec'd machine, i.e. `m5.4xlarge`, we will run the `website.js` script with more VUs and a lower sleep time between iterations. This way we can observe the change in resource consumption and throughput by using the same script with an increased load.

- From the machine with the highest specs, i.e. `m5.24xlarge`, we will run the `website.js` script with even more VUs and a very low sleep time between iterations. We will also run the RPS optimized and file upload test scripts, so we can observe the performance of k6 when it's allowed to fully utilize the system resources.


## Running the benchmarks

Assuming we have the testing environment ready, we can now proceed to run the benchmarks themselves.

1. Establish an SSH connection to the load generator machine you wish to use first.

2. Install k6 and all dependencies for running the benchmarks. Ideally these would be pre-installed in the load generator system image by Ansible, but if not, let's install them manually:
   ```shell
   sudo apt update
   sudo apt install -y curl git iftop htop jq nmon smem zip
   K6_VERSION=v0.45.0
   curl -fsSL -o - "https://github.com/grafana/k6/releases/download/$K6_VERSION/k6-$K6_VERSION-linux-amd64.tar.gz" \
     | sudo tar -C /usr/local/bin/ --strip-components 1 -xzf - k6-$K6_VERSION-linux-amd64/k6
   ```

   Some of these like `iftop` and `nmon` are not strictly required, but are useful to monitor the system resources while the test is running.

3. Clone this repository, enter it and create the results directory:
   ```shell
   git clone https://github.com/grafana/k6-benchmarks.git
   cd k6-benchmarks
   mkdir results/$K6_VERSION
   ```

4. Run the benchmark(s), depending on the machine you're connected to.

   a. If you're on the lowest spec'd machine, run the `website.js` script with the following command:
      ```shell
      ./k6bench.sh --vus=6000 --duration=10m -e SLEEP=5 scripts/website.js \
        | tee results/$K6_VERSION/m5.large-website.js-10s.csv
      ```

   b. If you're on the middle spec'd machine, run the `website.js` script with the following command:
      ```shell
      ./k6bench.sh --vus=20000 --duration=10m -e SLEEP=3 scripts/website.js \
        | tee results/$K6_VERSION/m5.4xlarge-website.js-6s.csv
      ```

   c. If you're on the highest spec'd machine, run the `website.js` script with the following command:
      ```shell
      ./k6bench.sh --vus=30000 --duration=5m -e SLEEP=0.5 scripts/website.js \
        | tee results/$K6_VERSION/m5.24xlarge-website.js-1s.csv
      ```

      Run the `RPS-optimized.js` script with the following command:
      ```shell
      ./k6bench.sh --vus=60000 --duration=1m scripts/RPS-optimized.js \
        | tee results/$K6_VERSION/m5.24xlarge-RPS-optimized.js.csv
      ```

      Generate the 26MB.zip file used by the `file-upload.js` script:
      ```shell
      (cd scripts/ && dd if=/dev/urandom of=26MB bs=1M count=25 && zip 26MB 26MB && rm -f 26MB)
      ```

      Run the `file-upload.js` script with the following command:
      ```shell
      ./k6bench.sh --vus=1000 --duration=1m scripts/file-upload.js \
        | tee results/$K6_VERSION/m5.24xlarge-file-upload.js.csv
      ```

5. Generate the graphs from the results.

   First change to the results directory with:
   ```shell
   cd results/$K6_VERSION
   ```

   Then:

   a. If you're on the lowest spec'd machine, run:
      ```shell
      gnuplot -e "k6version='$K6_VERSION'"; ec2instance='m5.large'; script='website.js-10s'" ../../k6bench.gnuplot
      ```
      This will generate a `m5.large-website.js-10s.png` file.

   b. If you're on the middle spec'd machine, run:
      ```shell
      gnuplot -e "k6version='$K6_VERSION'"; ec2instance='m5.4xlarge'; script='website.js-6s'" ../../k6bench.gnuplot
      ```
      This will generate a `m5.4xlarge-website.js-6s.png` file.

   c. If you're on the highest spec'd machine, run:
      ```shell
      gnuplot -e "k6version='$K6_VERSION'"; ec2instance='m5.24xlarge'; script='website.js-1s'" ../../k6bench.gnuplot
      ```
      This will generate a `m5.24xlarge-website.js-1s.png` file.

      ```shell
      gnuplot -e "k6version='$K6_VERSION'; ec2instance='m5.24xlarge'; script='RPS-optimized.js'" ../../k6bench.gnuplot
      ```
      This will generate a `m5.24xlarge-RPS-optimized.js.png` file.

      ```shell
      gnuplot -e "k6version='$K6_VERSION'; ec2instance='m5.24xlarge'; script='file-upload.js'" ../../k6bench.gnuplot
      ```
      This will generate a `m5.24xlarge-file-upload.js.png` file.


6. At this point the `results/$K6_VERSION/` directory should look something like this:
   ```shell
   -rw-r--r-- 1 ivan ivan  719 Feb 10 12:42 m5.24xlarge-file-upload.js.csv
   -rw-r--r-- 1 ivan ivan  65K Feb 10 12:42 m5.24xlarge-file-upload.js.png
   -rw-r--r-- 1 ivan ivan 117K Feb 10 12:42 m5.24xlarge-file-upload.js.txt
   -rw-r--r-- 1 ivan ivan  614 Feb 10 12:42 m5.24xlarge-RPS-optimized.js.csv
   -rw-r--r-- 1 ivan ivan  82K Feb 10 12:42 m5.24xlarge-RPS-optimized.js.png
   -rw-r--r-- 1 ivan ivan  11K Feb 10 12:42 m5.24xlarge-RPS-optimized.js.txt
   -rw-r--r-- 1 ivan ivan 2.6K Feb 10 12:42 m5.24xlarge-website.js-1s.csv
   -rw-r--r-- 1 ivan ivan  90K Feb 10 12:42 m5.24xlarge-website.js-1s.png
   -rw-r--r-- 1 ivan ivan  45K Feb 10 12:42 m5.24xlarge-website.js-1s.txt
   -rw-r--r-- 1 ivan ivan 5.2K Feb 10 12:42 m5.4xlarge-website.js-6s.csv
   -rw-r--r-- 1 ivan ivan 106K Feb 10 12:42 m5.4xlarge-website.js-6s.png
   -rw-r--r-- 1 ivan ivan  80K Feb 10 12:42 m5.4xlarge-website.js-6s.txt
   -rw-r--r-- 1 ivan ivan 4.8K Feb 10 12:42 m5.large-website.js-10s.csv
   -rw-r--r-- 1 ivan ivan 112K Aug  4 15:31 m5.large-website.js-10s.png
   -rw-r--r-- 1 ivan ivan  78K Feb 10 12:42 m5.large-website.js-10s.txt
   ```

   We have the k6 output in the TXT files, the raw benchmark data in the CSV files, and the graphs from the benchmark data in the PNG files.

   What's left now is to assemble a report in a Markdown file, that contains the graphs and some summary explanation of the results.

   Unfortunately, this is not scripted yet, but it could be done in the future via some base template. In the meantime, you can take the [v0.42.0 results report](/results/v0.42.0/README.md), and update the content manually.

   The following commands could be helpful for calculating aggregate values:

   - To calculate the average values (column 2 is for CPU, column 3 for RAM):
     ```shell
     awk -F',' 'NR>1 { sum += $3 } END { printf "%.2f", sum / (NR-1) }' m5.large-website.js-10s.csv
     ```

   - To calculate the max values (column 4 is for VUs, column 5 for RPS):
     ```shell
     awk -F',' 'BEGIN { max = 0 } NR>1 { max = ($5>max ? $5 : max) } END { printf "%.2f", max }' m5.large-website.js-10s.csv
     ```

    The network throughput and data transferred were taken from the k6 end-of-test summary found in the k6 output TXT files.


# Automation

The above process should be automated, so that we can automatically run benchmarks after every k6 release, and on-demand as needed. This is detailed in [issue #27](https://github.com/grafana/k6-benchmarks/issues/27).

The biggest challenge will be setting up the SUT and load generator machines, as we need to ensure that these are started and scaled up only when necessary, to avoid incurring infrastructure costs.
