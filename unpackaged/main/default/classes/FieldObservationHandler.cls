global class FieldObservationHandler implements Messaging.InboundEmailHandler {
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.InboundEmail email, Messaging.InboundEnvelope envelope) {
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
        String body = email.plainTextbody;
        body = body.abbreviate(255);
        String title = email.subject;
        String fromVal = email.fromAddress;
        Field_Observation__c observation = new Field_Observation__c(description_of_observation__c = body,name= title,reporter_email__c = fromVal);
        insert observation;
   
        List<Messaging.InboundEmail.BinaryAttachment> attachments  = email.binaryAttachments;
        
      
        if(attachments == null) {//No Attachments, move along
            return result;
        }
        for(Messaging.InboundEmail.BinaryAttachment attachment :attachments) {
                Attachment observationAttachments = new Attachment(body = attachment.body, name = attachment.fileName, parentId = observation.Id);
            	
                insert observationAttachments;
        }
    

        
        update observation;
        return result;
    }
}