@isTest public class AssessmentHandler_Test {
    @IsTest public static void testAssessmentHandler1() {
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
        complaintObj.CMPL123CME__Impact__c = 'Low';
        insert complaintObj;

        List<CMPL123CME__Questionnaire__c> lstQuestObj = new List<CMPL123CME__Questionnaire__c> ();
        
        CMPL123CME__Questionnaire__c qustObj;
        qustObj = new CMPL123CME__Questionnaire__c();
        qustObj.CMPL123CME__Complaint__c = complaintObj.Id;
        lstQuestObj.add(qustObj);
        
        qustObj = new CMPL123CME__Questionnaire__c();
        qustObj.CMPL123CME__Complaint__c = complaintObj.Id;
        lstQuestObj.add(qustObj);
        
        insert lstQuestObj;
        delete lstQuestObj;
        
    }
     @IsTest public static void testAssessmentHandler2() {
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
        complaintObj.CMPL123CME__Impact__c = 'Low';
         complaintObj.CMPL123CME__CMPL123_WF_Action__c = 'Close - Complaint';
         
        insert complaintObj;
        complaintObj.Assessment_Completed__c = true;
         complaintObj.Investigation_Status__c= 'Investigation Completed';
         update complaintObj;
         
        List<CMPL123CME__Questionnaire__c> lstQuestObj = new List<CMPL123CME__Questionnaire__c>();
        
        CMPL123CME__Questionnaire__c qustObj;
        for(Integer i =0;i<2 ; i++)
        {
        qustObj = new CMPL123CME__Questionnaire__c();
        qustObj.CMPL123CME__Complaint__c = complaintObj.Id;
        lstQuestObj.add(qustObj);
        }
            
         
        insert lstQuestObj;
        delete lstQuestObj;
        
    }
}