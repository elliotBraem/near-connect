import type { NearApiJsActionLike } from "./near-api-js-shapes";
import { ConnectorAction } from "./types";
export declare const nearActionsToConnectorActions: (actions: (NearApiJsActionLike | ConnectorAction)[]) => ConnectorAction[];
