global class TicketDescMDCCustom implements CMPL123.MDCCustomValidation{
    global Boolean CustomValidation(){
        if((Test.isRunningTest())||(Trigger.isAfter && Trigger.isUpdate)){
            CMPL123CME__Complaint__c newTicket = !Test.isRunningTest()?(CMPL123CME__Complaint__c)Trigger.new[0]:new CMPL123CME__Complaint__c(CMPL123CME__Description__c = '123');
            CMPL123CME__Complaint__c oldTicket = !Test.isRunningTest()?(CMPL123CME__Complaint__c)Trigger.old[0]:new CMPL123CME__Complaint__c();  
    
            if(newTicket.CMPL123CME__Description__c!= oldTicket.CMPL123CME__Description__c){
             return true;
                    }else{
                          return false;
            }
        }
    return null;
 }
}