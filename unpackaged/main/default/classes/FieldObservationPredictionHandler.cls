public class FieldObservationPredictionHandler {
    private static final String INTENT_MODEL = '6YXHGOOFMY3IPNWP7E6MHTSL64';
    @future(callout=true)
    public static void attemptToPredictImages(String id) {
        Field_Observation__c observation = [select id,predictions__c,Description_of_Observation__c,reporter_email__c from Field_Observation__c where id = :id];
        List<Attachment> attachments = [select body from Attachment where parentId = :observation.Id];
        String accessToken = null;
        if(attachments != null) {
            VisionController controller = new VisionController();
        	accessToken = controller.getAccessToken();
   
            String imageLabel = null;
            Double probability = 0;
        	for(Attachment attachment : attachments ) {
                            List<Vision.Prediction> predictions = Vision.predictBlob(attachment.body, accessToken, 'FoodImageClassifier');
                System.debug('Found ' + predictions.size());
            	for(Vision.Prediction prediction : predictions) {
                    if(prediction.probability > probability) {
                        probability = prediction.probability;
                        imageLabel = prediction.label;
                    }
                    System.debug('Prediction prediction ' + prediction.label + ' probablility :' + prediction.probability);
                	observation.predictions__c= observation.predictions__c + prediction.label + ' : '+ prediction.probability;
            	}
        	}
            observation.predictions__c = observation.predictions__c + '\r\n*********';
            List<Language.Prediction> predictions = 
                Language.intent(observation.Description_of_Observation__c, accessToken,INTENT_MODEL);
            String route = null;
            Double routeProbability = 0;
            for(Language.Prediction prediction : predictions) {
                if(prediction.probability > routeProbability) {
                    routeProbability = prediction.probability;
                    route = prediction.label;
                }
                observation.Predictions__c = observation.Predictions__c + prediction.label + ':' + prediction.probability;
            }
            if(route == 'quality') {
                CMPL123CME__Complaint__c complaint = new CMPL123CME__Complaint__c();
                CMPL123__Product__c product = [select id from CMPL123__Product__c where classifier__c =:imageLabel];
                complaint.CMPL123CME__Product__c= product.id;
                complaint.Investigation_Summary_and_Conclusion__c = observation.Description_of_Observation__c;
                 insert complaint;
            } else {
                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                List<String> addresses = new List<String>();
                addresses.add(observation.reporter_email__c);
                mail.setToAddresses(addresses);
         
                if(route =='supply') {
                	mail.setPlainTextBody('Thanks for your email. Your complaint on ' + imageLabel + ' has been noted and will be routed to our supply division');
                }else {
                    mail.setPlainTextBody('Sorry Hal, I cannot do that.  Please send your spam elsewhere');
                }    
                Messaging.sendEmail(new Messaging.Email[]{mail});
            }  
    	}
       
        update observation;
	}
}