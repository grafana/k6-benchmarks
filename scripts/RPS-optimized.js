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
            projectID: 3478725,
        }
    }
};

export default function() {
    // relentless hammering of these 6 URLs.
    // 20 batches per iteration.
    for(let i=0; i<20; i++){
        http.batch([
            ['GET', "http://34.249.156.120/static/logo.svg?ip=1"],
            ['GET', "http://34.250.250.204/static/logo.svg?ip=2"],
            ['GET', "http://52.31.47.157/static/logo.svg?ip=3"],
            ['GET', "http://54.72.16.236/static/logo.svg?ip=4"],
            ['GET', "http://54.76.206.198/static/logo.svg?ip=5"],
            ['GET', "http://99.81.83.131/static/logo.svg?ip=6"],
        ]);
    }
  sleep(0.1); // 100ms sleep between iterations.
}
