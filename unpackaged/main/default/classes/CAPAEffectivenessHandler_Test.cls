@IsTest public class CAPAEffectivenessHandler_Test {
     @IsTest public static void testCAPAEffectivenessHandlerNegative () {
       
         // User initialization
         Profile p = [select id from profile where name='Standard User'];
         
         User u = new User(alias = 'utest', email='utest@email.com',
                           emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
                           localesidkey='en_US', profileid = p.Id, country='United States',
                           timezonesidkey='America/Los_Angeles', username='utest@email.com');
         insert u;
       
         //Devices
         CMPL123__Device__c device = new CMPL123__Device__c();
         device.Name = '123Test';
         try{
         insert device;
         }
         catch(Exception ex)
         {
             system.debug(ex);
         }
         
         //CAPA Object
         CMPL123QMS__CAPA__c capaObj = new CMPL123QMS__CAPA__c();
         capaObj.CMPL123QMS__CAPA_Type__c = 'Corrective Action';
         capaObj.Description__c = 'UTest';
         capaObj.Short_Description__c = 'UTest';
         capaObj.Date_Initiated__c = Date.today();
         capaObj.Investigation_Required__c = 'Yes';
         capaObj.CAPA_Owner__c = u.id;
         capaObj.Action_Plan__c ='To Test!';
         insert capaObj;
         
         // CAPA_Effectiveness_Check__c Object
         CAPA_Effectiveness_Check__c capaEffObj = new CAPA_Effectiveness_Check__c();
         capaEffObj.CAPA__c = capaObj.id;
         insert capaEffObj;
         
        }
        
        @IsTest(SeeAllData=true)  public static void testCAPAEffectivenessHandlerPositive () {
       
        // User initialization
        Profile p = [select id from profile where name='Standard User'];

        User u = new User(alias = 'utest', email='utest@email.com',
            emailencodingkey='UTF-8', lastname='Testing', languagelocalekey='en_US',
            localesidkey='en_US', profileid = p.Id, country='United States',
            timezonesidkey='America/Los_Angeles', username='utest@email.com');
        insert u;
         //Devices
        
        CMPL123__Device__c device = new CMPL123__Device__c();
        device.Name = 'ABCDTEST2';
        insert device;
         
            //CAPA Object
            CMPL123QMS__CAPA__c capaObj = new CMPL123QMS__CAPA__c();
            capaObj.CMPL123QMS__CAPA_Type__c = 'Corrective Action';
            capaObj.Description__c = 'UTest';
            capaObj.Short_Description__c = 'UTest';
            capaObj.Date_Initiated__c = Date.today();
            capaObj.Investigation_Required__c = 'Yes';
            capaObj.CAPA_Owner__c = u.id;
            capaObj.Action_Plan__c ='To Test!';
            try{
            insert capaObj;
            }
            catch(Exception ex)
            {
                system.debug(ex);
            }
            // CAPA_Effectiveness_Check__c Object
            CAPA_Effectiveness_Check__c capaEffObj = new CAPA_Effectiveness_Check__c();
            capaEffObj.CAPA__c = capaObj.id;
            insert capaEffObj;
        
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
            catch(Exception ex){
                            system.debug('In the + method ' + ex);
            }
        }

}