import passWordValidator from "password-validator";

const ValidationService = {

    validateEmail: function(raw_email)
    {
        var validEmailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return validEmailRegex.test(String(raw_email));
    },

    validatePassword: function(raw_password)
    {
        var schema = new passWordValidator();

        schema
        .is().min(8)
        .is().max(32)
        .has().uppercase()
        .has().lowercase()
        .has().digits(2)
        .has().not().spaces()

        return schema.validate(raw_password);
    },

    validatePhoneNumber: function(raw_phonenumber)
    {
        
    },

    validateSubdomain: function(url)
    {
        // IF THERE, REMOVE WHITE SPACE FROM BOTH ENDS
        url = url.replace(new RegExp(/^\s+/),""); // START
        url = url.replace(new RegExp(/\s+$/),""); // END
        
        // IF FOUND, CONVERT BACK SLASHES TO FORWARD SLASHES
        url = url.replace(new RegExp(/\\/g),"/");
        
        // IF THERE, REMOVES 'http://', 'https://' or 'ftp://' FROM THE START
        url = url.replace(new RegExp(/^http\:\/\/|^https\:\/\/|^ftp\:\/\//i),"");
        
        // IF THERE, REMOVES 'www.' FROM THE START OF THE STRING
        url = url.replace(new RegExp(/^www\./i),"");
        
        // REMOVE COMPLETE STRING FROM FIRST FORWARD SLASH ON
        url = url.replace(new RegExp(/\/(.*)/),"");
        
        // REMOVES '.??.??' OR '.???.??' FROM END - e.g. '.CO.UK', '.COM.AU'
        if (url.match(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i))) {
            url = url.replace(new RegExp(/\.[a-z]{2,3}\.[a-z]{2}$/i),"");
        
        // REMOVES '.??' or '.???' or '.????' FROM END - e.g. '.US', '.COM', '.INFO'
        } else if (url.match(new RegExp(/\.[a-z]{2,4}$/i))) {
            url = url.replace(new RegExp(/\.[a-z]{2,4}$/i),"");
        }

        // CHECK TO SEE IF THERE IS A DOT '.' LEFT IN THE STRING
        var subDomain = (url.match(new RegExp(/\./g))) ? true : false;
        return(subDomain);

    },

    validatePasswordStrength: function(password, result = () => {})
    {
            let strength = {value: 0, color: 'red', extra: 'Passwords must be at least 8 characters, including capital letters and numbers'};
    
            if(password.length > 0){
                strength = { value: 25, color: 'red', extra: 'Strength: Weak'}
            }

            if (/\d/.test(password) && /[A-Z]/.test(password)) {
    
                if (password.length >= 8) {
                    strength = { value: 50, color: 'gold', extra: 'Strength: Good'}
                }
    
                if (password.length > 10) {
                    strength = { value: 75, color: 'green', extra: 'Strength: Great'}
                }
    
                if (password.length > 12) {
                    strength = { value: 100, color: 'blue', extra: 'Strength: Secure'}
                }
    
            }

            result(strength);
    }
}

export default ValidationService;