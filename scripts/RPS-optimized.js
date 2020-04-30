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
    // relentless hammering of these 3 URLs.
    // 20 batches per iteration.
    for(let i=0; i<20; i++){
        http.batch([
            ['GET', "http://pawel.staging.loadimpact.com/static/logo.svg?url=v1"],
            ['GET', "http://pawel.staging.loadimpact.com/static/logo.svg?url=v2"],
            ['GET', "http://pawel.staging.loadimpact.com/static/logo.svg?url=v3"],
        ]);
    }
  sleep(0.1); // 100ms sleep between iterations.
}
