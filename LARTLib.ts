import fs from "fs";
import { DataType, ReadStream, dataTypesLength } from "./stream";

enum EntryType {
    Index = 0,
    Directory = 1,
    File = 2
}

interface Entry {
    name: string;
    size: number;
    sizeInArchive: number;
    id: number;
    offset: number;
    directory: string;
};

export class LARTLib {
    readStream: ReadStream;
    filePath?: string;

    entriesCount: number = 0;
    entries: Entry[] = [];
    lib: string = '';
    currentDirectory: string = '';
    endOffset: number = 0;

    constructor(fileOrData: string | Buffer) {
        this.readStream = new ReadStream(fileOrData);
        if(fs.existsSync(fileOrData)) this.filePath = fileOrData as string;

        this.read();
    }

    read() {
        let header = this.readStream.read(DataType.Char, 8);
        if(header != 'LARTLIB1') throw new Error('Invalid LARTLIB file');

        this.readStream.move(4);
        this.entriesCount = this.readStream.read(DataType.UInt16);

        this.readStream.move(22);
        let currentOffset = 0;

        for(let i = 0; i < this.entriesCount; i++) {
            let length = this.readStream.read<number>(DataType.UInt32);
            let name = this.readStream.read<string>(DataType.Char, length);
            let size = this.readStream.read<number>(DataType.UInt32);
            let sizeInArchive = this.readStream.read<number>(DataType.UInt32);
            let type = this.readStream.read<number>(DataType.UInt32);
            let id = this.readStream.read<number>(DataType.UInt32);
            let unknown = this.readStream.read<number>(DataType.UInt32);
            let offset = this.readStream.read<number>(DataType.UInt32);
            
            if(type == EntryType.Directory) {
                this.currentDirectory = name;
            } else {
                this.entries.push({
                    name,
                    size: size,
                    sizeInArchive,
                    id,
                    offset: currentOffset,
                    directory: this.currentDirectory
                });
            }

            currentOffset = offset - 16;
        }

        this.readStream.move(4);
        this.endOffset = this.readStream.position;
    }

    getFile(name: string): Buffer | undefined {
        let entry = this.entries.find(e => e.name == name);
        if(!entry) return;

        this.readStream.position = this.endOffset + entry.offset;
        let data = this.readStream.read<Buffer>(DataType.Bytes, entry.size);
        return data;
    }
}