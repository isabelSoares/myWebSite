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

const GENERATED_TOTAL_MAX_BYTES = 60 * MB;

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
};
