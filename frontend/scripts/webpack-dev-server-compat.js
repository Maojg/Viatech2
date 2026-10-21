'use strict';

const Module = require('module');

/**
 * react-scripts 5 arranca webpack-dev-server 4. La 5.2.7 cierra los avisos
 * de exposición de código, pero rechaza `https` y los hooks
 * onBeforeSetupMiddleware / onAfterSetupMiddleware. Este adaptador traduce
 * esa configuración antes de validarla.
 */
function install() {
  if (Module.prototype.__viatechWdsPatched) {
    return;
  }

  const originalRequire = Module.prototype.require;
  Module.prototype.require = function (id) {
    const loaded = originalRequire.apply(this, arguments);
    if (id !== 'webpack-dev-server' || !loaded || loaded.__viatechWrapped) {
      return loaded;
    }

    function WebpackDevServer(options, compiler) {
      return new loaded(normalizeDevServerOptions(options), compiler);
    }

    WebpackDevServer.__viatechWrapped = true;
    Object.setPrototypeOf(WebpackDevServer, loaded);
    copyStaticMembers(loaded, WebpackDevServer);
    return WebpackDevServer;
  };
  Module.prototype.__viatechWdsPatched = true;
}

function copyStaticMembers(source, target) {
  for (const key of Object.getOwnPropertyNames(source)) {
    if (key === 'length' || key === 'prototype' || key === 'name') {
      continue;
    }
    const descriptor = Object.getOwnPropertyDescriptor(source, key);
    if (!descriptor) {
      continue;
    }
    try {
      Object.defineProperty(target, key, descriptor);
    } catch (error) {
      // Algunas propiedades estáticas no se pueden redefinir.
    }
  }
}

function normalizeDevServerOptions(options) {
  if (!options || typeof options !== 'object') {
    return options;
  }

  const next = { ...options };
  const before = next.onBeforeSetupMiddleware;
  const after = next.onAfterSetupMiddleware;
  delete next.onBeforeSetupMiddleware;
  delete next.onAfterSetupMiddleware;

  if (Object.prototype.hasOwnProperty.call(next, 'https')) {
    const https = next.https;
    delete next.https;
    if (https && !next.server) {
      next.server =
        typeof https === 'object' ? { type: 'https', options: https } : { type: 'https' };
    }
  }

  if (typeof before === 'function' || typeof after === 'function') {
    const userSetup = next.setupMiddlewares;
    next.setupMiddlewares = (middlewares, devServer) =>
      translateLegacyMiddlewareHooks(middlewares, devServer, before, userSetup, after);
  }

  return omitUndefined(next);
}

function translateLegacyMiddlewareHooks(middlewares, devServer, before, userSetup, after) {
  const originalUse = devServer.app.use.bind(devServer.app);
  const capture = (bucket) => {
    devServer.app.use = (...args) => {
      bucket.push(args);
      return devServer.app;
    };
  };

  const beforeUses = [];
  const userUses = [];
  const afterUses = [];

  try {
    capture(beforeUses);
    if (typeof before === 'function') {
      before(devServer);
    }

    capture(userUses);
    const userMiddlewares =
      typeof userSetup === 'function' ? userSetup(middlewares, devServer) : middlewares;

    capture(afterUses);
    if (typeof after === 'function') {
      after(devServer);
    }

    return [
      ...toMiddlewares(beforeUses, 'cra-before', originalUse),
      ...(userMiddlewares || []),
      ...toMiddlewares(userUses, 'cra-user', originalUse),
      ...toMiddlewares(afterUses, 'cra-after', originalUse),
    ];
  } finally {
    devServer.app.use = originalUse;
  }
}

function toMiddlewares(uses, prefix, originalUse) {
  const entries = [];
  uses.forEach((args, index) => {
    const name = `${prefix}-${index}`;
    if (args.length === 1 && typeof args[0] === 'function') {
      entries.push({ name, middleware: args[0] });
      return;
    }
    if (args.length >= 2 && (typeof args[0] === 'string' || args[0] instanceof RegExp)) {
      const [path, ...handlers] = args;
      handlers.forEach((handler, handlerIndex) => {
        if (typeof handler === 'function') {
          entries.push({ name: `${name}-${handlerIndex}`, path, middleware: handler });
        }
      });
      return;
    }
    originalUse(...args);
  });
  return entries;
}

function omitUndefined(value) {
  if (Array.isArray(value)) {
    return value.map((item) => omitUndefined(item));
  }
  if (!isPlainObject(value)) {
    return value;
  }

  const copy = {};
  for (const [key, nested] of Object.entries(value)) {
    if (nested === undefined) {
      continue;
    }
    copy[key] = omitUndefined(nested);
  }
  return copy;
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype;
}

module.exports = {
  install,
  normalizeDevServerOptions,
};
