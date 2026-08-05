const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// zustand (y algunos otros paquetes) exponen un entry ESM pensado para
// bundlers tipo Vite que usa `import.meta.env`. Metro no soporta esa
// sintaxis y el bundle web queda con un `SyntaxError` en tiempo de carga.
// Desactivar la resolución por "exports" hace que Metro caiga de vuelta
// al entry CJS clásico (main), que sí es compatible.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;