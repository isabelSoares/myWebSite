const fs = require('fs');
const http = require('http');
const https = require('https');
const path = require('path');

const { BUILD_DIR, ROUTES } = require('./lib/routes');

const MIME_TYPES = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function parseArgs(argv) {
  const options = { concurrency: 100, duration: 15, url: null };

  for (let index = 0; index < argv.length; index += 1) {
    const [flag, inlineValue] = argv[index].split('=');
    const value = inlineValue ?? argv[index + 1];

    if (flag === '--concurrency') {
      options.concurrency = Number(value);
      if (inlineValue === undefined) index += 1;
    } else if (flag === '--duration') {
      options.duration = Number(value);
      if (inlineValue === undefined) index += 1;
    } else if (flag === '--url') {
      options.url = value;
      if (inlineValue === undefined) index += 1;
    }
  }

  if (!Number.isFinite(options.concurrency) || options.concurrency < 1) {
    throw new Error('--concurrency must be a positive number.');
  }
  if (!Number.isFinite(options.duration) || options.duration < 1) {
    throw new Error('--duration must be a positive number of seconds.');
  }

  return options;
}

function serveBuild(request, response) {
  const requestPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const withoutBase = requestPath.startsWith('/myWebSite/')
    ? requestPath.slice('/myWebSite'.length)
    : requestPath;
  const relativePath = withoutBase === '/' ? '/index.html' : withoutBase;
  let filePath = path.join(BUILD_DIR, relativePath);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(BUILD_DIR, 'index.html');
  }

  if (!fs.existsSync(filePath)) {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, {
    'Content-Type': MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  fs.createReadStream(filePath).pipe(response);
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer(serveBuild);
    server.on('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      resolve({
        server,
        baseUrl: `http://127.0.0.1:${address.port}/myWebSite/`,
      });
    });
  });
}

function requestUrl(url, timeoutMs = 10000) {
  return new Promise((resolve) => {
    const startedAt = process.hrtime.bigint();
    const client = url.startsWith('https:') ? https : http;
    const request = client.get(url, (response) => {
      const chunks = [];
      let collectedBytes = 0;

      response.on('data', (chunk) => {
        if (collectedBytes < 65536) {
          chunks.push(chunk);
          collectedBytes += chunk.length;
        }
      });
      response.on('end', () => {
        const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
        const body = Buffer.concat(chunks).toString('utf8');
        const spaFallback = response.statusCode === 404 && body.includes('<div id="root">');
        const ok = (response.statusCode >= 200 && response.statusCode < 400) || spaFallback;
        resolve({ ok, status: response.statusCode, elapsedMs, spaFallback });
      });
    });

    request.setTimeout(timeoutMs, () => {
      request.destroy(new Error('request timed out'));
    });
    request.on('error', () => {
      const elapsedMs = Number(process.hrtime.bigint() - startedAt) / 1e6;
      resolve({ ok: false, status: 0, elapsedMs });
    });
  });
}

function percentile(values, percentileValue) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const index = Math.min(sorted.length - 1, Math.ceil((percentileValue / 100) * sorted.length) - 1);
  return sorted[index];
}

async function run(options) {
  let server = null;
  let baseUrl = options.url;

  if (!baseUrl) {
    if (!fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
      throw new Error('Production build not found. Run `npm run build` first.');
    }
    const local = await startServer();
    server = local.server;
    baseUrl = local.baseUrl;
  }

  if (!baseUrl.endsWith('/')) baseUrl += '/';
  const parsedBase = new URL(baseUrl);
  const environment = ['127.0.0.1', 'localhost', '::1'].includes(parsedBase.hostname)
    ? 'local-build'
    : 'published-site';

  const routeUrls = ROUTES.map((route) => new URL(route.path.replace(/^\//, ''), baseUrl).href);
  const latencies = [];
  let errors = 0;
  let requests = 0;
  let nextRoute = 0;
  const deadline = Date.now() + options.duration * 1000;
  const inFlight = new Set();

  async function worker() {
    while (Date.now() < deadline) {
      const url = routeUrls[nextRoute % routeUrls.length];
      nextRoute += 1;
      const pending = requestUrl(url).then((result) => {
        requests += 1;
        latencies.push(result.elapsedMs);
        if (!result.ok) errors += 1;
      });
      inFlight.add(pending);
      await pending;
      inFlight.delete(pending);
    }
  }

  await Promise.all(Array.from({ length: options.concurrency }, () => worker()));
  await Promise.all(inFlight);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  const errorRate = requests === 0 ? 1 : errors / requests;
  const p95 = percentile(latencies, 95);
  console.log(
    `Load smoke (${environment}): requests=${requests}, errors=${errors}, ` +
    `errorRate=${(errorRate * 100).toFixed(2)}%, p95=${p95.toFixed(1)}ms, ` +
    `concurrency=${options.concurrency}, duration=${options.duration}s`,
  );

  if (requests === 0) {
    throw new Error('No requests completed during the load smoke run.');
  }

  if (errorRate > 0.01) {
    process.exitCode = 1;
  }
}

if (require.main === module) {
  try {
    run(parseArgs(process.argv.slice(2))).catch((error) => {
      console.error(`Load smoke failed: ${error.message}`);
      process.exitCode = 2;
    });
  } catch (error) {
    console.error(`Load smoke failed: ${error.message}`);
    process.exitCode = 2;
  }
}

module.exports = { parseArgs, percentile, requestUrl };
