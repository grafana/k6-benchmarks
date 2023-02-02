/*
  Note: this is not a real-life example unless you want to test for the absolute RPS limit of your system.
  This is extremely aggressive test.
*/

import http from "k6/http";

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
  http.get('http://test.staging.k6.io/static/logo.svg');
}
