const path = require('path');

const APP_ROOT = path.resolve(__dirname, '..', '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');
const PUBLIC_DIR = path.join(APP_ROOT, 'public');
const BUILD_DIR = path.join(APP_ROOT, 'build');
const SRC_DIR = path.join(APP_ROOT, 'src');
const PHOTOS_DIR = path.join(REPO_ROOT, 'photos');

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
  PHOTOS_DIR,
  PUBLIC_DIR,
  REPO_ROOT,
  REQUIRED_BUILD_FILES,
  ROUTES,
  SRC_DIR,
};
