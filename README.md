# Caf.js

Co-design permanent, active, stateful, reliable cloud proxies with your web app and IoT devices.

See https://www.cafjs.com

## Example of a GraphQL subscription (continuous query) with Caf.js

This example shows:

* how to wrap a legacy service, which does not provide a GraphQL subscription interface, so that it can be a valid GraphQL subscription source,
* how to evaluate continuous queries, provided by the client, using these new sources,
* and how to notify off-line clients of significant result changes using IoT devices.

Using the `openweathermap.org` API (see the `caf_weather` plugin) an autonomous CA periodically loads relevant weather information, and evaluates a GraphQL query using the `caf_graphql` plugin.

When the result of that query is significantly different from the previous one, a notification is sent to an IoT device to warn the user, and this changes a GPIO pin on a Raspberry Pi.

See [Autonomous Computation](https://www.cafjslabs.com/autonomous) for an overview of proactive programming.
