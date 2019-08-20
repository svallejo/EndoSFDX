/*
File Name: CAPAPlanHandler_Test
Author: Sparta Systems
Description: public method, which is referenced in the CAPA plan audit trigger.
Requirement: JIRA 819 , User should not be able to Send Action Plan for Approval without any Tasks
*/

@IsTest public class CAPAPlanHandler_Test {
    @IsTest public static void testCAPAPlanHandler() {
      // User initialization
        Profile p = [select id from profile where name='Standard User'];

        User u = new User(alias = 'utest', email='utest@email.com',
            emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
            localesidkey='en_US', profileid = p.Id, country='United States',
            timezonesidkey='America/Los_Angeles', username='utest@email.com');
        insert u;
        
        //Devices
        
        CMPL123__Device__c device = new CMPL123__Device__c();
        device.Name = '12345';
        insert device;
        
        //CAPA Object
        CMPL123QMS__CAPA__c capaObj = new CMPL123QMS__CAPA__c();
        capaObj.CMPL123QMS__CAPA_Type__c ='Corrective Action';
        capaObj.Short_Description__c ='uTest';
        capaObj.Description__c = 'uTest';
        capaObj.Date_Initiated__c = Date.Today();
        capaObj.Investigation_Required__c = 'Yes';
        capaObj.CAPA_Owner__c = u.id;
        capaObj.Action_Plan__c ='To Test!';
        insert capaObj;
        
        Task tskObj = new Task();
        tskobj.OwnerId = u.id;
        tskObj.Subject ='Call';
        tskObj.Status  ='In Progress';
        tskObj.Priority = 'Normal';
        insert tskObj;
        
        //CAPA Plan Object
        CAPA_Plan__c cPlan = new CAPA_Plan__c();
        cPlan.Name = 'UTest';
        cPlan.CAPA__c = capaObj.Name;
        insert cPlan;
        
        //create a task for the user
        //Task newTask = new Task(Subject='Complete Survey for Transaction');
        Task newTask = new Task(Subject = 'Call',
                                Description = 'Survey Transaction',
                                Priority = 'Normal', 
                                Status = 'In Progress', 
                                IsReminderSet = true, 
                                ReminderDateTime = System.now()+1); 
        
        try{
            insert newTask;
        }
        catch(Exception ex)
        {
            system.debug(ex);
        }
   
    }
    
    @IsTest public static void testCAPAPlanHandlerNegative() {
      // User initialization
        Profile p = [select id from profile where name='Standard User'];

        User u = new User(alias = 'utest', email='utest@email.com',
            emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
            localesidkey='en_US', profileid = p.Id, country='United States',
            timezonesidkey='America/Los_Angeles', username='utest@email.com');
        insert u;
        
        //Devices
        
        CMPL123__Device__c device = new CMPL123__Device__c();
        device.Name = '12345';
        insert device;
        
        //CAPA Object
        CMPL123QMS__CAPA__c capaObj = new CMPL123QMS__CAPA__c();
        capaObj.CMPL123QMS__CAPA_Type__c ='Corrective Action';
        capaObj.Short_Description__c ='uTest';
        capaObj.Description__c = 'uTest';
        capaObj.Date_Initiated__c = Date.Today();
        capaObj.Investigation_Required__c = 'Yes';
        capaObj.CAPA_Owner__c = u.id;
        capaObj.Action_Plan__c ='To Test!';
        insert capaObj;
        
        Task tskObj = new Task();
        tskobj.OwnerId = u.id;
        tskObj.Subject ='Call';
        tskObj.Status  ='In Progress';
        tskObj.Priority = 'Normal';
        insert tskObj;
        
        //CAPA Plan Object
        CAPA_Plan__c cPlan = new CAPA_Plan__c();
        cPlan.Name = 'UTest';
        cPlan.CAPA__c = capaObj.Name;
        insert cPlan;
                
    }
}