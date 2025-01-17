import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function get_dir_fileUrls(fileUrl, folderName){
    const fileUrls = []
    // Convert file url (import.meta.url) to path
    const __filename = fileURLToPath(fileUrl);
    // Grab the directory that folder is in
    const __dirname = path.dirname(__filename);
    // Build path to the folder
    const folder = path.join(__dirname, folderName);
    // Read the JavaScript files in the folder to an array
    const files = fs.readdirSync(folder).filter(file => file.endsWith('.js'));
    // Loop through the files array and get their urls
    for(const file of files){
        const filePath = path.join(folder, file);
        const fileUrl = pathToFileURL(filePath).href;
        fileUrls.push(fileUrl)
    }
    return fileUrls;
}