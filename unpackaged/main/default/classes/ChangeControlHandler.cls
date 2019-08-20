/*
File Name: ChangeControlHandler
Author: Sparta Systems
Description: public class which is used to handle all the custom functioanlity on change control object. 
*/
public with sharing class ChangeControlHandler{

    /*
    Input: List<Task>, String
    Output: Void
    Description: public method, which is referenced in the assessment audit trigger, used to address below,
                 1. User should not be able to submit Change Control for Review without any change control plans.
                 2. If any effectiveness checks exist,
                 user should not be able to SUBMIT FINAL REVIEW – EFFECTIVENESS CHECK NOT REQUIRED User should not be able to SUBMIT FINAL REVIEW – EFFECTIVENESS COMPLETE without any Change Control Effectiveness Check plans.
                 3. User should not be able to make any changes to Effectiveness Checks after Change Control has been Approved,
                 Change Control cannot be closed if Effectiveness Check is required but not completed
                 
    Requirement: JIRA 264-A,E,F User should not be able to submit Change Control for Review without any change control plans
    */
     public static void preventChangeControlSubmission(Map<Id,CMPL123QMS__Change_Control__c> changeControlNewMap, Map<Id,CMPL123QMS__Change_Control__c> changeControlOldMap){
        Map<String,Integer> changeControlWithChildCount = new Map<String,Integer>();
        Map<String,Integer> changeControlEffectivenessCount = new Map<String,Integer>();
        Map<String,Boolean> changeControlIncompleteEffectiveness = new Map<String,Boolean>();
        
        for(CMPL123QMS__Change_Control__c cc : [Select Id, Name,(Select Id, CMPL123_WF_Status__c From Change_Control_Plans__r),(Select Id,CMPL123_WF_Status__c From Change_Control_Effectiveness_Check__r) From CMPL123QMS__Change_Control__c Where Id IN:changeControlNewMap.keyset()]){
            changeControlWithChildCount.put(cc.Id, cc.Change_Control_Plans__r.size());
            changeControlEffectivenessCount.put(cc.Id,cc.Change_Control_Effectiveness_Check__r.size());
            
            Boolean pending = false;
            for(Change_Control_Effectiveness_Check__c CCE : cc.Change_Control_Effectiveness_Check__r){
                if(CCE.CMPL123_WF_Status__c != 'Closed - Done'){
                    pending = true;
                    break;
                }
            }
            changeControlIncompleteEffectiveness.put(cc.Id, pending);
            
        }  
        
        for(CMPL123QMS__Change_Control__c cc : changeControlNewMap.values()){
             
            if(cc.CMPL123_WF_Action__c == 'Submit for Review - Change Control' && cc.CMPL123_WF_Action__c != changeControlOldMap.get(cc.Id).CMPL123_WF_Action__c && changeControlWithChildCount.get(cc.Id) != null && changeControlWithChildCount.get(cc.Id) == 0)   
                cc.addError('Cannot submit Change Control for Review without any change control plans');
            else if(cc.CMPL123_WF_Action__c == 'Submit for Approval - Eff. Check Not Required' && cc.CMPL123_WF_Action__c != changeControlOldMap.get(cc.Id).CMPL123_WF_Action__c && changeControlEffectivenessCount.get(cc.Id) != null && changeControlEffectivenessCount.get(cc.Id) > 0)   
                cc.addError('Cannot perform when effectiveness checks exist');
            else if(cc.CMPL123_WF_Action__c == 'Effectiveness Check Plan Created' && cc.CMPL123_WF_Action__c != changeControlOldMap.get(cc.Id).CMPL123_WF_Action__c && changeControlEffectivenessCount.get(cc.Id) != null && changeControlEffectivenessCount.get(cc.Id) == 0)
                cc.addError('Cannot perform effectiveness check plan complete action without any effectiveness checks');
            else if(cc.CMPL123_WF_Action__c == 'Approve Change Control' && cc.CMPL123_WF_Action__c != changeControlOldMap.get(cc.Id).CMPL123_WF_Action__c && changeControlIncompleteEffectiveness.get(cc.Id) != null && changeControlIncompleteEffectiveness.get(cc.Id))
                cc.addError('Cannot be closed if Effectiveness Check is required but not completed');       
        } 
    } 
    
    
    
    public static void preventChangeControlCompleteReview(Map<Id,CMPL123QMS__Change_Control__c> changeControlNewMap, Map<Id,CMPL123QMS__Change_Control__c> changeControlOldMap){
        
        Set<String> penidngChangeControlIdSet = new Set<String>();
        for(CMPL123QMS__Change_Control__c cc : [Select Id,(Select Id From Change_Control_Plans__r Where Plan_SME_Approved__c = false) From CMPL123QMS__Change_Control__c Where Id IN:changeControlNewMap.keyset()]){
            if(cc.Change_Control_Plans__r.size() > 0)
                penidngChangeControlIdSet.add(cc.Id);
        }
        
        for(CMPL123QMS__Change_Control__c cc : changeControlNewMap.values()){
            if(cc.CMPL123_WF_Action__c == 'Complete Review - Change Control' && cc.CMPL123_WF_Action__c != changeControlOldMap.get(cc.Id).CMPL123_WF_Action__c && penidngChangeControlIdSet.contains(cc.Id))
               cc.addError('Cannot perform as there are pending change change control plans');
        }
    
    }
    
    
    
}