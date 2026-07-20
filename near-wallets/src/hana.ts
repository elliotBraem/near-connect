import { ConnectorAction } from "./utils/action";
import { NearRpc } from "./utils/rpc";

const provider = new NearRpc(window.selector?.providers?.mainnet);

const checkExist = async () => {
  try {
    await window.selector.external("hanaWallet.near", "account");
  } catch {
    const downloadUrl = "https://chromewebstore.google.com/detail/hana-wallet/jfdlamikmbghhapbgfoogdffldioobgl";

    await window.selector.ui.whenApprove({ title: "Download Hana Wallet", button: "Download" });
    window.selector.open(downloadUrl);
    throw new Error("Please install Hana Wallet and reload the page");
  }
};

const hana = async (method: string, ...params: any[]): Promise<any> => {
  return await window.selector.external("hanaWallet.near", method, ...params);
};

const hanaWallet = async () => {
  // The Hana extension exposes no `near_disconnect` method (see hana-extension
  // DAppManager near switch). Swallowing keeps sign-in's cleanup path safe.
  const signOut = async () => {
    try { await hana("disconnect"); } catch { /* not connected / not installed */ }
  };

  const getAccounts = async () => {
    const { accountId } = await hana("account");
    if (!accountId) return [];
    return [{ accountId }];
  };

  return {
    // Connector passes { network, addFunctionCallKey } but Hana's `account` method
    // does not accept FCK params, so we ignore the input and only handle sign-in-without-key.
    // Manifest advertises `signInWithoutAddKey: true` to reflect this.
    async signIn() {
      await checkExist();
      try {
        const { publicKey, accountId } = await hana("account");
        if (!accountId) throw new Error("Hana Wallet account unavailable");
        return [{ accountId, publicKey }];
      } catch (error) {
        await signOut();
        throw new Error("Failed to sign in", { cause: error });
      }
    },

    signOut,
    getAccounts,

    async verifyOwner() {
      throw new Error(`Method not supported by Hana Wallet`);
    },

    async signMessage({ message, recipient, nonce }: any) {
      await checkExist();
      try {
        const signedMessage = await hana("signMessage", message, recipient, Buffer.from(nonce).toString("base64"));
        return {
          accountId: signedMessage.accountId,
          publicKey: signedMessage.publicKey,
          signature: signedMessage.signature,
        };
      } catch (error) {
        console.error("hanaWallet.signMessage", error);
        throw new Error("Sign error", { cause: error });
      }
    },

    async signAndSendTransaction({ receiverId, actions }: { receiverId: string; actions: ConnectorAction[] }) {
      await checkExist();

      const accounts = await getAccounts();
      if (accounts.length === 0) throw new Error("Wallet not signed in");
      if (!receiverId) throw new Error("Receiver ID is required");

      try {
        const { txHash } = await hana("signAndSendTransaction", receiverId, actions);
        if (!txHash) throw new Error("No transaction hash received");

        return await provider.txStatus(txHash, "unused", "NONE");
      } catch (error) {
        console.error("hanaWallet.signAndSendTransaction", error);
        throw new Error("Sign error", { cause: error });
      }
    },

    // Sequential because the Hana extension has no batch endpoint. Each transaction
    // triggers its own approval popup.
    async signAndSendTransactions({ transactions }: { transactions: Array<{ receiverId: string; actions: ConnectorAction[] }> }) {
      await checkExist();

      const results = [];
      for (let i = 0; i < transactions.length; i++) {
        try {
          results.push(await this.signAndSendTransaction(transactions[i]));
        } catch (error) {
          console.error(`hanaWallet.signAndSendTransactions failed at index ${i}/${transactions.length}`, error);
          throw new Error(`Sign error at transaction ${i + 1}/${transactions.length}`, { cause: error });
        }
      }
      return results;
    },

    async createSignedTransaction() {
      throw new Error(`Method not supported by Hana Wallet`);
    },

    async signTransaction() {
      throw new Error(`Method not supported by Hana Wallet`);
    },

    async getPublicKey() {
      throw new Error(`Method not supported by Hana Wallet`);
    },

    async signNep413Message() {
      throw new Error(`Method not supported by Hana Wallet`);
    },

    async signDelegateAction() {
      throw new Error(`Method not supported by Hana Wallet`);
    },
  };
};

hanaWallet().then((wallet) => {
  window.selector.ready(wallet);
});
