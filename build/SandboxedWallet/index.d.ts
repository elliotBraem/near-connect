import { Account, FinalExecutionOutcome, Network, SignAndSendTransactionParams, SignAndSendTransactionsParams, SignDelegateActionsParams, SignedMessage, SignMessageParams, WalletManifest, SignDelegateActionsResponse, type AccountWithSignedMessage, type SignInAndSignMessageParams, type SignInParams } from "../types";
import { NearConnector } from "../NearConnector";
import SandboxExecutor from "./executor";
export declare class SandboxWallet {
    readonly connector: NearConnector;
    readonly manifest: WalletManifest;
    executor: SandboxExecutor;
    constructor(connector: NearConnector, manifest: WalletManifest);
    signIn(data?: SignInParams): Promise<Array<Account>>;
    signInAndSignMessage(data: SignInAndSignMessageParams): Promise<Array<AccountWithSignedMessage>>;
    signOut(data?: {
        network?: Network;
    }): Promise<void>;
    getAccounts(data?: {
        network?: Network;
    }): Promise<Array<Account>>;
    signAndSendTransaction(params: SignAndSendTransactionParams): Promise<FinalExecutionOutcome>;
    signAndSendTransactions(params: SignAndSendTransactionsParams): Promise<Array<FinalExecutionOutcome>>;
    signMessage(params: SignMessageParams): Promise<SignedMessage>;
    signDelegateActions(params: SignDelegateActionsParams): Promise<SignDelegateActionsResponse>;
}
export default SandboxWallet;
