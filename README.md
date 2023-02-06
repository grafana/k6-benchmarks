# k6 benchmarks

This repository contains [k6](https://k6.io/) scripts used to benchmark k6 performance under different test scenarios, on a variety of hardware configurations. We track statistics such as CPU and memory usage, HTTP requests per second (RPS), and number of VUs, which are graphed and presented in easily readable documents.

The goal is to keep track of k6 performance for each major release, in order to detect any regressions early, and to easily share the performance a single instance of k6 can achieve with the community.


## Scripts

You can see the k6 scripts used in the [/scripts](/scripts) directory.

- `website.js`: a general purpose script that replicates common real-world scenarios: loading the front page and static assets, and logging in using some predefined credentials. It uses popular k6 features, such as custom metrics, checks, thresholds and `sleep()`.
  The purpose of this script is not to achieve the highest RPS, but to track general performance.

- `RPS-optimized.js`: a simple script that tries to achieve the highest possible RPS.

- `file-upload.js`: a script that uploads a large file, used to track memory usage and network throughput.


## Load generators

We use a variety of load generator machines, to measure the performance under different hardware configurations. Currently these are AWS EC2 instances, which may change in the future.

- `m5.large`: 2 vCPU cores, 8GB RAM

- `m5.4xlarge`: 16 vCPU cores, 64GB RAM

- `m5.24xlarge`: 96 vCPU cores, 384GB RAM


## System under test

All scripts are run against a large-scale deployment of a simple test PHP site maintained by the k6 team. This site is available publicly at https://test.k6.io/, though for purposes of these tests, and to keep infrastructure costs down, we make secondary deployments that are only available during the benchmark run.

## Results

Results of tested k6 versions are available in the [/results](/results) directory. You can find the raw data, graphs and result explanations in each subdirectory.

## Related

- ["Running large tests" guide](https://k6.io/docs/testing-guides/running-large-tests/): learn about some ways to improve k6 performance, error troubleshooting, and more.

- ["Fine tuning OS" guide](https://k6.io/docs/misc/fine-tuning-os): learn about different operating system configuration tweaks to make sure k6 runs optimally.


## License

[ISC](/LICENSE)
