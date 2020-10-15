import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { Card, CardHeader, Row, Col } from 'reactstrap';
import numbro from 'numbro';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js'

const T = i18n.createComponent();


export default class ChainStates extends Component{
    constructor(props){
        super(props);
        this.state = {
            price: "-",
            marketCap: "-",
            inflation: 0,
            communityPool: [],
            totalSupply: 0,
        }

        // chainStates


        if (Meteor.isServer){
            // this.props.chainStates.totalSupply
            // if (this.props.chainStates.totalSupply) {
            //   this.setState({
            //     totalSupply: this.props.chainStates.totalSupply
            //   })
            // }

            if (this.props.chainStates.communityPool){
                let commPool = []
                this.props.chainStates.communityPool.forEach((pool, i) => {
                    commPool[i] = pool;
                },)   
                        this.setState({
                            communityPool: [... commPool],
                            inflation: numbro(this.props.chainStates.inflation).format("0.00%")
                        })
            }

            if (this.props.chainStates.inflation){
              this.setState({
                    inflation: numbro(this.props.chainStates.inflation).format("0.00%")
                })
            }

            if (this.props.coinStats.usd){
                this.setState({
                    price: this.props.coinStats.usd,
                    marketCap: numbro(this.props.coinStats.usd_market_cap).format("$0,0.00")
                })
            }

        }

    }

    componentDidUpdate(prevProps){
        let communityPools = []
        if (this.props.chainStates != prevProps.chainStates){
            if (this.props.chainStates.communityPool){
                this.props.chainStates.communityPool.forEach((pool, i) => {
                    communityPools[i] = pool;
                },)   
                        this.setState({
                            communityPool: [... communityPools],
                            inflation: numbro(this.props.chainStates.inflation).format("0.00%")
                        })
            }
        }

        if (this.props.chainStates != prevProps.chainStates){
          this.setState({
                inflation: numbro(this.props.chainStates.inflation).format("0.00%")
            })
        }

        if (this.props.coinStats != prevProps.coinStats){
            if (this.props.coinStats.usd){
                this.setState({
                    price: this.props.coinStats.usd,
                    marketCap: numbro(this.props.coinStats.usd_market_cap).format("$0,0.00")
                })
            }
        }

        if (this.props.chainStates != prevProps.chainStates){
          if (this.props.chainStates.totalSupply) {
            this.setState({
              totalSupply: this.props.chainStates.totalSupply
            })
          }
        }
    }
 

    renderValues(propsValue){
            let poolValues = [];
            propsValue.map((pool,i) => {
                poolValues[i] = new Coin(pool.amount, pool.denom).toString(4)  
                    })

            return poolValues.join(', ')
           
    }
    render(){


        return <Card className="d-lg-inline-block">
            <CardHeader>
                <Row className="text-nowrap">
                    {/*<Col xs={4} md="auto"><small><span><T>chainStates.price</T>:</span> <strong>${this.state.price}</strong></small></Col>*/}
                    {/*<Col xs={8} md="auto"><small><span><T>chainStates.marketCap</T>:</span> <strong>{this.state.marketCap}</strong></small></Col>*/}
                    <Col xs={4} md="auto" className="pdl_50"><small class="states_tag"><span><T>chainStates.inflation</T>:</span> <strong>{this.state.inflation || '7%'}</strong></small></Col>
                    <Col xs={8} md="auto"><small class="states_tag"><span><T>chainStates.totalSupply</T>:</span> <strong>{new Coin(this.state.totalSupply).toString()}</strong></small></Col>
                    {/*<Col xs={8} md="auto"><small><span><T>chainStates.communityPool</T>:</span> <strong>{(this.renderValues(this.state.communityPool))}</strong></small></Col>*/}
                </Row>
            </CardHeader>
        </Card>
    }
}
