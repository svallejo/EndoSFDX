/*

    THIS IS AN AUTO-GENERATED TRIGGER CREATED BY 123COMPLIANCE PLATFORM PACKAGE DURING AUDIT/WORKFLOW SETUP



    Note: Follow the guidelines how to use/implement 123 Audit/workflow Triggers



    1. BeforeUpdate / BeforeDelete : Add your custom code before AuditHandler. AuditHandler code should be in last line.

    2. AfterInsert/AfterUpdate : Add your custom code after  AuditHandler. AuditHandler code should be in first line in that block.

*/



trigger CMPL123CME_Questionnaire_AuditTrigger on CMPL123CME__Questionnaire__c (before update,before delete,after insert,after update){



    if(Trigger.isInsert && Trigger.isBefore){

    }

    /* After Insert */

    else if(Trigger.isInsert && Trigger.isAfter){

        CMPL123.AuditHandler.handleAudit();

        CMPL123CME.Questionnaire_TriggerHandler questionareTrigHandler = new CMPL123CME.Questionnaire_TriggerHandler ();
        questionareTrigHandler.createQuestionareItems();

    }

    /* Before Update */

    else if(Trigger.isUpdate && Trigger.isBefore){

        CMPL123.AuditHandler.handleAudit();

    }

    /* After Update */

    else if(Trigger.isUpdate && Trigger.isAfter){

        CMPL123.AuditHandler.handleAudit();

        CMPL123CME.Questionnaire_TriggerHandler questionareTrigHandler = new CMPL123CME.Questionnaire_TriggerHandler ();
        questionareTrigHandler.createQuestionareItems();

    }

    /* Before Delete */

    else if(Trigger.isDelete && Trigger.isBefore){
        AssessmentHandler.preventAssessmentDelete(Trigger.old);
        CMPL123.AuditHandler.handleAudit();

    }

    /* After Delete */

    else if(Trigger.isDelete && Trigger.isAfter){

    }

}