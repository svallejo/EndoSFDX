trigger CMPL_123_INV_ITEMS on CMPL123CME__Investigation__c (after insert,after update){



  CMPL123CME.Investigation_TriggerHandler investigationTrigHandler = new

           CMPL123CME.Investigation_TriggerHandler ();

  investigationTrigHandler.createInvestigationItems();

}