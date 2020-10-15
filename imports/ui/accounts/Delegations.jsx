import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Spinner } from 'reactstrap';
import AccountTooltip from '../components/AccountTooltip.jsx';
import NumberShow from '../components/NumberShow.jsx';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js';
import SentryBoundary from '../components/SentryBoundary.jsx';

const T = i18n.createComponent();

export default class AccountDelegations extends Component{
    constructor(props){
        super(props);
    }


    render(){
        let numDelegations = this.props.delegations.length;
        let denomType = this.props.denom;
        let rewardDenom = '';
        return <Card>
            <CardHeader>
              
              <T className="mgr_6">accounts.delegation</T>
              <span className="mgl_9">
              {/*(
              {(numDelegations > 0)?numDelegations:(<span>0-</span>)}
              {(numDelegations > 1)?(<span>0</span>):''}
              )*/}

              ({ numDelegations })
              </span>
            </CardHeader>
            {(numDelegations > 0)?<CardBody className="list overflow-auto">
                <Container fluid>
                    <Row className="header text-nowrap d-none d-lg-flex pd_bottom_125">
                        <Col xs={7} md={5}><i className="fas fa-at"></i> <span><T>accounts.validators</T></span></Col>

                        <Col xs={2} md={3}><i className="fas fa-wallet"></i> <span><T>{i18n.__('navbar.votingPowerPerNumber')}</T></span></Col>
                        {/*<Col xs={2} md={3}><i className="fas fa-wallet"></i> <span><T>{Coin.StakingCoin.displayNamePlural}</T></span></Col>*/}
                        <Col xs={3} md={4}><i className="fas fa-gift"></i> <span><T>{ i18n.__('common.rewards') }</T></span></Col>
                    </Row>
                    <SentryBoundary>
                    {this.props.delegations.sort((b, a) => (a.balance - b.balance)).map((d, i) => {
                        let reward = this.props.rewardsForEachDel[d.validator_account];
                            rewardDenom =(reward)?reward.find(({denom}) => denom === denomType): null;
                        
                        return <Row key={i} className="delegation-info">
                            <Col xs={7} md={5} className="text-nowrap overflow-auto account_delegation_box">
                              <AccountTooltip address={d.validator_account} />
                             </Col>
                            <Col xs={2} md={3}> <NumberShow num_str={new Coin(d.balance.amount, d.balance.denom).stakeString()}></NumberShow></Col>
                            <Col xs={3} md={4}>{rewardDenom?<NumberShow num_str={new Coin(rewardDenom.amount, rewardDenom.denom).toString(4)}></NumberShow>:'No rewards '} </Col>
                        </Row>
                    })}</SentryBoundary>
                </Container>
            </CardBody>:<CardBody className="list overflow-auto"><div className="no_data"><T>accounts.noData</T></div></CardBody>}
        </Card>
    }
}
