app.factory('MyPaymentMethods', function(){
    var data = {};
 
    data.items = [
        { 
            number: 'XXXX XXXX XXXX 1111',
            description: 'Payment Method - Visa',
            img: '/images/visa.png'
        },
        { 
            number: 'XXXX XXXX XXXX 0004',        	
            description: 'Payment Method - Master Card',
            img: '/images/mastercard.png'
        },
        { 
            number: 'XXXX XXXX XXXX 0004',
            description: 'Payment Method - Discover',
            img: '/images/discover.png'
        },
        { 
            number: 'XXXX XXXX XXXX 009',
            description: 'Payment Method - American Express',
            img: '/images/amex.png'
        },
        { 
            number: 'XXXX XXXX XXXX 04',
            description: "Payment Method - Diner's Club",
            img: '/images/dinersclub.png'
        },
        { 
            number: 'XXXX XXXX XXXX 1111',
            description: 'Payment Method - Paypal',
            img: '/images/paypal.png'
        }
    ]; 

    return data;
});