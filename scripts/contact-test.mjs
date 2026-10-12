import assert from "node:assert/strict";
import { createContactHandler } from "../src/lib/contact-handler.ts";

const valid = { name: "Portfolio visitor", email: "visitor@example.com", intent: "project", message: "I'd like to discuss a new product.", website: "" };
const request = (body = valid, headers = {}) => new Request("https://portfolio.example/contact", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://portfolio.example", ...headers }, body: JSON.stringify(body),
});
const sent = [];
const handler = createContactHandler(async message => { sent.push(message); }, () => true);
for (const intent of ["project", "hire"]) {
  const response = await handler(request({ ...valid, intent }));
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
}
assert.equal(sent.length, 2);
assert.deepEqual(Object.keys(sent[0]).sort(), ["email", "intent", "message", "name"]);
for (const body of [null, [], { ...valid, name: " " }, { ...valid, name: "x\r\nBcc: victim@example.com" }, { ...valid, email: "invalid" }, { ...valid, email: "x@example.com\r\nBcc: victim@example.com" }, { ...valid, intent: "spam" }, { ...valid, message: "short" }, { ...valid, message: "x".repeat(5001) }, { ...valid, website: "bot" }]) {
  assert.equal((await handler(request(body))).status, 400);
}
assert.equal((await handler(request(valid, { Origin: "https://attacker.example" }))).status, 403);
assert.equal((await handler(request(valid, { "Content-Type": "text/plain" }))).status, 415);
assert.equal((await handler(request({ ...valid, message: "x".repeat(25000) }))).status, 413);
assert.equal(sent.length, 2, "invalid requests must not send email");
const limited = createContactHandler(async () => assert.fail("rate-limited request sent mail"), () => false);
assert.equal((await limited(request())).status, 429);
const failed = createContactHandler(async () => { throw new Error("SMTP rejected message"); }, () => true);
const failure = await failed(request());
assert.equal(failure.status, 503);
assert.equal((await failure.json()).ok, false, "delivery failure must never be reported as sent");
let release;
let resolved = false;
const pending = createContactHandler(() => new Promise(resolve => { release = resolve; }), () => true)(request()).then(response => { resolved = true; return response; });
await new Promise(resolve => setImmediate(resolve));
assert.equal(resolved, false, "wait for mail acceptance before reporting success");
release();
assert.equal((await pending).status, 200);
console.log("Contact checks passed: delivery, validation, origin, payload limits, spam guard and failure states.");
