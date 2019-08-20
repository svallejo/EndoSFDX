/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class CorruptionReportBatch implements Database.AllowsCallouts, Database.Batchable<SObject>, Database.Stateful {
    global Integer boxAPIfolderItemsLimitCount;
    global Integer brokenCount;
    global String currentDocName;
    global Map<String,String> docStatusesMap;
    global Map<String,Map<String,String>> docTypesTreeMap;
    global String lastDocName;
    global List<String> log;
    global String query;
    global List<String> recipients;
    global CorruptionReportBatch() {

    }
    global void execute(Database.BatchableContext bc, List<SObject> scope) {

    }
    global List<String> findAllBoxEffectiveFolderIds() {
        return null;
    }
    global void finish(Database.BatchableContext bc) {

    }
    global void runReport(SPARTADMS__Corporate_Document__c doc, Map<Id,Datetime> wfhMap) {

    }
    global Database.QueryLocator start(Database.BatchableContext param1) {
        return null;
    }
}
