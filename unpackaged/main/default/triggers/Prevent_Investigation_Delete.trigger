trigger Prevent_Investigation_Delete on CMPL123CME__Investigation__c (before delete) {
    Set<ID> compliantIdSet = New Set<ID>();
    for(CMPL123CME__Investigation__c investigation : trigger.old) 
       compliantIdSet.add(investigation.cmpl123cme__complaint__c);
    
    if(compliantIdSet.size() > 0){
        Map<Id, CMPL123CME__Complaint__c> complaintsMap = new Map<Id, CMPL123CME__Complaint__c>([Select Id From CMPL123CME__Complaint__c 
                                     Where CMPL123CME__CMPL123_WF_Status__c = 'Closed - Completed' and Id IN: compliantIdSet]);
        
        for(CMPL123CME__Investigation__c investigation : trigger.old) 
            if(investigation.CMPL123CME__Complaint__c != null && complaintsMap.get(investigation.CMPL123CME__Complaint__c) != null)
                investigation.addError('You cannot delete an investigation.');
    }
    
    Set<ID> InquiryIdSet = New Set<ID>();
    for(CMPL123CME__Investigation__c investigation : trigger.old) 
       InquiryIdSet.add(investigation.Inquiry__c);
    
    if(InquiryIdSet.size() > 0){
        Map<Id, Inquiry__c> InquiresMap = new Map<Id, Inquiry__c>([Select Id From Inquiry__c 
                                     Where CMPL123_WF_Status__c = 'Closed - Complaint' and Id IN: InquiryIdSet]);
        
        for(CMPL123CME__Investigation__c investigation : trigger.old) 
            if(investigation.Inquiry__c != null && InquiresMap.get(investigation.Inquiry__c) != null)
                investigation.addError('You cannot delete an investigation.');
    }
}