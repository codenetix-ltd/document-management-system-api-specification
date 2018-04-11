const YAML = require('yamljs');
const fs = require('fs');
const path = require('path');

function removeExample(obj) {
    for(prop in obj) {
        if (prop === 'example' || prop === 'examplesJson' || prop === 'examples') {
            delete obj[prop]
        }
        else if (typeof obj[prop] === 'object') {
            removeExample(obj[prop])
        }
    }
}
function removeExampleFromFile(fileName) {
    fs.readFile(fileName, function(err, result){
        let text = result.toString()
        let firstLine = text.split('\n')[0]
        nativeObject = YAML.parse(text)
        removeExample(nativeObject)
        let resultString = firstLine + "\n\n" + YAML.stringify(nativeObject, 1000, 2)
        fs.writeFile(fileName, resultString, function(err){
            if (err) {
                throw err
            }
        })
    });
}

function removeExampleFromDir(dir) {
    files = fs.readdir(dir, function(err, result){
        for(let p in result) {
            let fullPath = dir+'/'+result[p]

            if(fs.lstatSync(fullPath).isDirectory()) {
                removeExampleFromDir(fullPath)
            } else {
                removeExampleFromFile(fullPath)
            }
        }
    });
}


removeExampleFromDir('/workschema')