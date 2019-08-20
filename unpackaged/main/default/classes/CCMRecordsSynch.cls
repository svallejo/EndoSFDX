public class CCMRecordsSynch {
    private static final String IDS_ELEMENT = 'ids';
    
	private List<Integer> ids;
    
    private Map<Integer,SObject> existing;
    
    public void synchCCMRecords(String xml) {
        Dom.Document document = new Dom.Document();
        document.load(xml);
     	
    }
    
    
}