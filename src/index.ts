import chalk from "chalk";
import { AccountSet, AccountSetAsfFlags, AMMCreate, AMMDeposit, Client, convertStringToHex, EscrowCreate, EscrowFinish, isoTimeToRippleTime, multisign, NFTokenBurn, NFTokenCancelOffer, NFTokenCreateOffer, NFTokenCreateOfferFlags, NFTokenMint, Payment, PaymentChannelClaim, PaymentChannelCreate, PaymentChannelFund, SignerListSet, signPaymentChannelClaim, TicketCreate, TrustSet, TrustSetFlags, xrpToDrops, Wallet, decode } from "xrpl";
import { signMultiBatch, combineBatchSigners } from 'xrpl/dist/npm/Wallet/batchSigner';
import { Batch, BatchFlags, BatchInnerTransaction } from "xrpl/dist/npm/models/transactions/batch";

async function payment() {
    const client = new Client("wss://s.altnet.rippletest.net:51233");

    await client.connect();

    const { wallet: sender, balance } = await client.fundWallet();
    const { wallet: receiver } = await client.fundWallet();

    console.log("Sender address:", sender.address);
    console.log("Receiver address:", receiver.address);

    const paymentTx: Payment = {
        TransactionType: "Payment",
        Account: sender.address,
        Amount: xrpToDrops(1),
        Destination: receiver.address,
        Memos: [
            {
                Memo: {
                    MemoType: convertStringToHex("Message"),
                    MemoData: convertStringToHex("Hello, TUM!"),
                },
            },
        ],
    }

    const paymentTxResult = await client.submitAndWait(paymentTx, { autofill: true, wallet: sender });

    console.log("Payment transaction hash:", paymentTxResult.result.hash);

    if(paymentTxResult.result.validated) {
        console.log(chalk.green("Payment transaction succeeded ✅"));
    } else {
        console.log(chalk.red("Payment transaction failed ❌ - Result:", paymentTxResult.result.meta));
    }

    await client.disconnect();
}

async function multisig() {

}

async function amm() {

}

async function batch() {

}
