/*
This file is generated and isn't the actual source code for this
managed global class.
This read-only file shows the class's global constructors,
methods, variables, and properties.
To enable code to compile, all methods return null.
*/
global class DMSEmailNotification {
    global DMSEmailNotification() {

    }
    global static void sendEmail(String subject, String emailBody, String receiverId) {

    }
    global static void sendNotification(SPARTADMS.DMSEmailNotification.EmailNotification notification) {

    }
    @InvocableMethod
    global static void sendNotification(List<SPARTADMS.DMSEmailNotification.EmailNotification> notificationList) {

    }
global class EmailNotification {
    @InvocableVariable( required=true)
    global String emailTemplateAPIName;
    @InvocableVariable( required=true)
    global String receiver;
    @InvocableVariable( required=true)
    global Id recordId;
    global EmailNotification() {

    }
}
}
