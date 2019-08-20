/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class OrphanMigrationFixPerDocument {
    global Map<String,String> docStatusesMap;
    global Map<String,Map<String,String>> docTypesTreeMap;
    global Boolean expectWorkingFolders;
    global static String FILE_PROMOTE_VERSION_URL;
    global Boolean forReal;
    global Boolean isMissingBoxDocument;
    global List<String> log;
    global List<String> rootFolders;
    global SPARTADMS.DMSBoxService service;
    global OrphanMigrationFixPerDocument() {

    }
    global String fetchEtagForFile(String fileId) {
        return null;
    }
    global List<String> findBoxFolder(String searchTerm, String foldersToSearch) {
        return null;
    }
    global void fixCorruptedDocument(String corpDocumentId) {

    }
    global List<String> fixDocument(String corpDocumentId) {
        return null;
    }
    global void fixEtag(String corpDocId) {

    }
    global SPARTADMS.OrphanMigrationFixPerDocument forReal() {
        return null;
    }
    global List<String> getBoxEffectiveDocIds() {
        return null;
    }
    global SPARTADMS.OrphanMigrationFixPerDocument overrideExpectWorkingFolders() {
        return null;
    }
    global SPARTADMS.OrphanMigrationFixPerDocument setForReal(Boolean forReal) {
        return null;
    }
}
