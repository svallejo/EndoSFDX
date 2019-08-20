(function ($) {
 
    $.fn.mdcPopup = function(options) {
    
    	this.setTitle = function(title) {
    		this.__titleBox.css({
    			borderBottom: (!title || title.length === 0) ? "none" : "1px solid #999999"
    		})
    		.text(title);
    		
    		return this;
    	};
    
    
    	this.css({
    		width: "300px",
    		height: "200px",
    		border: "1px solid black",
    		position: "absolute",
    		
    		top: "50%",
    		left: "50%",
    		marginTop: "-100px",
    		marginLeft: "-150px",
    		
    		backgroundColor: "white",
    		padding: "20px",
    		display: "none"
    	})
    	.appendTo($("body"));
    	
    	this.__titleBox = $("<div></div>")
    		.css({
    			borderBottom: "1px solid #666666",
    			textAlign: "center",
    			paddingBottom: "10px",
    			fontWeight: "bold"
    		});
    	
    	this.append(this.__titleBox);
    	
    	this.__waitSpinner = $("<div></div>")
    		.addClass("loader")
    		.css({
    			display: "none",
    			margin: "auto",
    			marginTop: "30px"
    		});
    		
    	this.__waitText = $("<div></div>")
    		.css({
    			margin: "30px",
    			textAlign: "center",
    			color: "#444444",
    			display: "none"
    		});
    		
    	this.__messageText = $("<div></div>")
    		.css({
    			margin: "20px",
    			color: "#444444",
    			display: "none"
    		});
    		
    	this.__buttonCell1 = $("<td></td>")
    		.css({
    			width: "100%"
    	});
    	this.__buttonCell2 = $("<td></td>");
    	this.__buttonCell3 = $("<td></td>");
    	this.__buttonCell4 = $("<td></td>");
    	
    	this.__buttonBarTable = $("<table></table>")
    		.append($("<tr></tr>")
    			.append(this.__buttonCell1)
    			.append(this.__buttonCell2)
    			.append(this.__buttonCell3)
    			.append(this.__buttonCell4));
    			
    	
    	this.__buttonBar = $("<div></div>")
    		.css({
    			height: "20px",
    			position: "absolute",
    			left: "0px",
    			right: "0px",
    			bottom: "0px",
    			margin: "20px 30px 40px 30px"
    		})
    		.append(this.__buttonBarTable);
    		
    	this.append(this.__waitSpinner, this.__waitText, this.__messageText, this.__buttonBar);
    	
    	
    	if (options && options.title) {
    		this.setTitle(options.title);
    	}
    		
    	this.close = function() {
    		this.hide();
    		return this;
    	};
    	
    	this.open = function() {
    		this.show();
    		return this;
    	};
    
    	this.waiter = function(options) {
    		this.hide();
    		this.__waitSpinner.show();
    		this.__waitText.show();
   			this.__waitText.text((options && options.waitText) ? options.waitText : "Please wait...");
    		this.show();
    			
    		return this;
    	};
    
    	this.message = function(options) {
    		this.hide();
    		this.__waitSpinner.hide();
    		this.__waitText.hide();
    		this.__messageText.show();		
   			this.__messageText.text((options && options.messageText) ? options.messageText : "");
   			
   			this.__buttonCell1.empty();
   			this.__buttonCell2.empty();
   			this.__buttonCell3.empty();
   			this.__buttonCell4.empty();
   			
   			var __this = this;
   			this.__buttonCell4.append($("<button></button>")
   				.css({
   					padding: "7px",
   					lineHeight: "11px"
   					
   				})
   				.attr("type", "button")
   				.text("OK")
   				.click(function(){
   					__this.close();
   				}));	
   			
   			
   			this.show();
   				
    		return this;
    	};
    
    	return this;
    };
 
}(jQuery));
