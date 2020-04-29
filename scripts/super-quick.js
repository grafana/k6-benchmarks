import http from "k6/http";
import { sleep } from "k6";

export let options = {
	discardResponseBodies: true,
};

export default function() {
  http.get("http://test.k6.io/static/logo.svg");
  sleep(0.1);
}
