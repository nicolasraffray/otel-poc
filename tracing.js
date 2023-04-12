const { ZipkinExporter } = require("@opentelemetry/exporter-zipkin");
const { HttpInstrumentation } = require("@opentelemetry/instrumentation-http");
const { ExpressInstrumentation } = require("@opentelemetry/instrumentation-express");
const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");
const { NodeTracerProvider } = require("@opentelemetry/sdk-trace-node");
const { registerInstrumentations } = require("@opentelemetry/instrumentation");
const { SimpleSpanProcessor } = require("@opentelemetry/sdk-trace-base");

// docker run --rm -d -p 9411:9411 openzipkin/zipkin
// node -r tracing.js app.js
registerInstrumentations({
    instrumentations: [
      // Express instrumentation expects HTTP layer to be instrumented
      new HttpInstrumentation(),
      new ExpressInstrumentation(),
    ],
  });

const resource =
  Resource.default().merge(
    new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: "otel-poc",
      [SemanticResourceAttributes.SERVICE_VERSION]: "0.1.0",
    })
  );

const provider = new NodeTracerProvider({
    resource: resource
})

const exporter = new ZipkinExporter();
const processor = new SimpleSpanProcessor(exporter);
provider.addSpanProcessor(processor);
provider.register()


