/**
#############################################################################
#  File Name     : InvestigationHandler_Test_Class
#  Author        : Sparta Systems 
#  Description: public class which is used to handle all the custom functioanlity on investigation object. 


#############################################################################
*/     
    @isTest public class InvestigationHandler_Test {
    @IsTest public static void testInvestigationHandler1() {
        // User initialization
        Profile p = [select id from profile where name='Standard User'];
        
        User u = new User(alias = 'utest', email='utest@email.com',
                          emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                          localesidkey='en_US', profileid = p.Id, country='United States',
                          timezonesidkey='America/Los_Angeles', username='utest@email.com');
        insert u;
        
        //complaint obj:
        CMPL123CME__Complaint__c complaintObj;
        complaintObj = new CMPL123CME__Complaint__c();
        complaintObj.CMPL123CME__Assigned_To__c = u.Id;
        complaintObj.CMPL123CME__Short_Description__c ='UnitTest';
        complaintObj.CMPL123CME__Initiator__c = u.id;
        complaintObj.CMPL123CME__Supervisor__c = u.Id;
        complaintObj.CMPL123CME__Impact__c = 'High';
      
        insert complaintObj;

        List<CMPL123CME__Investigation__c> lstInvObj = new List<CMPL123CME__Investigation__c> ();
        
        CMPL123CME__Investigation__c InvObj;
        InvObj = new CMPL123CME__Investigation__c();
        InvObj.CMPL123CME__Complaint__c = complaintObj.Id;
        lstInvObj.add(InvObj);
        
        InvObj = new CMPL123CME__Investigation__c();
        InvObj.CMPL123CME__Complaint__c = complaintObj.Id;
        InvObj.Name = complaintObj.CMPL123CME__Short_Description__c;
        lstInvObj.add(InvObj);
        
        insert lstInvObj;
        delete lstInvObj;
        
    }
     @IsTest public static void testInvestigationHandler2() {
        // User initialization
        Profile p = [select id from profile where name='Standard User'];
        
        User u = new User(alias = 'utest', email='utest@email.com',
                          emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                          localesidkey='en_US', profileid = p.Id, country='United States',
                          timezonesidkey='America/Los_Angeles', username='utest@email.com');
        insert u;
        
        //complaint obj:
        CMPL123CME__Complaint__c complaintObj;
        complaintObj = new CMPL123CME__Complaint__c();
        complaintObj.CMPL123CME__Assigned_To__c = u.Id;
        complaintObj.CMPL123CME__Short_Description__c ='UnitTest';
        complaintObj.CMPL123CME__Initiator__c = u.id;
        complaintObj.CMPL123CME__Supervisor__c = u.Id;
        complaintObj.CMPL123CME__Impact__c = 'High';
    
         
        insert complaintObj;
        complaintObj.Assessment_Completed__c = true;
         complaintObj.Investigation_Status__c= 'Investigation Completed';
         update complaintObj;
         complaintObj.CMPL123CME__CMPL123_WF_Status__c = 'Closed - Completed';
         
        List<CMPL123CME__Investigation__c> lstInvObj = new List<CMPL123CME__Investigation__c>();
        
        CMPL123CME__Investigation__c InvObj;
        for(Integer i =0;i<2 ; i++)
        {
        InvObj = new CMPL123CME__Investigation__c();
        InvObj.CMPL123CME__Complaint__c = complaintObj.Id;
        InvObj.Name = complaintObj.CMPL123CME__Short_Description__c;
        lstInvObj.add(InvObj);
        }
            
         
        insert lstInvObj;
        delete lstInvObj;
        
    }
}