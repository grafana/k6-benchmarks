import http from "k6/http";
import { sleep } from "k6";

const binFile = open("./26MB.zip", "b");

export let options = {
	discardResponseBodies: true,

};

export default function() {
  var data = {
    file: http.file(binFile, "26MB.zip")
  };
  var res = http.post("https://pawel.staging.loadimpact.com/my_messages.php", data);
  sleep(1);
}
