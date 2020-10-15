import { Meteor } from 'meteor/meteor';
import { Validators } from '../validators.js';
import { ValidatorRecords } from '../../records/records.js';
import { VotingPowerHistory } from '../../voting-power/history.js';

Meteor.publish('validators.all', function (sort = "description.moniker", direction = -1, fields={}) {
    return Validators.find({}, {sort: {[sort]: direction}, fields: fields});
});

publishComposite('validators.firstSeen',{
    find() {
        return Validators.find({});
    },
    children: [
        {
            find(val) {
                return ValidatorRecords.find(
                    { address: val.address },
                    { sort: {height: 1}, limit: 1}
                );
            }
        }
    ]
});

Meteor.publish('validators.voting_power', function(){
    return Validators.find({
        status: 3,
        jailed:false
    },{
        sort:{
            voting_power:-1
        },
        fields:{
            address: 1,
            description:1,
            voting_power:1,
            profile_url:1
        }
    }
    );
});

publishComposite('validator.details', function(address){
    let k = address.length <= 12 ? 'operator_account' : 'address';
    let options = {[k]:address};
    if (address.length <= 12) {
      validator_item = Validators.find({'operator_account': address}).fetch()
      address = validator_item[0].address;
    }
    if (address.indexOf(Meteor.settings.public.bech32PrefixValAddr) != -1){
        options = {operator_address:address}
    }
    return {
        find(){
            return Validators.find(options)
        },
        children: [
            {
                find(val){
                    return VotingPowerHistory.find(
                        {address:val.address},
                        {sort:{height:-1}, limit:50}
                    )
                }
            },
            {
                find(val) {
                    return ValidatorRecords.find(
                        { address: val.address },
                        { sort: {height: -1}, limit: Meteor.settings.public.uptimeWindow}
                    );
                }
            }
        ]
    }
});
