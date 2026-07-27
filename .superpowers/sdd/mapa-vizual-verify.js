"use strict";
var fs = require("fs");
var path = require("path");
var ROOT = path.join(__dirname, "..", "..", "ljeto-1razred");
var html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
var css = fs.readFileSync(path.join(ROOT, "css", "styles.css"), "utf8");
var results = [];
function pass(name, ok, detail) {
  results.push({ name: name, ok: ok });
  console.log((ok ? "PASS" : "FAIL") + " " + name + (detail ? " — " + detail : ""));
}
pass("sky-sun markup", /class="[^"]*sky-sun/.test(html) || /class='[^']*sky-sun/.test(html));
pass("sky-cloud markup", /sky-cloud/.test(html));
pass("sky-spark markup", /sky-spark/.test(html));
pass("cloud-drift keyframes", /@keyframes\s+cloud-drift/.test(css));
pass("sun-pulse keyframes", /@keyframes\s+sun-pulse/.test(css));
pass("spark-float keyframes", /@keyframes\s+spark-float/.test(css));
pass("reduced-motion block", /prefers-reduced-motion:\s*reduce/.test(css));
var failed = results.filter(function (r) { return !r.ok; });
process.exit(failed.length ? 1 : 0);
