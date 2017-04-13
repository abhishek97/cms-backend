const JSONAPISerializer = require('json-api-serializer');
const Serializer = new JSONAPISerializer();



Serializer.register('ticket', {
    id : 'id',
    unconvertCase : 'camelCase',
    convertCase : 'kebab-case',
    relationships : {
        customer : {
            type : 'customer'
        },
        fb : {
            type : 'fb'
        }
    }
});

Serializer.register('ticketq', {
    id : 'id',
    unconvertCase : 'camelCase',
    convertCase : 'kebab-case',
    relationships : {
        customer : {
            type : 'customer'
        }
    }
});


Serializer.register('fb', {
    id : 'id',
    unconvertCase : 'camelCase',
    convertCase : 'kebab-case',
    relationships : {
        ticket : {
            type : 'ticket'
        }
    }
})

Serializer.register('customer', {
    id : 'CID',
    unconvertCase : 'camelCase',
    convertCase : 'kebab-case',
    relationships : {
        ticket : {
            type : 'ticket'
        }
    }
});

module.exports = Serializer;

