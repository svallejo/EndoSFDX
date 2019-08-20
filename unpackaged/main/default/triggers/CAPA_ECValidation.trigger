trigger CAPA_ECValidation on CAPA_Effectiveness_Check__c (before update)
{    
    if(Trigger.isBefore && Trigger.isUpdate)
    {
        for(CAPA_Effectiveness_Check__c ec : Trigger.New)
        {
            if(ec.CAPA_ParentWorkFlowStatus__c == 'Closed - CAPA')
            {
                ec.addError('You cannot modify the EC once the CAPA status is closed');
            }
        }
    }
}