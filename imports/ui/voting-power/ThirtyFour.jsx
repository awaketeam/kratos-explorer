import React, { Component } from 'react';
import {Pie} from 'react-chartjs-2';
import { Row, Col, Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Progress, Spinner } from 'reactstrap';
import numbro from 'numbro';
import i18n from 'meteor/universe:i18n';
import SentryBoundary from '../components/SentryBoundary.jsx';

const T = i18n.createComponent();
export default class ThirtyFour extends Component{
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

            let voting_power = i18n._translations[i18n._locale].votingPower.votingPower || " voting power";
            let validatorHold = i18n._translations[i18n._locale].votingPower.validatorHold || " validators hold ";
            let validator34 = i18n._translations[i18n._locale].votingPower.validator34 || "No. of validators hold 34%+ VP";
            let latestVotingOfVlidators = i18n._translations[i18n._locale].votingPower.latestVotingOfVlidators || "No. of validators hold rest of VP"
            
            let self = this;
            this.setState({
                data:{
                    labels:
                        [
                            validator34,
                            latestVotingOfVlidators
                        ]
                    ,
                    datasets: [
                        {
                            data: [
                                this.props.stats.numTopThirtyFour,
                                this.props.stats.numBottomSixtySix
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
                                // var label = data.datasets[0].data[tooltipItem.index] + " validators hold ";
                                // label += numbro(data.datasets[0].data[tooltipItem.index]).format("0.00%");
                                if (tooltipItem.index == 0)
                                    return ' ' + data.datasets[0].data[tooltipItem.index] + validatorHold + numbro(self.props.stats.topThirtyFourPercent).format("0.00%") + voting_power;
                                else 
                                    return ' ' + data.datasets[0].data[tooltipItem.index] + validatorHold + numbro(self.props.stats.bottomSixtySixPercent).format("0.00%")+ voting_power;
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
                        <div className="card-header"><T>votingPower.minValidators34_2</T></div>
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
