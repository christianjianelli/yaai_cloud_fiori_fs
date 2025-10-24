/* global QUnit */
QUnit.config.autostart = false;

sap.ui.require(["travelfs/test/integration/AllJourneys"
], function () {
	QUnit.start();
});
