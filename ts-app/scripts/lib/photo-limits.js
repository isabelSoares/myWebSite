const KB = 1024;
const MB = 1024 * KB;

const THUMBNAIL_LIMITS = Object.freeze({
  width: 540,
  maxDimension: 600,
  maxBytes: 120 * KB,
  quality: 74,
});

const FULL_LIMITS = Object.freeze({
  width: 1800,
  maxDimension: 2000,
  maxBytes: 500 * KB,
  quality: 80,
});

const GENERATED_TOTAL_MAX_BYTES = 64 * MB;

const formatMegabytes = (bytes) => (bytes / MB).toFixed(2);

const remainingBytes = (totalBytes, maxBytes = GENERATED_TOTAL_MAX_BYTES) => maxBytes - totalBytes;

const describeGeneratedFootprint = (totalBytes, fileCount, maxBytes = GENERATED_TOTAL_MAX_BYTES) => {
  const headroom = remainingBytes(totalBytes, maxBytes);
  const used = formatMegabytes(totalBytes);
  const limit = formatMegabytes(maxBytes);
  if (headroom >= 0) {
    return `${used} MB generated across ${fileCount} files; ${formatMegabytes(headroom)} MB headroom of ${limit} MB`;
  }
  return `${used} MB generated across ${fileCount} files; ${formatMegabytes(-headroom)} MB over the ${limit} MB limit`;
};

const RASTER_EXTENSIONS = new Set([
  '.avif',
  '.gif',
  '.jpeg',
  '.jpg',
  '.png',
  '.tif',
  '.tiff',
  '.webp',
]);

const VALID_ROTATIONS = Object.freeze([0, 90, 180, 270]);

module.exports = {
  FULL_LIMITS,
  GENERATED_TOTAL_MAX_BYTES,
  RASTER_EXTENSIONS,
  THUMBNAIL_LIMITS,
  VALID_ROTATIONS,
  describeGeneratedFootprint,
  formatMegabytes,
  remainingBytes,
};
