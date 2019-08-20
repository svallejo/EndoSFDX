trigger OnCaseUpdateTrigger on Case (before update) {
    CaseUpdateHandler handler = new CaseUpdateHandler();
    for(Case c : Trigger.new) {
		handler.handleCase(c);
    }
}