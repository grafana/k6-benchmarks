import http from "k6/http";
import { sleep } from "k6";

var data = {
    file: http.file(open("./26MB.zip", "b"), "26MB.zip")
};

export let options = {
	discardResponseBodies: true,

};

export default function() {
  var res = http.post("https://pawel.staging.loadimpact.com/my_messages.php", data);
  sleep(1);
}
