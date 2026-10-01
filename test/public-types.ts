/**
 * Compile-time assertions for the public type surface. Built into the test
 * suite via `tsc`; every line here must type-check against the barrel export.
 */
import type {
  Account,
  AccountWithSignedMessage,
  Action,
  ConnectorAction,
  FinalExecutionOutcome,
  NearApiJsActionLike,
  SignAndSendTransactionParams,
  SignDelegateActionsParams,
  SignDelegateActionsResponse,
  SignInAndSignMessageParams,
  WalletFeatures,
} from "../src";

const request: SignDelegateActionsParams = {
  network: "testnet",
  delegateActions: [
    {
      receiverId: "wrap.testnet",
      actions: [],
    },
  ],
};

const response: SignDelegateActionsResponse = {
  signedDelegateActions: ["AA=="],
};

const signMessage: SignInAndSignMessageParams = {
  network: "testnet",
  messageParams: {
    message: "hello",
    recipient: "app.near",
    nonce: new Uint8Array(32),
  },
};

void request;
void response;
void signMessage;

const account: Account = { accountId: "alice.near" };
const signedAccount: AccountWithSignedMessage = {
  accountId: "alice.near",
  publicKey: "ed25519:abc",
  signedMessage: { accountId: "alice.near", publicKey: "ed25519:abc", signature: "sig" },
};
void signedAccount;

// Both action shapes are accepted: a connector action, and an object shaped like
// near-api-js actionCreators output (structural — no near-api-js import here).
const connectorAction: ConnectorAction = { type: "Transfer", params: { deposit: "1" } };
const nearApiJsShaped: Action = { enum: "transfer", transfer: { deposit: 1n } };
const structural: NearApiJsActionLike = { createAccount: {} };
const send: SignAndSendTransactionParams = {
  receiverId: "bob.near",
  actions: [connectorAction, nearApiJsShaped, structural],
};
void send;

const features: Partial<WalletFeatures> = { signInAndSignMessage: true, signDelegateActions: true };
void features;

// A structural FinalExecutionOutcome (what wallets return) round-trips.
const outcome: FinalExecutionOutcome = {
  final_execution_status: "EXECUTED",
  status: { SuccessValue: "" },
  transaction: {},
  transaction_outcome: {
    id: "tx",
    outcome: { logs: [], receipt_ids: [], gas_burnt: 1, tokens_burnt: "0", executor_id: "bob.near", status: { SuccessValue: "" } },
  },
  receipts_outcome: [],
};
void outcome;
