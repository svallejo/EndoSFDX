public class POC_On_AutoUpdateChild implements Queueable{
    
    private List<CMPL123CME__Investigation__c> investigationRecordList;
    
    public POC_On_AutoUpdateChild(List<CMPL123CME__Investigation__c> actionItemRecords) {
        this.investigationRecordList = actionItemRecords;
    }
    public void execute(QueueableContext context) {
        if(investigationRecordList.size() > 0){
            CMPL123CME__Investigation__c changeControlRecord = investigationRecordList.get(0);
            changeControlRecord.CMPL123Task_Key_Value__c = 'INVE';
            update changeControlRecord;
            investigationRecordList.remove(0);
            System.enqueueJob(new POC_On_AutoUpdateChild(investigationRecordList));
        }
    }
}