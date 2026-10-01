# 0.12.0

- **Security: `nearActionsToConnectorActions` no longer escalates unknown `AddKey` permissions to `FullAccess`.** A permission that is neither `functionCall` nor `fullAccess` (a typo, or a future gas-key permission) now throws instead of silently minting a full-access key. Pass a `ConnectorAction` explicitly if you need an unusual permission.
- **The package no longer references near-api-js at all.** The published `build/*.d.ts` re-exported `FinalExecutionOutcome` and `Action` from `@near-js/*` while declaring no dependency on them, so consumers without near-api-js installed saw unresolved types. Both are now structural types owned by this package (`NearApiJsActionLike` and a structural `FinalExecutionOutcome` family, same exported names and shapes — near-api-js values remain assignable). `@near-js/*` devDependencies are removed, and a new `test:no-near-js` guard fails the build if any `@near-js` import ever reaches `build/`.
- **Gas-key actions (protocol 85+)**: `AddKey` accepts `params.gasKeyInfo` (`{ balance, numNonces }`, turning the permission into GasKeyFullAccess / GasKeyFunctionCall), and `TransferToGasKey` / `WithdrawFromGasKey` join the `ConnectorAction` union. New manifest feature `gasKeys`; every wallet wrapper refuses gas-key actions for wallets that do not set it (`assertGasKeyActionsSupported`, exported, fail-closed), so a wallet that does not know `gasKeyInfo` can never add a plain key by mistake. No bundled wallet advertises it yet.
- **Executor crash reporting.** Sandbox iframes now report `error` and `unhandledrejection` back to the host as `wallet-error`, and the connector's ready promise rejects with a clear message instead of hanging when a wallet executor crashes on load. A 5-second fallback timeout covers the case where the executor script itself fails to load; the iframe is disposed on failure.
- Sandbox iframe hardening: `fetch` is re-bound to `window` (bundled code that aliases/destructures fetch no longer throws "Illegal invocation"), `window.localStorage` is overridden to return the sandboxed proxy for every access pattern (including SES lockdown introspection), and bare `localStorage` references in executor code are rewritten alongside the existing `.localStorage` rewrite. All injected scripts carry the CSP nonce when `cspNonce` is set.
- Popups: Escape closes the popup with the same semantics as clicking the backdrop, and `destroy()` disposes document-level listeners so they cannot leak per popup open.
- MNW executor: an empty `providers` array from the page is now treated as "no providers" (falling back to the network's own node URL) instead of being passed to `NearRpc` as-is, which silently routed testnet RPC calls to mainnet.
- Example app: uses the library's structural `FinalExecutionOutcome` instead of `@near-js/types`; the action builder throws for action types it has no form for instead of relying on exhaustive-switch fallthrough.
- New `yarn test` script (build + public type assertions + no-near-js guard) and `build-scripts/release-fork.sh` for cutting tag-based GitHub installs while changes are pending upstream. `prepublish` → `prepublishOnly` (npm 7+ never runs `prepublish`). `WalletFeatures`, `SignDelegateActionsResponse` and the `Execution*` outcome types are now exported from the package root.
- Signed delegate actions inside a transaction now throw a clear error instead of being passed through; delegates are signed via `signDelegateActions`.

# 0.11.4

- Add `cspNonce` option to `NearConnector` for CSP compliance. When set, the nonce is added to both `<script>` tags inside the `srcdoc` sandbox iframe, allowing them to execute under nonce-based Content Security Policy.

# 0.11.3

- Export `EventMap`, `EventType`, and `Account` types from barrel

# 0.11.2

- The wallet manifest is now available inside the sandbox.
- Add metadata object to wallet manifest for any constants data

# 0.11.1

- Add bluetooth permission for sandbox

# 0.11.0

- Add feature **signInAndSignMessage**
- Add feature **signInWithFunctionCallKey**

# 0.10.0

- Add **signInAndSignMessage** method
- Fix footer branding bugs
- Remove default HOT Branding
- Make icon in branding optional

# 0.9.0

- Add connect.use(WalletPlugin): **Experimental** feature to override wallet methods
- Add footerBranding property to disable or override footer UI
- Add signDelegateAction

# 0.8.2

- Fix css styles

# 0.8.0

- Remove WalletConnect as optional dep
- Change types for UseGlobalContractAction and DeployGlobalContractAction

# 0.7.0

- Add UseGlobalContractAction, DeployGlobalContractAction
- Support Actions from @near-js

# 0.6.11

- Add `signIn` to setup limited access key (deprecated flow)

# 0.6.10

- Fix SSR issues
- Fix random class name

# 0.6.9

- Fix SSR issues
- Move styles to isolated className

# 0.6.8

- Add fallback for manifest
- Remove contractId and methods from signIn method

# 0.6.7

- Move all intents specific code and multichain connector to @hot-labs/wibe3
- remove connectWithKey option
- add excludeWallets, providers and isBannedNearAddress options
- some cache improvements

# 0.6.4

- Add Intents class and more exports

# 0.6.3

- Add autoConnect option for NearConnector (usable for ParentFrameWallets)

# 0.6.2

- Improve html templater, fix ui bugs

# 0.6.1

- Fix MultichainPopup ui bug

# 0.6.0

- add html templater and improve Popup lifecycle render flow
- add debug manifests
- improve styles

# 0.5.7

- fix returns types for `signAndSendTransactions` in `InjectedWallet`

# 0.5.6

- Add `HotConnector.disconnect(type, { silent: true })`
- Change `signIntentsWithAuth` for NearWallet, use accountId as signerId for intents
