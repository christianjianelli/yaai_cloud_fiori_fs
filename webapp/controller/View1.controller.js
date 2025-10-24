sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "travelfs/controller/Chat"
], (Controller, Chat) => {
    "use strict";

    return Controller.extend("travelfs.controller.View1", {
        
        onInit() {
        },

        getAppContext: function() {
        
            let sContext = "";

            const oView = this.getView();

            const oTable = oView.byId("TravelsTable");

			const aContext = oTable.getSelectedContexts();
			
			for (const element of aContext) {

				sContext = sContext + "Travel Info" + 
				            "\n Travel Id: " + element.getProperty("TravelID") + 
							"\n Description:" + element.getProperty("Description") + 
							"\n Customer Id: " + element.getProperty("CustomerID") + 
							"\n Customer Name: " + element.getProperty("CustomerFirstName") + " " + element.getProperty("CustomerLastName") +
							"\n Customer Email: " + element.getProperty("CustomerEmail") + 
							"\n Begin Date:" + element.getProperty("BeginDate") +
							"\n Booking Fee:" + element.getProperty("BookingFee") + 
							"\n Total Price:" + element.getProperty("TotalPrice") + 
							"\n Currency:" + element.getProperty("CurrencyCode") + 
							"\n\n";
			}

			console.log(sContext);

			return sContext;
        
        },

        onAfterRendering: function() {
            Chat.setContextProvider(this.getAppContext.bind(this));
            Chat.setChatHTMLContent(this.getView());
        },

        onToggleChat: function(oContext, aSelectedContexts) {
            Chat.onToggleChat();
        }
    });
});