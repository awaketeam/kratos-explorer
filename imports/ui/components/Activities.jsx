import React, {Component } from 'react';
import { MsgType } from './MsgType.jsx';
import { Link } from 'react-router-dom';
import Account from '../components/Account.jsx';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js'
import JSONPretty from 'react-json-pretty';
import _ from 'lodash';

const T = i18n.createComponent();

MultiSend = (props) => {
    return <div>
        <p><T>activities.single</T> <MsgType type={props.msg.type} /> <T>activities.happened</T></p>
        <p><T>activities.senders</T>
            <ul>
                {props.msg.value.inputs.map((data,i) =>{
                    return <li key={i}><Account address={data.address}/> <T>activities.sent</T> {data.coins.map((coin, j) =>{
                        return <span key={j} className="text-success">{new Coin(coin.amount, coin.denom).toString()}</span>
                    })}
                    </li>
                })}
            </ul>
            <T>activities.receivers</T>
            <ul>
                {props.msg.value.outputs.map((data,i) =>{
                    return <li key={i}><Account address={data.address}/> <T>activities.received</T> {data.coins.map((coin,j) =>{
                        return <span key={j} className="text-success">{new Coin(coin.amount, coin.denom).toString()}</span>
                    })}</li>
                })}
            </ul>
        </p>
    </div>
}

export default class Activites extends Component {
    constructor(props){
        super(props);
    }

    render(){
        // console.log(this.props);
        const msg = this.props.msg;
        const tx_origin = this.props.tx_origin;
        const events = {};
        for (let i in this.props.events){
            events[this.props.events[i].type] = this.props.events[i].attributes
        }
        const is_error = Object.keys(events).length ? 0 : 1;

        /*
        {
              'asset/lock',
              'kuchain/MsgSetWithdrawAccountId',
              'asset/issue',
              'asset/transfer',
              'asset/unlock',
              'kuchain/KuMsgRedelegate',
              'kuchain/KuMsgCreateValidator',
              'kuchain/KuMsgUnbond',
              'asset/burn',
              'kuchain/kuMsgVote',
              'account/upAuth',
              'kuchain/KuMsgDelegate',
              'kuchain/KuMsgUnjail',
              'kuchain/kuMsgSubmitProposal',
              'kuchain/MsgWithdrawDelegationReward',
              'kuchain/KuMsgEditValidator',
              'account/createMsg',
              'kuchain/kuMsgDeposit',
              'asset/create'
          }
        */
        const knowed_types = {
          'asset/transfer': true,
          'account/createMsg': true,
          'kuchain/KuMsgEditValidator': true,
          'kuchain/kuMsgSubmitProposal': true,
          'kuchain/MsgWithdrawDelegationReward': true,
          'kuchain/KuMsgUnbond': true,
          'kuchain/KuMsgDelegate': true,
          'kuchain/KuMsgCreateValidator': true,
          'kuchain/KuMsgRedelegate': true,
          'kuchain/KuMsgUnjail': true,
          'asset/burn': true,
          'asset/unlock': true,
          'kuchain/MsgSetWithdrawAccountId': true,
          'kuchain/kuMsgVote': true,
          'kuchain/kuMsgDeposit': true,
          'asset/lock': true,
          'asset/issue': true,
          'asset/create': true,
          'account/upAuth': true,
          'asset/exercise': true,
          'kuchain/MsgWithdrawDelegationRewardData': false,
          'kuchain/MsgWithdrawValidatorCommission': true
        }

        if (!knowed_types[msg.type]) {
          return <div>
            <JSONPretty id="json-pretty" data={tx_origin}></JSONPretty>
            <JSONPretty id="json-pretty" data={msg}></JSONPretty>
            <JSONPretty id="json-pretty" data={events}></JSONPretty>
          </div>
        }

        if (msg.type == 'kuchain/MsgWithdrawValidatorCommission') {
            return <p>
              <Account address={tx_origin.data.value.validator_address} />  &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
              <MsgType type={msg.type} /> &nbsp;
               {/*{ i18n.__('activities.from') } &nbsp;*/}
               <span className="text-success">&nbsp;
                  {new Coin( parseFloat(events.withdraw_commission[0].value) ).toString(6)}
                </span>
               <T>common.fullStop</T>
             </p>
        }

        if (msg.type == 'kuchain/MsgWithdrawDelegationRewardData') {
            return <p>
              <Account address={tx_origin.data.value.delegator_address} />  &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
              <MsgType type={msg.type} /> &nbsp;
               { i18n.__('activities.from') } &nbsp;
              <Account address={tx_origin.data.value.validator_address} />
               <T>common.fullStop</T>
             </p>
        }

        if (msg.type == 'asset/exercise') {
            return <p>
              <Account address={tx_origin.data.value.id} />  &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
              <MsgType type={msg.type} /> &nbsp;
               {/*{ i18n.__('activities.withCash') } &nbsp;*/}
                <span className="text-success">&nbsp;
                  {new Coin( tx_origin.data.value.amount.amount , tx_origin.data.value.amount.denom).toString(6)}
                </span>
               <T>common.fullStop</T>
             </p>
        }

        if (msg.type == 'kuchain/kuMsgVote') {
            return <p>
              <Account address={tx_origin.data.value.voter} />  &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
              <MsgType type={msg.type} /> &nbsp;
              <Link to={"/proposals/"+tx_origin.data.value.proposal_id}> 
                <T>proposals.proposal</T> {tx_origin.data.value.proposal_id}
               </Link> &nbsp;
               <T>activities.withA</T> &nbsp;
               <em className="text-info">{tx_origin.data.value.voter}</em> &nbsp;
               <T>common.fullStop</T>
             </p>
        }

        if (msg.type == 'asset/lock') {
          return <p>
            <Account address={tx_origin.data.value.id} /> &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
            <MsgType type={msg.type} /> &nbsp;
            <span className="text-warning">&nbsp;
              {new Coin( tx_origin.data.value.amount[0].amount , tx_origin.data.value.amount[0].denom).toString(6)}&nbsp;
             </span>
          </p>
        }

        if (msg.type == 'asset/issue') {
          return <p>
            <Account address={tx_origin.data.value.creator} /> &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
            <MsgType type={msg.type} /> &nbsp;
            <span className="text-warning">&nbsp;
              {new Coin( tx_origin.data.value.amount.amount , tx_origin.data.value.amount.denom).toString(6)}&nbsp;
             </span>
          </p>
        }

        if (msg.type == 'asset/create') {
          return <p>
            <Account address={tx_origin.data.value.creator} /> &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
            <MsgType type={msg.type} /> &nbsp;
            <span className="text-warning">&nbsp;
              {new Coin( tx_origin.data.value.max_supply.amount , tx_origin.data.value.max_supply.denom).toString(6)}&nbsp;
             </span>
          </p>
        }

        if (msg.type == 'account/upAuth') {
          return <p>
            <Account address={tx_origin.data.value.name} /> &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
            <MsgType type={msg.type} /> &nbsp;
            <T>activities.to</T> &nbsp;
            <Account address={tx_origin.data.value.auth} /> &nbsp;
          </p>
        }

        if (msg.type == 'kuchain/kuMsgDeposit') {
            return <p>
               <Account address={tx_origin.data.value.depositor} /> &nbsp;
               {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
               <MsgType type={msg.type} />&nbsp;
               {new Coin( tx_origin.data.value.amount[0].amount , tx_origin.data.value.amount[0].denom).toString(6)}&nbsp;
               <T>activities.to</T> &nbsp;
               <Link to={"/proposals/"+tx_origin.data.value.proposal_id}>&nbsp;
               <T>proposals.proposal</T> &nbsp;
                 {tx_origin.data.value.proposal_id} &nbsp;
                </Link>&nbsp;
                <T>common.fullStop</T>&nbsp;
            </p>
        }

        if (msg.type == 'kuchain/MsgSetWithdrawAccountId') {
            return <p>
              <Account address={ tx_origin.data.value.delegator_accountid } /> &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
              <MsgType type={msg.type} /> &nbsp;
              <T>activities.to</T> &nbsp;
              <Account address={ tx_origin.data.value.withdraw_accountid } /> &nbsp;
            </p>
        }

        if (msg.type == 'asset/unlock') {
            return <p>
              <Account address={ tx_origin.data.value.id } /> &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
              <MsgType type={msg.type} /> &nbsp;
              <span className="text-warning">&nbsp;
              {new Coin( tx_origin.data.value.amount[0].amount , tx_origin.data.value.amount[0].denom).toString(6)}
              </span>
            </p>
        }

        if (msg.type == 'kuchain/KuMsgUnjail') {
            return <p>
              <Account address={ tx_origin.data.value.address } /> &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
              <MsgType type={msg.type} /> &nbsp;
            </p>
        }

        if (msg.type == 'asset/burn') {
          return <p>
            <Account address={ tx_origin.data.value.id } /> &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
            <MsgType type={msg.type} /> &nbsp;
            <span className="text-warning">&nbsp;
              {new Coin( tx_origin.data.value.amount.amount , tx_origin.data.value.amount.denom).toString(6)}
            </span>
          </p>
        }

        if (msg.type == 'kuchain/KuMsgRedelegate') {
          return <p>
            <Account address={ tx_origin.data.value.delegator_account } /> &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
            <MsgType type={msg.type} /> &nbsp;
            <span className="text-warning">&nbsp;
              {new Coin( tx_origin.data.value.amount.amount , tx_origin.data.value.amount.denom).toString(6)}
            </span> &nbsp;
            <T>activities.from</T> &nbsp;
            <Account address={ tx_origin.data.value.validator_src_account } /> &nbsp;
            <T>activities.to</T> &nbsp;
            <Account address={ tx_origin.data.value.validator_dst_account} />&nbsp;
            <T>common.fullStop</T>
           </p>
        }

        if (msg.type == 'kuchain/KuMsgEditValidator') {
            return <p>
              {/*<Account address={tx_origin.data.value['from']}/> &nbsp;*/}
              {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
              <MsgType type={msg.type} /> &nbsp;
              <Account address={tx_origin.data.value['validator_account']}/> &nbsp;
              <T>activities.withMoniker</T>   &nbsp;
              <Account address={tx_origin.data.value.description.moniker}/>
            </p>
        }

        if (msg.type == 'asset/transfer') {
            return <p>
                <Account address={tx_origin['from']}/> &nbsp;
                {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
                <MsgType type={msg.type} /> &nbsp;
                {/*<T>activities.operatingAt</T> */}
                <span className="text-warning">{new Coin(tx_origin.amount[0].amount, tx_origin.amount[0].denom).toString(6)}</span>&nbsp;
                 <T>activities.to</T> &nbsp;
                <span className="address">
                  <Account address={tx_origin['to']}/> 
                </span>&nbsp;
                <T>common.fullStop</T>
             </p>          
        }


        if (msg.type == 'account/createMsg') {
          return <p>
            <Account address={tx_origin['from']}/> &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}&nbsp;
            <MsgType type={msg.type} /> &nbsp;
            <span className="address">
                <Account address={tx_origin['to']}/> 
            </span>&nbsp;
            <T>common.fullStop</T>
          </p>
        }

        if (msg.type == 'kuchain/kuMsgSubmitProposal') {
            const proposalId = _.get(this.props, 'events[2].attributes[0].value', null)
            const proposalLink = proposalId ? `/proposals/${proposalId}` : "#";
            return <p>
              <Account address={msg.value.KuMsg['from']} /> &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
              <MsgType type={msg.type} /> &nbsp;
              <T>activities.withTitle</T> &nbsp;
              <Link to={proposalLink}>{msg.value.content.value.title}</Link>&nbsp;
              <T>common.fullStop</T>
            </p>
        }

        if (msg.type == 'kuchain/MsgWithdrawDelegationReward') {
            if (!is_error) {
              return <p>
                <Account address={ tx_origin.data.value.delegator_address }/> &nbsp;
                <MsgType type={msg.type} />  &nbsp;
                  <T _purify={false} amount={new Coin(parseInt(events['withdraw_rewards'][0].value) || 0, events['withdraw_rewards'][0].value ? events['withdraw_rewards'][0].value.replace(/[0-9]/g, '') : Meteor.settings.public.coins[0].denom).toString(6)}>activities.withAmount</T> &nbsp;
                  <T>activities.from</T>  &nbsp;
                <Account address={tx_origin.data.value.validator_address || events['withdraw_rewards'][1].value  } /> &nbsp;
              </p>
            } else {
              return <p>
                <Account address={ tx_origin.data.value.delegator_address }/>  &nbsp;
                <T>activities.failedTo</T> &nbsp;
                <MsgType type={msg.type} />  &nbsp;
                <T>activities.from</T>  &nbsp;
                <Account address={tx_origin.data.value.validator_address || events['withdraw_rewards'][1].value  } /> &nbsp;
              </p>
            }

        }

        if (msg.type == 'kuchain/KuMsgUnbond') {
            return <p>
              <Account address={ tx_origin.data.value.delegator_account }/>  &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
              <MsgType type={msg.type} />  &nbsp;
              <T _purify={false} amount={new Coin(parseInt(tx_origin.data.value.amount.amount), tx_origin.data.value.amount.denom.replace(/[0-9]/g, '')).toString(6)}>activities.withAmount</T> &nbsp;
              <T>activities.from</T>  &nbsp;
              <Account address={ tx_origin.data.value.validator_account }/>  &nbsp;
            </p>

            if (!this.props.invalid) {
              return <p>
                <Account address={events['message'][2].value}/>  &nbsp;
                {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
                <MsgType type={msg.type} />  &nbsp;
                {(!this.props.invalid)?<T _purify={false} amount={new Coin(parseInt(events['unbond'][1].value), events['unbond'][1].value.replace(/[0-9]/g, '')).toString(6)}>activities.withAmount</T>:''}  &nbsp;
                <T>activities.from</T>  &nbsp;
                <Account address={msg.value.validator_address || events['unbond'][0].value  } /> &nbsp;
                <T>common.fullStop</T> &nbsp;
              </p>
            } else {
              return <p>
                {(this.props.invalid)?<T>activities.failedTo</T>:''} &nbsp;
                <MsgType type={msg.type} />
               </p>
            }
        }            
        
        if (msg.type == 'kuchain/KuMsgDelegate') {
          return <p>
              <Account address={tx_origin['from']}/>  &nbsp;
              {(this.props.invalid)?<T>activities.failedTo</T>:''}  &nbsp;
              <MsgType type={msg.type} />  &nbsp;
              <span className="text-warning">
                {new Coin(tx_origin.amount[0].amount, tx_origin.amount[0].denom).toString(6)}
              </span>  &nbsp;
              <T>activities.to</T>  &nbsp;
              <Account address={tx_origin.to} />  &nbsp;
              <T>common.fullStop</T>  &nbsp;
            </p>
        }

        if (msg.type == 'kuchain/KuMsgCreateValidator') {

          return <p>
            <Account address={ tx_origin.data.value.delegator_account }/>  &nbsp;
            <MsgType type={msg.type} />  &nbsp;
            {(this.props.invalid)?<T>activities.failedTo</T>:''}  &nbsp;
            <span className="address">  &nbsp;
              <Account address={tx_origin.data.value.validator_account}/>  &nbsp;
            </span> 
            <T>activities.withMoniker</T>   &nbsp;
            <Account address={tx_origin.data.value.description.moniker}/>
          </p>

        }

        return <div>
          <JSONPretty id="json-pretty" data={msg}></JSONPretty>
          <JSONPretty id="json-pretty" data={events}></JSONPretty>
        </div>

        switch (msg.type){
        // bank
        case "cosmos-sdk/MsgSend":
            let amount = '';
            amount = msg.value.amount.map((coin) => new Coin(coin.amount, coin.denom).toString()).join(', ')
            return <p><Account address={msg.value.from_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <span className="text-success">{amount}</span> <T>activities.to</T> <span className="address"><Account address={msg.value.to_address} /></span><T>common.fullStop</T></p>
        case "cosmos-sdk/MsgMultiSend":
            return <MultiSend msg={msg} />

            // staking
        case "cosmos-sdk/MsgCreateValidator":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <T>activities.operatingAt</T> <span className="address"><Account address={msg.value.validator_address}/></span> <T>activities.withMoniker</T> <Link to="#">{msg.value.description.moniker}</Link><T>common.fullStop</T></p>
        case "cosmos-sdk/MsgDelegate":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <span className="text-warning">{new Coin(msg.value.amount.amount, msg.value.amount.denom).toString(6)}</span> <T>activities.to</T> <Account address={msg.value.validator_address} /><T>common.fullStop</T></p>
        case "kuchain/KuMsgDelegate":
            return <p><Account address={msg.value.KuMsg['from']}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <span className="text-warning">{new Coin(msg.value.KuMsg.amount[0].amount, msg.value.KuMsg.amount[0].denom).toString(6)}</span> <T>activities.to</T> <Account address={msg.value.KuMsg.to} /><T>common.fullStop</T></p>
        case "cosmos-sdk/MsgUndelegate":
            return <p><Account address={msg.value.delegator_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <span className="text-warning">{new Coin(msg.value.amount.amount, msg.value.amount.denom).toString(6)}</span> <T>activities.from</T> <Account address={msg.value.validator_address} /><T>common.fullStop</T></p>
        case "cosmos-sdk/MsgBeginRedelegate":
            return <p><Account address={msg.value.delegator_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <span className="text-warning">{new Coin(msg.value.amount.amount, msg.value.amount.denom).toString(6)}</span> <T>activities.from</T> <Account address={msg.value.validator_src_address} /> <T>activities.to</T> <Account address={msg.value.validator_dst_address} /><T>common.fullStop</T></p>

            // gov
        case "cosmos-sdk/MsgSubmitProposal":
            const proposalId = _.get(this.props, 'events[2].attributes[0].value', null)
            const proposalLink = proposalId ? `/proposals/${proposalId}` : "#";
            return <p><Account address={msg.value.proposer} /> <MsgType type={msg.type} /> <T>activities.withTitle</T> <Link to={proposalLink}>{msg.value.content.value.title}</Link><T>common.fullStop</T></p>
        case "cosmos-sdk/MsgDeposit":
            return <p><Account address={msg.value.depositor} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> <em className="text-info">{msg.value.amount.map((amount,i) =>new Coin(amount.amount, amount.denom).toString(6)).join(', ')}</em> <T>activities.to</T> <Link to={"/proposals/"+msg.value.proposal_id}><T>proposals.proposal</T> {msg.value.proposal_id}</Link><T>common.fullStop</T></p>
        case "cosmos-sdk/MsgVote":
            return <p><Account address={msg.value.voter} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} />  <Link to={"/proposals/"+msg.value.proposal_id}><T>proposals.proposal</T> {msg.value.proposal_id}</Link> <T>activities.withA</T> <em className="text-info">{msg.value.option}</em><T>common.fullStop</T></p>

            // distribution
        case "cosmos-sdk/MsgWithdrawValidatorCommission":
            return <p><Account address={msg.value.validator_address} /> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /><T> {(!this.props.invalid)?<T _purify={false} amount={new Coin(parseInt(events['withdraw_commission'][0].value), events['withdraw_commission'][0].value.replace(/[0-9]/g, '')).toString(6)}>activities.withAmount</T>:''}common.fullStop</T></p>
        case "cosmos-sdk/MsgWithdrawDelegationReward":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /> {(!this.props.invalid)?<T _purify={false} amount={new Coin(parseInt(events['withdraw_rewards'][0].value), events['withdraw_rewards'][0].value.replace(/[0-9]/g, '')).toString(6)}>activities.withAmount</T>:''} <T>activities.from</T> <Account address={msg.value.validator_address} /><T>common.fullStop</T></p>
        case "cosmos-sdk/MsgModifyWithdrawAddress":
            return <p><Account address={msg.value.delegator_address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /></p>

            // slashing
        case "cosmos-sdk/MsgUnjail":
            return <p><Account address={msg.value.address}/> {(this.props.invalid)?<T>activities.failedTo</T>:''}<MsgType type={msg.type} /><T>common.fullStop</T></p>

            // ibc
        case "cosmos-sdk/IBCTransferMsg":
            return <MsgType type={msg.type} />
        case "cosmos-sdk/IBCReceiveMsg":
            return <MsgType type={msg.type} />

        default:
            return <div><JSONPretty id="json-pretty" data={msg}></JSONPretty></div>
        }
    }
}
