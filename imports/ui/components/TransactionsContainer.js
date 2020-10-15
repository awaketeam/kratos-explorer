import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Transactions } from '/imports/api/transactions/transactions.js';
import ValidatorTransactions from './Transactions.jsx';

export default TransactionsContainer = withTracker((props) => {
    let transactionsHandle, transactions, transactionsExist;
    let loading = true;

    if (Meteor.isClient){
        transactionsHandle = Meteor.subscribe('transactions.validator', props.validator, props.delegator, props.limit);
        loading = !transactionsHandle.ready();
    }

    if (Meteor.isServer || !loading){
        transactions = Transactions.find({}, {sort:{height:-1}});

        if (Meteor.isServer){
            loading = false;
            transactionsExist = !!transactions;
        }
        else{
            transactionsExist = !loading && !!transactions;
        }
    }

    return {
        loading,
        transactionsExist,
        transferTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"asset/transfer"},
                {"tx.value.msg.type":"asset/create"},
                {"tx.value.msg.type":"asset/issue"},
                {"tx.value.msg.type":"asset/burn"},
                {"tx.value.msg.type":"asset/lock"},
                {"tx.value.msg.type":"asset/unlock"},
                {"tx.value.msg.type":"asset/exercise"},
            ]
        }).fetch() : {},
        stakingTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"kuchain/KuMsgCreateValidator"},
                {"tx.value.msg.type":"kuchain/KuMsgEditValidator"},
                {"tx.value.msg.type":"kuchain/KuMsgDelegate"},
                {"tx.value.msg.type":"kuchain/MsgUndelegate"},
                {"tx.value.msg.type":"kuchain/MsgBeginRedelegate"},
                {"tx.value.msg.type":"kuchain/MsgWithdrawDelegationRewardData"}
            ]
        }).fetch() : {},
        distributionTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"kuchain/MsgWithdrawDelegationReward"},
                {"tx.value.msg.type":"kuchain/MsgWithdrawValidatorCommission"},
                {"tx.value.msg.type":"kuchain/MsgSetWithdrawAccountIdData"},
                {"tx.value.msg.type":"cosmos-sdk/CommunityPoolSpendProposal"},
            ]
        }).fetch() : {},
        governanceTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"kuchain/kuMsgSubmitProposal"},
                {"tx.value.msg.type":"kuchain/kuMsgDeposit"},
                {"tx.value.msg.type":"kuchain/kuMsgVot"},
                {"tx.value.msg.type":"kuchain/ParameterChangeProposal"},
            ]
        }).fetch() : {},
        slashingTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"kuchain/KuMsgUnjail"}
            ]
        }).fetch() : {},
        IBCTxs: transactionsExist ? Transactions.find({
            $or: [
                {"tx.value.msg.type":"cosmos-sdk/IBCTransferMsg"},
                {"tx.value.msg.type":"cosmos-sdk/IBCReceiveMsg"}
            ]
        }).fetch() : {}
    };
})(ValidatorTransactions);
