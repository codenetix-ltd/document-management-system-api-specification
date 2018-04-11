const raml2json = require('ramldt2jsonschema');
const path = require('path');
const fs = require('fs');
const jsf = require('json-schema-faker');
const parser = require('raml-1-parser');
const isEqual = require('lodash.isequal')
const deepAssign = require('lodash.merge')

jsf.extend('faker', function() {
    return require('faker');
});
const outDir = '/out';
const schemaDir = '/workschema';
const originSchemaDir = '/schema';

(async ()=> {
    const filePath = path.join(schemaDir,'api.raml');
    const ramlData = await readFile(filePath);
    const originApi = await parser.loadRAML(path.join(originSchemaDir, 'api.raml'));
    const jsonRAML = originApi.expand(true).toJSON({ serializeMetadata: false });
    const types = jsonRAML.types.map(function(item){
        return Object.keys(item)[0];
    });

    types.forEach(item=>{
        handleType(ramlData, item);
        if(!item.endsWith('Request')) {
            handleArrayType(ramlData, item, 3);
        }
    });

})();

async function handleType(ramlData, typeName) {
    const [origin, obj] = await Promise.all([loadOrigin(typeName), generateObject(ramlData, typeName)]);
    const newObj = deepAssign(obj,origin);

    if(!isEqual(origin, newObj)) {
        console.log('Type ' + typeName + ' was changed!');
        writeFile(path.join(outDir, typeName+'.json'), JSON.stringify(newObj, null, 2));
    }
}

async function handleArrayType(ramlData, typeName, count) {
    const [origin, obj] = await Promise.all([loadOrigin(typeName+'s'), generateObject(ramlData, typeName, count)]);

    const newCount = Math.max(count, origin.length);

    let newArr = [];
    for(let i=0;i<newCount;++i) {
        let newObj = Object.assign({}, deepAssign(obj[i % obj.length], origin[i % origin.length]));
        newArr.push(newObj);
    }

    if(!isEqual(origin, newArr)) {
        console.log('Type ' + typeName + 's was changed!');
        writeFile(path.join(outDir, typeName+'s.json'), JSON.stringify(newArr, null, 2));
    }
}

async function generateObject(ramlData, typeName, arrayCount = null) {
    const schema = await raml2schema(ramlData, typeName);
    addRules(schema);

    if (arrayCount !== null) {
        const newSchema = {
            type: 'array',
            items: schema,
            minItems: arrayCount,
            maxItems: arrayCount
        }
        return await jsf.resolve(newSchema);
    }

    return await jsf.resolve(schema);
}

async function loadOrigin(typeName) {
    const filePath = path.join(originSchemaDir, 'examples', typeName+'.json');
    if (await isExistFile(filePath)) {
        return JSON.parse(await readFile(filePath));
    }
    return {};
}

function raml2schema(ramlData, typeName) {
    return new Promise(function(resolve, reject){
        raml2json.dt2js(ramlData, typeName, function(err, schema){
            if(err) {
                reject(err);
            } else {
                resolve(schema);
            }
        })
    });
}

function readFile(path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(path, function(err, data){
            if(err) {
                reject(err);
            } else {
                resolve(data.toString());
            }
        });
    })
}
function writeFile(path, data) {
    return new Promise(function(resolve, reject){
        fs.writeFile(path, data, function(err){
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });
}

function isExistFile(path) {
    return new Promise(function(resolve, reject){
        fs.exists(path, function(e){
            resolve(e);
        })
    });
}

function addRules(obj) {
    for(prop in obj) {
        if (prop === 'email') {
            obj[prop].faker = 'internet.email';
            continue;
        }

        if (prop === 'fullName') {
            obj[prop].faker = 'name.findName';
            continue;
        }

        if (typeof obj[prop] === 'object') {
            addRules(obj[prop])
            continue;
        }

        if (prop === 'type') {
            if (obj[prop] === 'string') {
                obj.faker = 'random.word'
            } else if (obj[prop] === 'array') {
                obj.minItems = 2
                obj.maxItems = 2
            } else if (obj[prop] === 'integer') {
                obj.minimum = 1
            }
        }
    }
}

