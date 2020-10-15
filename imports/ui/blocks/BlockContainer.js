import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Blockscon } from '/imports/api/blocks/blocks.js';
import { Transactions } from '/imports/api/transactions/transactions.js';
import Block from './Block.jsx';

export default BlockContainer = withTracker((props) => {
    let blockHandle, transactionHandle;
    let loading = true;

    if (Meteor.isClient){
        blockHandle = Meteor.subscribe('blocks.findOne', parseInt(props.match.params.blockId));
        transactionHandle = Meteor.subscribe('transactions.height', parseInt(props.match.params.blockId));
        loading = !blockHandle.ready() && !transactionHandle.ready();    
    }

    let block, txs, transactionsExist, blockExist;

    if (Meteor.isServer || !loading){
        block = Blockscon.findOne({height: parseInt(props.match.params.blockId)});
        txs = Transactions.find({height:parseInt(props.match.params.blockId)});

        if (Meteor.isServer){
            loading = false;
            transactionsExist = !!txs;
            blockExist = !!block;
        }
        else{
            transactionsExist = !loading && !!txs;
            blockExist = !loading && !!block;
        }
        
    }

    return {
        loading,
        blockExist,
        transactionsExist,
        block: blockExist ? block : {},
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
                {"tx.value.msg.type":"kuchain/MsgBeginRedelegate"}
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
        }).fetch() : {},
    };
})(Block);