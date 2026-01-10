import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../public/Biology2.json');

try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    let questions = JSON.parse(rawData);

    if (!Array.isArray(questions)) {
        console.error('Error: Data is not an array');
        process.exit(1);
    }

    console.log(`Found ${questions.length} questions. Re-indexing...`);

    questions = questions.map((q, index) => ({
        ...q,
        id: index + 1 // Force sequential IDs starting from 1
    }));

    fs.writeFileSync(filePath, JSON.stringify(questions, null, 2), 'utf8');
    console.log('Successfully re-indexed questions.');
} catch (error) {
    console.error('Error processing file:', error);
}
