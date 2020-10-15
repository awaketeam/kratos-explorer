import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { Row, Col, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Progress, Spinner } from 'reactstrap';
import numbro from 'numbro';
import i18n from 'meteor/universe:i18n';
import SentryBoundary from '../components/SentryBoundary.jsx';

const T = i18n.createComponent();
export default class TwentyEighty extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: {},
            options: {}
        }
    }

    componentDidUpdate(prevProps){
        if (prevProps.stats != this.props.stats){
            let topPercent = this.props.stats.topTwentyPower/this.props.stats.totalVotingPower;
            let bottomPercent = this.props.stats.bottomEightyPower/this.props.stats.totalVotingPower;
            let validators_key = i18n._translations[i18n._locale].navbar.validators || "validators";
            let TopWords = i18n._translations[i18n._locale].navbar.top || "Top";
            let ResetWords = i18n._translations[i18n._locale].navbar.reset || "Rest";
            let hold_words = i18n._translations[i18n._locale].navbar.hold || "hold";
            let votingPowerPer = i18n._translations[i18n._locale].navbar.votingPowerPer || "voting power";

            this.setState({
                data:{
                    labels:
                        [
                            TopWords + " 20% ("+this.props.stats.numTopTwenty+") " + validators_key,
                            ResetWords + " 80% ("+this.props.stats.numBottomEighty+") " + validators_key
                        ]
                    ,
                    datasets: [
                        {
                            data: [
                                topPercent,
                                bottomPercent
                            ],
                            backgroundColor: [
                                '#85A2FE',
                                '#3364FD',
                            ],
                            hoverBackgroundColor: [
                                '#85A2FE',
                                '#3364FD',
                            ]
                        }
                    ]
                },
                options:{
                    tooltips: {
                        callbacks: {
                            label: function(tooltipItem, data) {
                                var label = data.labels[tooltipItem.index] || '';
            
                                if (label) {
                                    label += ' ' + hold_words;
                                }
                                label += numbro(data.datasets[0].data[tooltipItem.index]).format("0.00%");
                                label += " " + votingPowerPer;
                                return label;
                            }
                        }
                    }
                }
            });
        }
    }

    render(){
        if (this.props.loading){
            return <Spinner type="grow" color="primary" />
        }
        else{
            if (this.props.statsExist && this.props.stats){
                return (                    
                    <Card>
                        <div className="card-header"><T>votingPower.pareto2</T></div>
                        <CardBody>
                            <SentryBoundary><Pie data={this.state.data} options={this.state.options} /></SentryBoundary>
                        </CardBody>
                    </Card>
                );   
            }
            else{
                return <div></div>
            }
        }
    }
}    
