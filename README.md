# OpenAPI Validation Starter Kit for JavaScript

[![Deploy to Fastly](https://deploy.edgecompute.app/button)](https://deploy.edgecompute.app/deploy)

An application template for validating requests against an OpenAPI 3.x definition, in JavaScript, for Fastly's Compute@Edge environment. 

### OpenAPI, briefly

The [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (OAS – originally based on the [Swagger Specification](https://swagger.io/specification/)) defines a standard, language-agnostic interface to RESTful APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, additional documentation, or inspection of network traffic.

An OpenAPI definition is a document (or set of documents) that defines or describes an API.

### How this starter kit helps

This starter kit makes it possible to define custom request handling logic at the edge, based on whether a request matches an OpenAPI definitions. This means:

✅ Relieving load on origins 

✅ Improved API security

## Usage

Replace the contents of `src/definition.json` with your own OpenAPI 3.x definition, and change any references to `httpbin.org` to your origin in `fastly.toml` – by replacing the `url` in `local_server.backends.origin`, and the `address` (hostname) in `setup.backends.origin`.

Then run `fastly compute serve` to try out this Compute@Edge app on your local machine, or `fastly compute publish` to publish a new Compute@Edge service.

### Request handling

The default application behavior is to only forward valid requests to the origin, and return a synthetic HTTP 400 response for invalid requests.

OpenAPI validation errors are logged in both cases.

To forward all requests to the origin, set the constant `REJECT_INVALID_REQUESTS` to `false`.

**For more details about other starter kits for Compute@Edge, see the [Fastly Developer Hub](https://developer.fastly.com/solutions/starters)**

## Security issues

Please see our [SECURITY.md](https://github.com/fastly/compute-starter-kit-javascript-openapi-validation/blob/main/SECURITY.md) for guidance on reporting security-related issues.
