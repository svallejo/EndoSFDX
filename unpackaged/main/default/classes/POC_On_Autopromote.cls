public class POC_On_Autopromote{
    public static void autoPromote(){
        Set<Id> parentIds = new Set<Id>();
        
        for(CMPL123CME__Complaint__c complaint : (List<CMPL123CME__Complaint__c> )Trigger.New){
            
            if(complaint.CMPL123CME__CMPL123_WF_Status__c  == 'Completed') {
                System.debug('----Audit Record Id----'+complaint.Id);
                parentIds.add(complaint.Id);
            }
        }
        List<CMPL123CME__Investigation__c> investigationList = [SELECT Id, Name,CMPL123Task_Key_Value__c,CMPL123_WF_Action__c,CMPL123_WF_Status__c
                                                                FROM CMPL123CME__Investigation__c WHERE CMPL123CME__Complaint__c In : parentIds
                                                                AND CMPL123_WF_Status__c IN ('Released')];
        if(investigationList.size() > 0){
            System.enqueueJob(new POC_On_AutoUpdateChild(investigationList));
        }
    }
    
}