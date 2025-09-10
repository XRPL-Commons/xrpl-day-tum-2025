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

// There is a mistake in my code sorry :( I will fix it soon
async function multisig() {
    const client = new Client("wss://s.altnet.rippletest.net:51233");

    await client.connect();

    const { wallet: wallet1 } = await client.fundWallet();
    const { wallet: wallet2 } = await client.fundWallet();
    const { wallet: wallet3 } = await client.fundWallet();

    console.log("Wallet 1 address:", wallet1.address);
    console.log("Wallet 2 address:", wallet2.address);
    console.log("Wallet 3 address:", wallet3.address);

    // Signer List Setup
    const signerListSetTx: SignerListSet = {
        TransactionType: "SignerListSet",
        Account: wallet1.address,
        SignerQuorum: 2,
        SignerEntries: [
            {
                SignerEntry: {
                    Account: wallet1.address,
                    SignerWeight: 1,
                },
            },
            {
                SignerEntry: {
                    Account: wallet2.address,
                    SignerWeight: 1,
                },
            },
            {
                SignerEntry: {
                    Account: wallet3.address,
                    SignerWeight: 1,
                },
            },
        ],
    };

    const signerListSetTxResult = await client.submitAndWait(signerListSetTx, { autofill: true, wallet: wallet1 });

    if(signerListSetTxResult.result.validated) {
        console.log(chalk.green("Signerlist transaction succeeded ✅"));
    } else {
        console.log(chalk.red("Signerlist transaction failed ❌ - Result:", signerListSetTxResult.result.meta));
    }

    // TICKETS
    const ticketTx: TicketCreate = {
        TransactionType: "TicketCreate",
        Account: wallet1.address,
        TicketCount: 5,
    };

    const ticketTxResult = await client.submitAndWait(ticketTx, { autofill: true, wallet: wallet1 });

    if(ticketTxResult.result.validated) {
        console.log(chalk.green("Ticket transaction succeeded ✅"));
    } else {
        console.log(chalk.red("Ticket transaction failed ❌ - Result:", signerListSetTxResult.result.meta));
    }

    // Retrieve
    const accountTickets = await client.request({
        command: "account_objects",
        account: wallet1.address,
        type: "ticket",
    });

    console.log("Account tickets:", JSON.stringify(accountTickets.result.account_objects, null, 2));

    // Multisign Payment
    const multisigPaymentTx: Payment = {
        TransactionType: "Payment",
        Account: wallet1.address,
        Destination: wallet3.address,
        Amount: xrpToDrops(1)
    }

    const signedTx1 = wallet1.sign(multisigPaymentTx, true);
    const signedTx2 = wallet2.sign(multisigPaymentTx, true);

    const multisignedTx = multisign([signedTx1.tx_blob, signedTx2.tx_blob]);
    
    const multisigPaymentTxResult = await client.submitAndWait(multisignedTx);

    if(multisigPaymentTxResult.result.validated) {
        console.log(chalk.green("Multisig payment transaction succeeded ✅"));
    } else {
        console.log(chalk.red("Multisig payment transaction failed ❌ - Result:", multisigPaymentTxResult.result.meta));
    }

    await client.disconnect();
}

async function batch() {

}

async function amm() {

}
