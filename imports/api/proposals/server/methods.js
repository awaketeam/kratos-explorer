import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { Proposals } from '../proposals.js';
import { Validators } from '../../validators/validators.js';
// import { Promise } from 'meteor/promise';

Meteor.methods({
    'proposals.getProposals': function(){
        this.unblock();
        try{
            let url = LCD + '/gov/proposals';
            let response = HTTP.get(url);
            let proposals = JSON.parse(response.content).result;
            // added_start
            proposals.forEach(item => {
              item.proposalId = item.ProposalBase.id;
              item.id = item.ProposalBase.id;
              item.proposal_status = item.ProposalBase.status;
            })
            // added_end

            let finishedProposalIds = new Set(Proposals.find(
                // added_start
                {"proposal_status":{$in:["Passed", "Rejected", "Failed"]}}
                // added_end
                // old_start
                // {"proposal_status":{$in:["Passed", "Rejected", "Removed"]}}
                // old_end
            ).fetch().map((p)=> p.proposalId));

            let proposalIds = [];
            if (proposals.length > 0){
                // Proposals.upsert()
                const bulkProposals = Proposals.rawCollection().initializeUnorderedBulkOp();
                for (let i in proposals){
                    let proposal = proposals[i];
                    proposal.proposalId = parseInt(proposal.id);
                    if (proposal.proposalId > 0 && !finishedProposalIds.has(proposal.proposalId)) {
                        try{
                            let url = LCD + '/gov/proposals/'+proposal.proposalId+'/proposer';

                            let response = HTTP.get(url);
                            if (response.statusCode == 200){
                                let proposer = JSON.parse(response.content).result;
                                if (proposer.proposal_id && (proposer.proposal_id == proposal.id)){
                                    proposal.proposer = proposer.proposer;
                                }
                            }
                            bulkProposals.find({proposalId: proposal.proposalId}).upsert().updateOne({$set:proposal});
                            proposalIds.push(proposal.proposalId);
                        }
                        catch(e){
                            bulkProposals.find({proposalId: proposal.proposalId}).upsert().updateOne({$set:proposal});
                            proposalIds.push(proposal.proposalId);
                        }
                    }
                }
                // added_start
                bulkProposals
                .find({proposalId:{$nin:proposalIds}, proposal_status:{$nin:["Passed", "Rejected", "Failed"]}})
                .update({$set: {"proposal_status": "Failed"}});
                // added_end
                // old_start
                // bulkProposals
                // .find({proposalId:{$nin:proposalIds}, proposal_status:{$nin:["Passed", "Rejected", "Removed"]}})
                // .update({$set: {"proposal_status": "Removed"}});
                // old_end
                bulkProposals.execute();
            }
            return true
        }
        catch (e){
            console.log(e);
        }
    },
    'proposals.getProposalResults': function(){
        this.unblock();
        // added_start
        let proposals = Proposals.find({"proposal_status":{$nin:["Passed", "Rejected", "Failed"]}}).fetch();
        // added_end

        // old_start
        // let proposals = Proposals.find({"proposal_status":{$nin:["Passed", "Rejected", "Removed"]}}).fetch();
        // old_end


        if (proposals && (proposals.length > 0)){
            for (let i in proposals){
                if (parseInt(proposals[i].proposalId) > 0){
                    try{
                        // get proposal deposits
                        let url = LCD + '/gov/proposals/'+proposals[i].proposalId+'/deposits';
                        let response = HTTP.get(url);
                        let proposal = {proposalId: proposals[i].proposalId};
                        if (response.statusCode == 200){
                            let deposits = JSON.parse(response.content).result;
                            proposal.deposits = deposits;
                        }

                        url = LCD + '/gov/proposals/'+proposals[i].proposalId+'/votes';
                        response = HTTP.get(url);
                        if (response.statusCode == 200){
                            let votes = JSON.parse(response.content).result;
                            proposal.votes = getVoteDetail(votes);
                        }

                        url = LCD + '/gov/proposals/'+proposals[i].proposalId+'/tally';
                        response = HTTP.get(url);
                        if (response.statusCode == 200){
                            let tally = JSON.parse(response.content).result;
                            proposal.tally = tally;
                        }

                        proposal.updatedAt = new Date();
                        Proposals.update({proposalId: proposals[i].proposalId}, {$set:proposal});
                    }
                    catch(e){

                    }
                }
            }
        }
        return true
    }
})

const getVoteDetail = (votes) => {
    if (!votes) {
        return [];
    }

    let voters = votes.map((vote) => vote.voter);
    let votingPowerMap = {};
    let validatorAddressMap = {};
    // added_1_start
    let vp = {
      'operator_account': {'$in': voters}
    }
    Validators.find(vp).forEach((validator) => {
        votingPowerMap[validator.operator_account] = {
            moniker: validator.description.moniker,
            address: validator.address,
            tokens: parseFloat(validator.tokens),
            delegatorShares: parseFloat(validator.delegator_shares),
            deductedShares: parseFloat(validator.delegator_shares)
        }
        validatorAddressMap[validator.operator_address] = validator.operator_account;
        validatorAddressMap[validator.operator_account] = validator.operator_account;
    });
    // added_1_end
    // old_1_start
    // Validators.find({delegator_address: {$in: voters}}).forEach((validator) => {
    //     votingPowerMap[validator.delegator_address] = {
    //         moniker: validator.description.moniker,
    //         address: validator.address,
    //         tokens: parseFloat(validator.tokens),
    //         delegatorShares: parseFloat(validator.delegator_shares),
    //         deductedShares: parseFloat(validator.delegator_shares)
    //     }
    //     validatorAddressMap[validator.operator_address] = validator.delegator_address;
    // });
    // old_1_end

    voters.forEach((voter) => {
        if (!votingPowerMap[voter]) {
            // voter is not a validator
            let url = `${LCD}/staking/delegators/${voter}/delegations`;
            let delegations;
            let votingPower = 0;
            try{
                let response = HTTP.get(url);
                if (response.statusCode == 200){
                    delegations = JSON.parse(response.content).result;
                    if (delegations && delegations.length > 0) {
                        delegations.forEach((delegation) => {
                            let shares = parseFloat(delegation.shares);
                            if (validatorAddressMap[delegation.validator_account]) {
                                // deduct delegated shareds from validator if a delegator votes
                                let validator = votingPowerMap[validatorAddressMap[delegation.validator_account]];
                                validator.deductedShares -= shares;
                                if (validator.delegator_shares != 0){ // avoiding division by zero
                                    votingPower += (shares/validator.delegatorShares) * validator.tokens;
                                }

                            } else {
                                // added_1_start
                                let validator = Validators.findOne({operator_account: delegation.validator_account});
                                // added_1_end
                                // old_1_start
                                // let validator = Validators.findOne({operator_address: delegation.validator_address});
                                // old_1_end
                                if (validator && validator.delegator_shares != 0){ // avoiding division by zero
                                    votingPower += (shares/parseFloat(validator.delegator_shares)) * parseFloat(validator.tokens);
                                }
                            }
                        });
                    }
                }
            }
            catch (e){
                console.log(e);
            }
            votingPowerMap[voter] = {votingPower: votingPower};
        }
    });
    return votes.map((vote) => {
        let voter = votingPowerMap[vote.voter];
        let votingPower = voter.votingPower;
        if (votingPower == undefined) {
            // voter is a validator
            votingPower = voter.delegatorShares?((voter.deductedShares/voter.delegatorShares) * voter.tokens):0;
        }
        return {...vote, votingPower};
    });
}
