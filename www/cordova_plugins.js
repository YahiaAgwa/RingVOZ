cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.teamnemitoff.phonedialer/www/dialer.js",
        "id": "com.teamnemitoff.phonedialer.phonedialer",
        "merges": [
            "phonedialer"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/InAppBrowser.js",
        "id": "org.apache.cordova.inappbrowser.InAppBrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device",
        "clobbers": [
            "device"
        ]
    },
   /* {
        "file": "plugins/com.phonegap.plugins.PushPlugin/www/PushNotification.js",
        "id": "com.phonegap.plugins.PushPlugin",
        "clobbers": [
            "window.plugins.pushNotification"
        ]
    },*/
    {
        "file": "plugins/cordova-plugin-globalization/www/GlobalizationError.js",
        "id": "org.apache.cordova.globalization.GlobalizationError",
        "clobbers": [
            "window.GlobalizationError"
        ]
    },
    {
        "file": "plugins/cordova-plugin-globalization/www/globalization.js",
        "id": "org.apache.cordova.globalization.globalization",
        "clobbers": [
            "navigator.globalization"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/network.js",
        "id": "org.apache.cordova.network-information.network",
        "clobbers": [
            "navigator.connection",
            "navigator.network.connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.network-information/www/Connection.js",
        "id": "org.apache.cordova.network-information.Connection",
        "clobbers": [
            "Connection"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/contacts.js",
        "id": "org.apache.cordova.contacts.contacts",
        "clobbers": [
            "navigator.contacts"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/Contact.js",
        "id": "org.apache.cordova.contacts.Contact",
        "clobbers": [
            "Contact"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactAddress.js",
        "id": "org.apache.cordova.contacts.ContactAddress",
        "clobbers": [
            "ContactAddress"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactError.js",
        "id": "org.apache.cordova.contacts.ContactError",
        "clobbers": [
            "ContactError"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactField.js",
        "id": "org.apache.cordova.contacts.ContactField",
        "clobbers": [
            "ContactField"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactFindOptions.js",
        "id": "org.apache.cordova.contacts.ContactFindOptions",
        "clobbers": [
            "ContactFindOptions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactName.js",
        "id": "org.apache.cordova.contacts.ContactName",
        "clobbers": [
            "ContactName"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactOrganization.js",
        "id": "org.apache.cordova.contacts.ContactOrganization",
        "clobbers": [
            "ContactOrganization"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.contacts/www/ContactFieldType.js",
        "id": "org.apache.cordova.contacts.ContactFieldType",
        "merges": [
            ""
        ]
    },
    /*{
        "file": "plugins/it.mobimentum.phonegapspinnerplugin/www/spinnerplugin.js",
        "id": "it.mobimentum.phonegapspinnerplugin.SpinnerPlugin",
        "clobbers": [
            "window.spinnerplugin"
        ]
    },*/
 /*   {
        "file": "plugins/cordova-plugin-appavailability/www/AppAvailability.js",
        "id": "com.ohh2ahh.appavailability.AppAvailability",
        "clobbers": [
            "appAvailability"
        ]
    },*/
    {
        "file": "pluginscordova-plugin-google-analytics/www/analytics.js",
        "id": "com.danielcwilson.plugins.googleanalytics.UniversalAnalytics",
        "clobbers": [
            "analytics"
        ]
    }
    
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.simonmacdonald.telephonenumber": "1.0.0",
    "com.teamnemitoff.phonedialer": "0.3.0",
    "org.apache.cordova.inappbrowser": "0.5.4",
    "org.apache.cordova.device": "0.2.13",
    "org.apache.cordova.globalization": "0.3.1",
    "org.apache.cordova.network-information": "0.2.12",
    "org.apache.cordova.geolocation": "0.3.10",
    "org.apache.cordova.contacts": "0.2.13",
   /* "it.mobimentum.phonegapspinnerplugin": "1.2.1",*/
/*    "com.ohh2ahh.appavailability.AppAvailability": "0.4.2",*/
    "com.danielcwilson.plugins.googleanalytics": "0.7.2",
    "com.localytics.phonegap.LocalyticsPlugin": "1.0.0"/*,
    "com.google.gms.google-services": "9.4.0"*/
/*,
    "com.phonegap.plugins.PushPlugin":"2.4.0"*/
}
// BOTTOM OF METADATA
});