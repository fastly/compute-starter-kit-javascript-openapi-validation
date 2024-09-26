# OpenAPI Validation Starter Kit for JavaScript

[![Deploy to Fastly](https://deploy.edgecompute.app/button)](https://deploy.edgecompute.app/deploy)

An application template for validating requests against an OpenAPI 3.x definition, in JavaScript, for Fastly Compute. 

### OpenAPI, briefly

The [OpenAPI Specification](https://spec.openapis.org/oas/latest.html) (OAS – originally based on the [Swagger Specification](https://swagger.io/specification/)) defines a standard, language-agnostic interface to RESTful APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, additional documentation, or inspection of network traffic.

An OpenAPI definition is a document (or set of documents) that defines or describes an API.

### How this starter kit helps

This starter kit makes it possible to define custom request handling logic at the edge, based on whether a request matches an OpenAPI definitions. This means:

✅ Relieving load on origins 

✅ Improved API security

## Running the application

To create an application using this starter kit, create a new directory for your application and switch to it, and then type the following command:

```shell
npm create @fastly/compute@latest -- --language=javascript --starter-kit=openapi-validation
```

Replace the contents of `src/definition.json` with your own OpenAPI 3.x definition, and change any references to `httpbin.org` to your origin in `fastly.toml` – by replacing the `url` in `local_server.backends.origin`, and the `address` (hostname) in `setup.backends.origin`.

To build and run your new application in the local development environment, type the following command:

```shell
npm run start
```

To build and deploy your application to your Fastly account, type the following command. The first time you deploy the application, you will be prompted to create a new service in your account.

```shell
npm run deploy
```

### Request handling

The default application behavior is to only forward valid requests to the origin, and return a synthetic HTTP 400 response for invalid requests.

OpenAPI validation errors are logged in both cases.

To forward all requests to the origin, set the constant `REJECT_INVALID_REQUESTS` to `false`.

**For more details about other starter kits for Compute, see the [Fastly Developer Hub](https://developer.fastly.com/solutions/starters)**

## Security issues

Please see our [SECURITY.md](https://github.com/fastly/compute-starter-kit-javascript-openapi-validation/blob/main/SECURITY.md) for guidance on reporting security-related issues.
