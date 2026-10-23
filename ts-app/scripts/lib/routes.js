const path = require('path');

const APP_ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');
const PUBLIC_DIR = path.join(APP_ROOT, 'public');
const BUILD_DIR = path.join(APP_ROOT, 'build');
const SRC_DIR = path.join(APP_ROOT, 'src');
const PHOTO_SOURCES_PATH = path.join(APP_ROOT, 'photo-sources.json');
const PHOTO_MANIFEST_PATH = path.join(SRC_DIR, 'data', 'photo-manifest.json');
const GENERATED_PHOTOS_DIR = path.join(PUBLIC_DIR, 'photos', 'generated');

const BASE_PATH = '/myWebSite/';

const ROUTES = Object.freeze([
  { id: 'home', path: '/' },
  { id: 'resume', path: '/resume' },
  { id: 'projects', path: '/projects' },
  { id: 'hobbies', path: '/hobbies' },
]);

const REQUIRED_BUILD_FILES = Object.freeze(['index.html', '404.html']);

module.exports = {
  APP_ROOT,
  BASE_PATH,
  BUILD_DIR,
  GENERATED_PHOTOS_DIR,
  PHOTO_MANIFEST_PATH,
  PHOTO_SOURCES_PATH,
  PUBLIC_DIR,
  REPO_ROOT,
  REQUIRED_BUILD_FILES,
  ROUTES,
  SRC_DIR,
};
