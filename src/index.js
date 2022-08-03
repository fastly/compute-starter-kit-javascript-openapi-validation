/// <reference types="@fastly/js-compute" />

import { OpenAPIValidator, OpenAPIRouter } from "openapi-backend";

// If true, invalid requests will be rejected with a 400 response.
// Otherwise, they will be forwarded to the origin after OpenAPI validation errors are logged.
const REJECT_INVALID_REQUESTS = true;
// The origin server that requests are proxied onto.
const BACKEND = "origin";
// The URL of a valid and fully-dereferenced OpenAPI definition.
const SPEC_PATH = "https://httpbin.org/spec.json";

addEventListener("fetch", (event) => event.respondWith(handleRequest(event)));

// Retrieves the OpenAPI schema.
async function getOpenAPISchema() {
  // This should be a cacheable response.
  const resp = await fetch(SPEC_PATH, { backend: BACKEND });
  const schema = await resp.json();
  return schema;
}

// Validates all requests against an OpenAPI definition.
async function handleRequest(event) {
  // Retrieve the OpenAPI schema.
  const openAPIDefinition = await getOpenAPISchema();
  // Initialize an OpenAPI router using the schema.
  // https://github.com/anttiviljami/openapi-backend/blob/master/DOCS.md#new-openapirouteropts
  const openAPIRouter = new OpenAPIRouter({
    definition: openAPIDefinition,
    ignoreTrailingSlashes: true,
  });
  // Initialize an OpenAPI validator using the router and schema.
  // https://github.com/anttiviljami/openapi-backend/blob/master/DOCS.md#new-openapivalidatoropts
  const openAPIValidator = new OpenAPIValidator({
    definition: openAPIDefinition,
    lazyCompileValidators: false,
    router: openAPIRouter,
  });
  // Validate the request.
  try {
    // Clone the request (to avoid mutating the original request).
    const reqValidationResult = openAPIValidator.validateRequest(new Request(req));
    console.debug(`Request passed OpenAPI validation: ${reqValidationResult.valid}`);
    if (!isValidRequest.valid) {
      console.error(`OpenAPI request validation errors encountered`, reqValidationResult.errors);
      if (REJECT_INVALID_REQUESTS) {
        // Send a synthetic 400 response.
        return new Response(`Bad Request`, { status: 400 });
      }
    } 
    // Forward the valid request to the origin.
    return fetch(req, { backend: BACKEND });
  } catch (error) {
    console.error(`Error validating request with OpenAPI`, error);
    // Send a synthetic 500 response.
    return new Response(`Internal Server Error`, { status: 500 });
  }
}
