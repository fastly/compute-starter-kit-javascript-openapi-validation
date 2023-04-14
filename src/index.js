/// <reference types="@fastly/js-compute" />

import { env } from "fastly:env";
import { includeBytes } from "fastly:experimental";
import { OpenAPIValidator } from "openapi-backend";

const textDecoder = new TextDecoder();

// A valid and fully-dereferenced OpenAPI 3.x definition.
const openAPIDefinition = JSON.parse(textDecoder.decode(includeBytes('src/definition.json')));

// If true, invalid requests will be rejected with a 400 response.
// Otherwise, they will be forwarded to the origin after OpenAPI validation errors are logged.
const REJECT_INVALID_REQUESTS = true;
// The origin server that requests are proxied onto.
const BACKEND = "origin";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

// Validates all requests against an OpenAPI definition.
async function handleRequest(event) {
  // Log service version
  console.log("FASTLY_SERVICE_VERSION:", env('FASTLY_SERVICE_VERSION') || 'local');
  
  // Initialize an OpenAPI validator using the OpenAPI definition.
  // https://github.com/anttiviljami/openapi-backend/blob/master/DOCS.md#new-openapivalidatoropts
  const openAPIValidator = new OpenAPIValidator({
    definition: openAPIDefinition,
    lazyCompileValidators: true,
  });

  const req = event.request;

  // Validate the request.
  try {
    const url = new URL(req.url);
    // Build a normalized Request object to pass to the OpenAPI validator.
    // https://github.com/anttiviljami/openapi-backend/blob/master/DOCS.md#request-object
    const normalizedForValidation = {
      method: req.method,
      // path of the request
      path: url.pathname,
      // HTTP request headers
      headers: Object.fromEntries(req.headers.entries()),
      // parsed query parameters (optional), we also parse query params from the path property
      query: Object.fromEntries(url.searchParams.entries()),
      // the request body (optional), either raw buffer/string or a parsed object/array
      body: req.body,
    };
    // Match the request to an operation from the OpenAPI definition.
    const operation = openAPIValidator.router.matchOperation(
      normalizedForValidation
    );
    // Validate the request against the matched operation (if found).
    const reqValidationResult = openAPIValidator.validateRequest(
      normalizedForValidation,
      operation
    );
    // Handle request validation errors.
    if (!reqValidationResult.valid) {
      console.error(
        "OpenAPI request validation errors",
        reqValidationResult.errors
      );
      throw new Error("Invalid request");
    }
  } catch (error) {
    // Handle errors, including when an operation is not matched.
    console.error("OpenAPI request validation failed", error);
    if (REJECT_INVALID_REQUESTS) {
      // Send a synthetic 400 response.
      return new Response("Bad Request", { status: 400 });
    }
  }
  // Forward request to the origin.
  return fetch(req, { backend: BACKEND });
}
