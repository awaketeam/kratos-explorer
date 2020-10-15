import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import { Validators } from '/imports/api/validators/validators.js';
import { ValidatorRecords } from '/imports/api/records/records.js';
import { Chain } from '/imports/api/chain/chain.js';
import Validator from './Validator.jsx';

export default ValidatorDetailsContainer = withTracker((props) => {
    let chainHandle;
    let validatorHandle;
    let validatorsHandle;
    let loading = true;

    let address_or_account = props.account || props.address;
    let key_name = address_or_account.length > 12 ? 'operator_address' : 'operator_account'

    if (Meteor.isClient){
        chainHandle = Meteor.subscribe('chain.status');
        validatorsHandle = Meteor.subscribe('validators.all', address_or_account);
        validatorHandle = Meteor.subscribe('validator.details', address_or_account);
        loading = !validatorHandle.ready() && !validatorsHandle.ready() && !chainHandle.ready();
    }

    let options = {[key_name]: address_or_account};

    let chainStatus;
    let validatorExist;
    let validator;
    let validatorRecords;

    if (Meteor.isServer || !loading){
        let qk = address_or_account.length > 12 ? 'operator_address' : 'operator_account';
        if (address_or_account.indexOf(Meteor.settings.public.bech32PrefixValAddr) != -1){
            options = {[qk]:address_or_account}
        }
        validator = Validators.findOne(options);
        if (validator){
            let v_p = {address:validator.address};
            validatorRecords = ValidatorRecords.find({address:validator.address}, {sort:{height:-1}}).fetch();
        }

        chainStatus = Chain.findOne({chainId:Meteor.settings.public.chainId});

        if (Meteor.isServer){
            loading = false;
            validatorExist = !!validator && !!validatorRecords && !!chainStatus;
        }
        else{
            validatorExist = !loading && !!validator && !!validatorRecords && !!chainStatus;
        }

        // loading = false;
    }
    // console.log(props.state.limit);
    return {
        loading,
        validatorExist,
        validator: validatorExist ? validator : {},
        records: validatorExist ? validatorRecords : {},
        chainStatus: validatorExist ? chainStatus : {}
    };
})(Validator);
