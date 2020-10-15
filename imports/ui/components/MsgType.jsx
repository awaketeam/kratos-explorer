import React from 'react';
import { Badge } from 'reactstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export const MsgType = (props) => {
    switch (props.type){
     /*
    {
        'kuchain/kuMsgDeposit',
        'kuchain/KuMsgEditValidator',
        'kuchain/MsgWithdrawDelegationReward',
        'kuchain/KuMsgUnbond',
        'kuchain/kuMsgVote',
        'asset/create',
        'kuchain/kuMsgSubmitProposal',
        'asset/lock',
        'asset/burn',
        'asset/unlock',
        'kuchain/KuMsgUnjail',
        'kuchain/KuMsgDelegate',
        'account/upAuth',
        'kuchain/MsgSetWithdrawAccountId',
        'asset/transfer',
        'kuchain/KuMsgRedelegate',
        'asset/issue',
        'account/createMsg',
        'kuchain/KuMsgCreateValidator'
    }
     */

    case 'kuchain/kuMsgDeposit':
        return <Badge color="info"><T>messageTypes.deposit</T></Badge>
    case 'kuchain/kuMsgSubmitProposal':
        return <Badge color="info"><T>messageTypes.submitProposal</T></Badge>
    case 'kuchain/kuMsgVote':
        return <Badge color="info"><T>messageTypes.vote</T></Badge>

    case 'asset/exercise':
        return <Badge color="info">{ i18n.__('messageTypes.exercise') }</Badge>


    case 'kuchain/KuMsgEditValidator':
        return <Badge color="warning"><T>messageTypes.editValidator</T></Badge>
    case 'kuchain/MsgWithdrawDelegationReward':
        return <Badge color="warning"><T>messageTypes.withdrawReward</T></Badge>
    case 'kuchain/KuMsgUnbond': // to_do
        return <Badge color="warning"><T>messageTypes.kumsgunbond</T></Badge>
    case 'kuchain/KuMsgCreateValidator':
        return <Badge color="warning"><T>messageTypes.createValidator</T></Badge>
    
    case 'kuchain/KuMsgDelegate':
        return <Badge color="warning"><T>messageTypes.delegate</T></Badge>
    case 'kuchain/KuMsgRedelegate':
        return <Badge color="warning"><T>messageTypes.redelegate</T></Badge>

    case 'asset/create': // to_do
        return <Badge color="success"><T>messageTypes.assetcreate</T></Badge>
    case 'asset/lock': // to_do
        return <Badge color="danger"><T>messageTypes.assetlock</T></Badge>
    case 'asset/burn': // to_do
        return <Badge color="danger"><T>messageTypes.assetburn</T></Badge>
    case 'asset/unlock': // to_do
        return <Badge color="success"><T>messageTypes.assetunlock</T></Badge>
    case 'asset/transfer':
        return <Badge color="success"><T>messageTypes.transfer</T></Badge>
    case 'asset/issue': // to_do
        return <Badge color="success"><T>messageTypes.assetissue</T></Badge>

    case 'kuchain/KuMsgUnjail':
        return <Badge color="danger"><T>messageTypes.unjail</T></Badge>
    case 'kuchain/MsgSetWithdrawAccountId': // to_do
        return <Badge color="danger"><T>messageTypes.msgsetwithdrawaccountid</T></Badge>

    case 'account/createMsg': // to_do
        return <Badge color="success"><T>messageTypes.createmsg</T></Badge>
    case 'account/upAuth': // to_do
        return <Badge color="success"><T>messageTypes.accountupauth</T></Badge>
    

    // bank
    case "cosmos-sdk/MsgSend":
        return <Badge color="success"><T>messageTypes.send</T></Badge>
    case "cosmos-sdk/MsgMultiSend":
        return <Badge color="success"><T>messageTypes.multiSend</T></Badge>
        
        // staking
    case "cosmos-sdk/MsgCreateValidator":
        return <Badge color="warning"><T>messageTypes.createValidator</T></Badge>;
    case "cosmos-sdk/MsgEditValidator":
        return <Badge color="warning"><T>messageTypes.editValidator</T></Badge>;
    case "cosmos-sdk/MsgDelegate":
        return <Badge color="warning"><T>messageTypes.delegate</T></Badge>;
    case "cosmos-sdk/MsgUndelegate":
        return <Badge color="warning"><T>messageTypes.undelegate</T></Badge>;
    case "cosmos-sdk/MsgBeginRedelegate":
        return <Badge color="warning"><T>messageTypes.redelegate</T></Badge>;
        
        // gov
    case "cosmos-sdk/MsgSubmitProposal":
        return <Badge color="info"><T>messageTypes.submitProposal</T></Badge>
    case "cosmos-sdk/MsgDeposit":
        return <Badge color="info"><T>messageTypes.deposit</T></Badge>
    case "cosmos-sdk/MsgVote":
        return <Badge color="info"><T>messageTypes.vote</T></Badge>;
        
        // distribution
    case "cosmos-sdk/MsgWithdrawValidatorCommission":
        return <Badge color="secondary"><T>messageTypes.withdrawComission</T></Badge>;
    case "cosmos-sdk/MsgWithdrawDelegationReward":
        return <Badge color="secondary"><T>messageTypes.withdrawReward</T></Badge>;
    case "cosmos-sdk/MsgModifyWithdrawAddress":
        return <Badge color="secondary"><T>messgeTypes.modifyWithdrawAddress</T></Badge>;

        // slashing
    case "cosmos-sdk/MsgUnjail":
        return <Badge color="danger"><T>messageTypes.unjail</T></Badge>;
        
        // ibc
    case "cosmos-sdk/IBCTransferMsg":
        return <Badge color="dark"><T>messageTypes.IBCTransfer</T></Badge>;
    case "cosmos-sdk/IBCReceiveMsg":
        return <Badge color="dark"><T>messageTypes.IBCReceive</T></Badge>;

    default:
        return <Badge color="primary">{props.type}</Badge>;
    }
}