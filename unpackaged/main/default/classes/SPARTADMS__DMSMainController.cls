/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class DMSMainController {
    global DMSMainController(ApexPages.StandardController controller) {

    }
    global static System.HttpRequest buildRequest(String path, String method, String responseFormat, String bodyContent, String bodyContentType) {
        return null;
    }
    @TestVisible
    global static SPARTADMS.DMSMainController.Response buildResponse(System.HttpResponse httpRes) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String doCorpDocCheckout(String recId) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String doCorpDocObsolete(String recId) {
        return null;
    }
    @AuraEnabled
    global static SPARTADMS.DMSMainController.FileViewerInner getApprovedFileDetails(String recordId) {
        return null;
    }
    @AuraEnabled
    global static String getCorpDocPrintDetails(String recordId) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static SPARTADMS__Corporate_Document__c getCorpDocument(String recId) {
        return null;
    }
    @AuraEnabled
    global static String getCorporateDocuments() {
        return null;
    }
    @AuraEnabled
    global static String getDownloadFile(String corpoDocRecId) {
        return null;
    }
    @AuraEnabled
    global static String getEffectiveVersionDetails(String recordId) {
        return null;
    }
    @AuraEnabled
    global static String getExpiringEmbedURLEffective(String corpoDocRecId) {
        return null;
    }
    @AuraEnabled
    global static String getExpiringEmbedURLWorking(String corpoDocRecId) {
        return null;
    }
    @AuraEnabled
    global static SPARTADMS.DMSMainController.FileViewerInner getFileDetails(String recordId) {
        return null;
    }
    @AuraEnabled
    global static String getFileURL(String boxFileId, String versionId) {
        return null;
    }
    @AuraEnabled
    global static String getLockDetails(String corpoDocRecId) {
        return null;
    }
    global static String getLoggedInUserType(String uId, String docId, String versionStatus) {
        return null;
    }
    @AuraEnabled
    global static String getRelatedCorpDocs(String recId) {
        return null;
    }
    @AuraEnabled
    @RemoteAction
    global static String getUserInfo() {
        return null;
    }
    @AuraEnabled
    global static String getVersionDetails(String recordId) {
        return null;
    }
    @AuraEnabled
    global static String getsObjPrefix() {
        return null;
    }
    @AuraEnabled
    global static Boolean isNewDocumentEnabled() {
        return null;
    }
    @AuraEnabled
    global static void lockDocument(String corpoDocRecId) {

    }
    global static System.HttpResponse sendRequest(System.HttpRequest request) {
        return null;
    }
    @AuraEnabled
    global static void unlockDocument(String corpoDocRecId) {

    }
    @AuraEnabled
    global static Boolean validateEditAccess(String corpoDocRecId) {
        return null;
    }
    @AuraEnabled
    global static String validateUserViewAccess(String corpoDocRecId) {
        return null;
    }
global class CorporateDoc {
    global CorporateDoc() {

    }
}
global class FilePreviewer {
    global FilePreviewer() {

    }
}
global class FileViewerInfo {
    global FileViewerInfo() {

    }
}
global class FileViewerInner {
    global List<SPARTADMS.DMSMainController.FileViewerInfo> FileViewerInfoList {
        get;
        set;
    }
    global String status {
        get;
        set;
    }
    global Integer totalPageCount {
        get;
        set;
    }
    global FileViewerInner() {

    }
}
global class Preview {
    global Preview() {

    }
}
global class PreviewUrl {
    global PreviewUrl() {

    }
}
global class RelatedDocs {
    global RelatedDocs() {

    }
}
global class Response {
    global String body;
    global String status;
    global Integer statusCode;
    global Response() {

    }
}
}
