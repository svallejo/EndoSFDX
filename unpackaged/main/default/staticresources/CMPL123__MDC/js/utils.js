/////////////////////////////////////////////////////////////
// String
/////////////////////////////////////////////////////////////
// for IE compatibility - use this instead of String.endsWith
String.prototype.stringEndsWith = function(endsWith) {
	return this.lastIndexOf(endsWith) === (this.length - endsWith.length);
};

/////////////////////////////////////////////////////////////
// StringBuilder
/////////////////////////////////////////////////////////////
function StringBuilder(blockSize) {
	this.__blockSize = blockSize || 100;
	this.__stringLength = 0;
	this.length = blockSize;
}
StringBuilder.prototype = new Array();
StringBuilder.prototype.constructor = StringBuilder;

StringBuilder.prototype.append = function(appendString) {
	var _appendString = String(appendString);
	
	if (this.__stringLength + _appendString.length > this.length) {
		this.length += this.__blockSize;
	}
	
	for (var i = 0; i < _appendString.length; i++, this.__stringLength++) {
		this[this.__stringLength] = _appendString[i];
	}
	
	return this;
};

StringBuilder.prototype.toString = function() {
	this.length = this.__stringLength;
	return Array.prototype.join.call(this, "");
};

StringBuilder.prototype.clear = function() {
	this.length = this.__blockSize;
	this.__stringLength = 0;
};


////////////////////////////////////////////////////////
// mdc.Utility
////////////////////////////////////////////////////////

mdc.Utility.prototype.objectValues = function(obj) {
	var values = [];
	for(var key in obj) {
    	values.push(obj[key]);
	}
	return values;
};



////////////////////////////////////////////////////////
// mdc.sfdc.PublicGroupUtil
////////////////////////////////////////////////////////


mdc.sfdc.PublicGroupUtil.prototype.isUserInGroup = function(userId, groupName) {

       var connection = new mdc.sfdc.Connection();
	
	// user directly in group
	var sb = new StringBuilder();
	sb.append("SELECT COUNT() FROM GroupMember WHERE Group.Name = '");
	sb.append(groupName);
	sb.append(" AND UserOrGroupId = '");
	sb.append(userId);
	sb.append("'");
	
	if (connection.query().size > 0){
		return true;
	};
};



mdc.sfdc.PublicGroupUtil.prototype.__userInPublicGroup = function(userId, userRoleId, publicGroupId, connection) {

	var directUser = connection.query("SELECT Id FROM GroupMember" +
		" WHERE Group.Id = '" + publicGroupId + "' AND UserOrGroupId = '" + userId + "'");
	
	if (directUser.length > 0)
	{
		return true;		
	}
	
	//var userRoleInGroup = connection.query("SELECT Id FROM GroupMember WHERE Group.Id ='" + publicGroupId + "'" +
	//	" AND UserOrGroupId IN(SELECT Id FROM Group WHERE RelatedId ='" + userRoleId + "')");

	var userRoleInGroup = [];
	
	if (userRoleId !== null) {
		userRoleInGroup = connection.query("SELECT Id FROM GroupMember WHERE Group.Id ='" + publicGroupId + "'" +
			" AND UserOrGroupId IN(SELECT Id FROM Group WHERE RelatedId ='" + userRoleId + "')");
	}
	
	if (userRoleInGroup.length > 0)
	{
		return true;		
	}		
	
	// find all public groups contained in this public group and recursive call __userInPublicGroup
	var publicGroupGroups = connection.query("SELECT Id, Name FROM Group WHERE Type='Regular' AND Id IN (" +
		"SELECT UserOrGroupId FROM GroupMember WHERE Group.Id = '" + publicGroupId + "')");
		
	for (var i = 0; i < publicGroupGroups.length; i++) {
		var publicGroupGroup = publicGroupGroups[i];
		if (this.__userInPublicGroup(userId, userRoleId, publicGroupGroup.Id, connection)) {
			return true;
		}
	}		
	
	return false;
};

mdc.sfdc.PublicGroupUtil.prototype.getAllPublicGroupsForUser = function(userId) {

	var userPublicGroups = {};
       var connection = new mdc.sfdc.Connection();

	var allPublicGroups = 
		connection.query("SELECT Id, Name FROM Group WHERE Type = 'Regular'");
		
	var roleUsers = connection.query("SELECT UserRoleId FROM User WHERE Id = '" + userId + "'");
	var userRoleId = (roleUsers.length > 0 && roleUsers[0].UserRoleId !== null) ? roleUsers[0].UserRoleId : null;
		
	for (var i = 0; i < allPublicGroups.length; i++) {
		var publicGroup = allPublicGroups[i];
		
		if (this.__userInPublicGroup(userId, userRoleId, publicGroup.Id, connection)) {
			userPublicGroups[publicGroup.Id] = publicGroup.Name;
		}
	}
			
	return Util.objectValues(userPublicGroups);
	
};

////////////////////////////////////////////////////////
// mdc.sfdc.Describe
////////////////////////////////////////////////////////
mdc.sfdc.Describe.prototype.describeSObject = function(objectName) {

	if (!this.ObjectDescriptors[objectName]) {
	
		var describe = sforce.connection.describeSObject(objectName);
		
		var descriptor = {
			label: describe.label,
			fields: [],
			getFieldLabel: function(objectName, fieldName) {
			
				for (i = 0; i < this.fields.length; i++) {
					if (this.fields[i].name === fieldName) {
						return this.fields[i].label;
					}
				}
				return "";
			},
			getFieldLabelWithoutID: function(objectName, fieldName) {
				var fieldLabel = this.getFieldLabel(objectName, fieldName);
				if (fieldLabel.stringEndsWith(" ID")) {
					fieldLabel = fieldLabel.substr(0, fieldLabel.length - " ID".length);
				}
				
				return fieldLabel;				
			}				
		};
		
		for (var i = 0; i < describe.fields.length; i++) {

			var field = describe.fields[i];
			
			descriptor.fields.push({
				name: field.name,
				label: field.label,
				length: field.length
			});
		}
		
		this.ObjectDescriptors[objectName] = descriptor;
	}
	
	return this.ObjectDescriptors[objectName];
};	

mdc.sfdc.Describe.prototype.ObjectDescriptors = {

};
