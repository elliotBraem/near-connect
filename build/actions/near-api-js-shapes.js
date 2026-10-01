"use strict";
/**
 * Structural shapes of near-api-js `Action` objects.
 *
 * `nearActionsToConnectorActions` accepts objects built with near-api-js
 * `actionCreators` so dApps written against that library keep working, but
 * near-connect does not depend on near-api-js: these interfaces describe only
 * the fields the converter reads (near-api-js `Enum` instances set the chosen
 * variant as an own property and record its name in `enum`). Anything that
 * matches the shape is accepted; nothing from `@near-js/*` is imported.
 */
Object.defineProperty(exports, "__esModule", { value: true });
//# sourceMappingURL=near-api-js-shapes.js.map