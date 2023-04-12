'use strict'

const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { HostMetrics } = require('@opentelemetry/host-metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

const prometheusPort = PrometheusExporter.DEFAULT_OPTIONS.port;
const prometheusEndpoint = PrometheusExporter.DEFAULT_OPTIONS.endpoint;

const exporter = new PrometheusExporter({
    startServer: true,
    },
    () => {

        console.log(`prometheus scrape endpoint: http://localhost:${prometheusPort}${prometheusEndpoint}`)
        console.log(`prometheus metrics visible on: http://localhost:9090`)
        console.log('See requests_total for your metric')
    }
)

const meterProvider= new MeterProvider()
meterProvider.addMetricReader(exporter);
const meter = meterProvider.getMeter('Custom Metrics')

const requestCount = meter.createCounter("requests", {
    description: 'Counting all incoming requests'
})

const boundInstruments = new Map();

module.exports.countAllRequests = () => {
    return (req, res, next) => {
        console.log(boundInstruments.has(req.path))
        if(!boundInstruments.has(req.path)){
            const labels = { route: req.path}
            console.log(labels)
        }
        requestCount.add(1, {
            route: req.path, 
            

        })
        
        next();
    }
}