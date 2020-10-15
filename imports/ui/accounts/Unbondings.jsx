import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Spinner } from 'reactstrap';
import numbro from 'numbro';
import NumberShow from '../components/NumberShow.jsx';
import Account from '../components/Account.jsx';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class AccountUnbondings extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let numUnbondings = this.props.unbonding.length;
        return <Card>
            <CardHeader>
              
              <T>accounts.unbonding</T>{(numUnbondings>1)?<T>accounts.plural</T>:''}
              <span className="mgl_9">
              (
                {(numUnbondings > 0)?numUnbondings:'0'}
              )
              </span>
            </CardHeader>
            {(numUnbondings > 0)?<CardBody className="list overflow-auto">
                <Container fluid>
                    <Row className="header text-nowrap d-none d-lg-flex">
                        <Col md={5}><i className="fas fa-at"></i> <span><T>accounts.validators</T></span></Col>
                        <Col md={7}>
                            <Row>
                                <Col md={6}><i className="fas fa-piggy-bank"></i> <span>
                                  <T>{ i18n.__('common.unblondPercentNum') ? i18n.__('common.unblondPercentNum') : i18n.__('accounts.shares') }</T>
                                    </span></Col>
                                <Col md={6}><i className="fas fa-clock"></i> <span><T>{ i18n.__('common.unblondFinishDate') ? i18n.__('common.unblondFinishDate') : i18n.__('accounts.mature') }</T></span></Col>
                            </Row>
                        </Col>
                    </Row>
                    {this.props.unbonding.map((u, i) =>
                        <Row key={i} className="delegation-info">
                            <Col md={5} className="text-nowrap overflow-auto"><Account address={u.validator_account} /></Col>
                            <Col md={7}>{u.entries.map((entry,j) =>
                                <Row key={j}>
                                    <Col md={6}>
                                        <NumberShow num_str={numbro(entry.balance).format("0,0")}></NumberShow> 
                                    </Col>
                                    <Col md={6}>
                                        {moment.utc(entry.completion_time).fromNow()}
                                    </Col>
                                </Row>
                            )}</Col>
                        </Row>
                    )}
                </Container>
            </CardBody>:<CardBody className="list overflow-auto"><div className="no_data"><T>accounts.noData</T></div></CardBody>}
        </Card>
    }
}