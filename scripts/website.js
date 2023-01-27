/* real-life website test script */

import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

const baseURL = 'http://test.staging.k6.io';
const sleepTime = __ENV.SLEEP || 3;

let successfulLogins = new Counter("successful_logins");
let checkFailureRate = new Rate("check_failure_rate");
let timeToFirstByte = new Trend("time_to_first_byte", true);

export let options = {
  thresholds: {
    "http_req_duration": ["p(95)<500"],
    "http_req_duration{staticAsset:yes}": ["p(95)<100"],
    "check_failure_rate": ["rate<0.3"]
  },
  ext: {
    loadimpact: {
      projectID: 3624575,
      name: __ENV.TEST_NAME || "AWS EC2 Hardware Testing",
    }
  }
};

function randomIntBetween(min, max) { // min and max included
 return Math.floor(Math.random() * (max - min + 1) + min);
}

let loginData = {
  "users": [
    { "username": "admin", "password": "123" },
    { "username": "test_user", "password": "1234" },
    { "username": "invaliduser", "password": "password"}
  ]
};

export default function() {
  group("Front page", function() {
    let res = http.get(http.url`${baseURL}/?ts=${Math.round(randomIntBetween(1,2000))}`, { tags: { name: `${baseURL}/?ts=*`}});

    let checkRes = check(res, {
      "Homepage body size is 11278 bytes": (r) => r.status === 200 && r.body.length === 11278,
      "Homepage welcome header present": (r) => r.status === 200 && r.body.indexOf("Welcome to the k6.io demo site!") !== -1
    });

    checkFailureRate.add(!checkRes);

    timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });

    group("Static assets", function() {
      let res = http.batch([
        ["GET", `${baseURL}/static/css/site.css`, {}, { tags: { staticAsset: "yes" } }],
        ["GET", `${baseURL}/static/js/prisms.js`, {}, { tags: { staticAsset: "yes" } }]
      ]);
      checkRes = check(res[0], {
        "Is stylesheet 4859 bytes?": (r) => r.status === 200 && r.body.length === 4859,
      });

      // Record check failures
      checkFailureRate.add(!checkRes);

      // Record time to first byte and tag it with the URL to be able to filter the results in Insights
      timeToFirstByte.add(res[0].timings.waiting, { ttfbURL: res[0].url, staticAsset: "yes" });
      timeToFirstByte.add(res[1].timings.waiting, { ttfbURL: res[1].url, staticAsset: "yes" });
    });
  });

  sleep(sleepTime);

  group("Login", function() {
    let res = http.get(`${baseURL}/my_messages.php`);
    let checkRes = check(res, {
      "Users should not be auth'd. Is unauthorized header present?": (r) => r.status === 200 && r.body.indexOf("Unauthorized") !== -1
    });

    // Record check failures
    checkFailureRate.add(!checkRes);

    let position = Math.floor(Math.random()*loginData.users.length);
    let credentials = loginData.users[position];
    const csrftoken = res.cookies.csrf && res.cookies.csrf.length && res.cookies.csrf[0].value;

    res = http.post(`${baseURL}/login.php`, {
      login: credentials.username,
      password: credentials.password,
      csrftoken: csrftoken,
      redir: '1',
    });
    checkRes = check(res, {
      "is logged in welcome header present": (r) => r.status === 200 && r.body.indexOf("Welcome, admin!") !== -1
    });

    // Record successful logins
    if (checkRes) {
      successfulLogins.add(1);
    }

    // Record check failures
    checkFailureRate.add(!checkRes, { page: "login" });

    // Record time to first byte and tag it with the URL to be able to filter the results in Insights
    timeToFirstByte.add(res.timings.waiting, { ttfbURL: res.url });
  });

  sleep(sleepTime);
}
