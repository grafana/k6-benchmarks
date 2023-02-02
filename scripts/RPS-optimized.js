/*
    Note: this is not a real-life example unless you want to test for the absolute RPS limit of your system.
    This is extremely aggressive test.
*/

import http from "k6/http";
import { sleep } from "k6";

export let options = {
  discardResponseBodies: true,
  ext: {
    loadimpact: {
      name: `${__ENV.TEST_NAME}` || "RPS hammering test",
      projectID: 3624575,
    }
  }
};

export default function() {
  // relentless hammering of these 6 URLs.
  // 20 batches per iteration.
  for(let i=0; i<20; i++){
    http.batch([
      ['GET', 'http://54.171.167.61:49203/static/logo.svg?ip=1'],
      ['GET', 'http://34.244.55.142:49153/static/logo.svg?ip=2'],
      ['GET', 'http://3.252.249.11:49203/static/logo.svg?ip=3'],
      ['GET', 'http://54.220.37.194:49203/static/logo.svg?ip=4'],
      ['GET', 'http://3.250.15.152:49153/static/logo.svg?ip=5'],
      ['GET', 'http://3.250.35.227:49203/static/logo.svg?ip=6'],
    ]);
  }
  sleep(0.1); // 100ms sleep between iterations.
}
