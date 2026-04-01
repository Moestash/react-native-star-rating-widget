const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const pak = require('../package.json');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const modules = Object.keys(pak.peerDependencies || {});

const escape = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

config.resolver.blockList = modules.map(
  (m) =>
    new RegExp(`^${escape(path.join(monorepoRoot, 'node_modules', m))}\\/.*$`)
);

config.resolver.extraNodeModules = modules.reduce((acc, name) => {
  acc[name] = path.join(projectRoot, 'node_modules', name);
  return acc;
}, {});

module.exports = config;
