# LARTLIB-Parser
LArt lib file (.pac) parser written in typescript

# Example
```ts
import { LARTLib } from "./LARTLib";
import * as fs from 'fs';

let graphics = new LARTLib(__dirname + '\\graphics.pac');
let sounds = new LARTLib(__dirname + '\\sounds.pac');

for(let entry of sounds.entries) {
    // create dir entry.directory if not exists
    if(!fs.existsSync(__dirname + '\\sounds\\' + entry.directory)) {
        fs.mkdirSync(__dirname + '\\sounds\\' + entry.directory);
    }

    // write file
    let data = sounds.getFile(entry.name);
    if(data) {
        fs.writeFileSync(__dirname + '\\sounds\\' + entry.directory + '\\' + entry.name, data);
    }

    console.log(entry.name);
}

for(let entry of graphics.entries) {
    // create dir entry.directory if not exists
    if(!fs.existsSync(__dirname + '\\graphics\\' + entry.directory)) {
        fs.mkdirSync(__dirname + '\\graphics\\' + entry.directory);
    }

    // write file
    let data = graphics.getFile(entry.name);
    if(data) {
        fs.writeFileSync(__dirname + '\\graphics\\' + entry.directory + '\\' + entry.name, data);
    }

    console.log(entry.name);
}
```
