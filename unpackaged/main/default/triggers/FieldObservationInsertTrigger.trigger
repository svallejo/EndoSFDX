trigger FieldObservationInsertTrigger on Field_Observation__c (after insert) {
    FieldObservationPredictionHandler handler = new FieldObservationPredictionHandler();
    for(Field_Observation__c observation : Trigger.new) {
		FieldObservationPredictionHandler.attemptToPredictImages(observation.Id);
    }
}