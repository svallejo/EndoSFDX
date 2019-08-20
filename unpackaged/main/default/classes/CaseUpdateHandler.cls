public class CaseUpdateHandler {
	private static final String CASE_MOVEMENT_STATUS = 'Escalated';
    
    private static final String CONNECTION_ID = '04P41000000blJd';
    
    public void handleCase(Case caseToMove) {
        if(caseToMove.Status == CASE_MOVEMENT_STATUS) {
            PartnerNetworkRecordConnection connection = new PartnerNetworkRecordConnection(connectionId = CONNECTION_ID,LocalRecordId = caseToMove.Id);
            insert connection;
        }
    }
}