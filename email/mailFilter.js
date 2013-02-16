//checks if property exists
function propExists(obj, prop){
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

var addressSplit = /(?:,|;)+/;

function splitAddress(addressFilter) {
    return addressFilter.split(addressSplit)
}

//takes the string parsed from to:[filter] + the list of addresses and returns true if a match is found
function filterAddresses(filterQuery, mailList) {
    var foundMatch = false;
    var filterSplit = splitAddress(filterQuery);

    //make sure maillist is an array
    if (!(mailList instanceof Array)) {
        mailList = [ mailList ];
    }

    for(var i in filterSplit) {
        if (!filterSplit[i]) continue;
        var lowerFilter = filterSplit[i].toLowerCase();

        for(var k in mailList) {
            var lowerMailAddress = mailList[k].address.toLowerCase();

            //check address
            if(lowerMailAddress.indexOf(lowerFilter) !== -1) {
                foundMatch = true;
                break;
            }

            var lowerMailName = mailList[k].address.toLowerCase();

            //check name
            if(lowerMailName.indexOf(lowerFilter) !== -1) {
                foundMatch = true;
                break;
            }
        }
    }

    return foundMatch;
}

function matchText(filterText, mailText) {
    if (!filterText.length || !mailText.length) return false;

    filterText = filterText.toLowerCase();
    mailText = mailText.toLowerCase();

    return mailText.indexOf(filterText) !== -1;
}

//matches filter object vs mail object returns true if it satisfies
exports.matches = function (filter, mail) {
    if (!filter) return true;
    console.log("filter: ", filter);

    var any = filter.condition && filter.condition == "any";
    var foundMatch = false;

    //to
    if (propExists(filter, "to")) {
        console.log("filtering on to: ", filter.to);
        foundMatch = filterAddresses(filter.to, mail.to);
        if (any && foundMatch) return true;
    }

    //from
    if (propExists(filter, "from")) {
        console.log("filtering on from: ", filter.from);
        foundMatch = filterAddresses(filter.from, mail.from);
        if (any && foundMatch) return true;
    }

    //subject
    if (propExists(filter, "subject")) {
        foundMatch = matchText(filter.subject, mail.subject);
        if (any && foundMatch) return true;
    }

    //body
    if (propExists(filter, "html")) {
        foundMatch = matchText(filter.html, mail.html);
        if (any && foundMatch) return true;
    }

    return foundMatch;
};

//turns string into filter object
exports.parse = function (query) {
    if (query.indexOf(":") === -1) {
        query = query.trim();

        if (query.indexOf("@") === -1) {
            //no specific querys, just hook up general text
            return {
                condition: "any",
                html: query,
                subject: query
            };
        } else {
            //looks like an email, give that a crack            
            return {
                condition: "any",
                to: query,
                from: query
            };
        }
    }

    //try parse out [param]:[value] parameters

    return null;
};