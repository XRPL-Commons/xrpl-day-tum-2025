import chalk from "chalk";
import { AccountSet, AccountSetAsfFlags, AMMCreate, AMMDeposit, Client, convertStringToHex, EscrowCreate, EscrowFinish, isoTimeToRippleTime, multisign, NFTokenBurn, NFTokenCancelOffer, NFTokenCreateOffer, NFTokenCreateOfferFlags, NFTokenMint, Payment, PaymentChannelClaim, PaymentChannelCreate, PaymentChannelFund, SignerListSet, signPaymentChannelClaim, TicketCreate, TrustSet, TrustSetFlags, xrpToDrops, Wallet, decode } from "xrpl";
import { signMultiBatch, combineBatchSigners } from 'xrpl/dist/npm/Wallet/batchSigner';
import { Batch, BatchFlags, BatchInnerTransaction } from "xrpl/dist/npm/models/transactions/batch";



async function payment() {
    
}

async function multisig() {

}

async function amm() {
    
}

async function batch() {
    
}
