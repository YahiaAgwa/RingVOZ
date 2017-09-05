var dev = false;
function Init() {
    if (dev) {
        localStorage.lang = "";
        if (localStorage.lang != undefined) {
            if (localStorage.lang == "en-US" || localStorage.lang == "en-CO") {
                document.location = 'top_up_options_en.html';
            } else {
                document.location = 'top_up_options.html';
            }
        } else {
            document.location = 'top_up_options.html';
        }
    }else{
        if (IsRegistered()) {
            if (localStorage.lang != undefined) {
                if (localStorage.lang == "en-US" || localStorage.lang == "en-CO") {
                    document.location = 'top_up_options_en.html';
                } else {
                    document.location = 'top_up_options.html';
                }
            } else {
                document.location = 'top_up_options.html';
            }
        } else {
            var regProcessStartupPage = 'startNow.html';
            if (localStorage.lang != undefined) {
                if (localStorage.lang == "en-US" || localStorage.lang == "en-CO") {
                    regProcessStartupPage = 'startNow_en.html';
                    if (localStorage.smsPending != undefined) {
                        if (localStorage.smsPending == 1) {
                            regProcessStartupPage = 'register_en.html';
                        }
                    }
                } else {
                    if (localStorage.smsPending != undefined) {
                        if (localStorage.smsPending == 1) {
                            regProcessStartupPage = 'register.html';
                        }
                    }
                }
            } else {
                if (localStorage.smsPending != undefined) {
                    if (localStorage.smsPending == 1) {
                        regProcessStartupPage = 'register.html';
                    }
                }
            }
            document.location = regProcessStartupPage;
        }
    
    }
}

function IsRegistered() {
    if (localStorage.u53t0k5n != undefined && localStorage.verifiedNumber != undefined && localStorage.refId != undefined && localStorage.email != undefined && localStorage.email != '') {
        localStorage.updateBalance = '1';
        localStorage.autoRechargeAmount = 20.00;
        return true;
    } else {
        return false;
    }
}