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
  http.get('https://pawel-test-nlb.staging.loadimpact.com/');
    // relentless hammering of these 6 URLs.
    // 20 batches per iteration.
    // for(let i=0; i<20; i++){
    //     http.batch([
    //         ['GET', "https://pawel-test-nlb.staging.loadimpact.com/?req=1"],
    //         ['GET', "https://pawel-test-nlb.staging.loadimpact.com/?req=2"],
    //         ['GET', "https://pawel-test-nlb.staging.loadimpact.com/?req=3"],
    //         ['GET', "https://pawel-test-nlb.staging.loadimpact.com/?req=4"],
    //         ['GET', "https://pawel-test-nlb.staging.loadimpact.com/?req=5"],
    //         ['GET', "https://pawel-test-nlb.staging.loadimpact.com/?req=6"],
    //     ]);
    // }
  // sleep(0.1); // 100ms sleep between iterations.
}
