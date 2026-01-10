import fs from 'fs';
import path from 'path';

// Usage: node scripts/merge_questions.js <file1> <file2> <output>
// Example: node scripts/merge_questions.js public/Physics-P1.json public/Physics-P2.json public/Physics-Combined.json

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Usage: node scripts/merge_questions.js <input_file1> <input_file2> <output_file>');
    process.exit(1);
}

const file1Path = args[0];
const file2Path = args[1];
const outputPath = args[2];

try {
    // If the same file is passed twice, we might be trying to "fix" a file that already has duplicates
    // But this script expects valid JSON arrays in input.
    // If we want to clean duplicate IDs in a single file, we can modify the logic.
    // However, for Biology2.json which HAS duplicate content (two sets) inside one file, 
    // standard JSON.parse might just take it as is if it's a valid array. 
    // Wait, if it has 2 arrays concatenated like [...] [...], it's invalid JSON.
    // If it's one array [...] with dupe IDs, JSON.parse works.

    // Let's assume input files are valid JSON arrays.

    const data1 = JSON.parse(fs.readFileSync(file1Path, 'utf8'));

    // If second file is same as first, we assume user WANTS to merge them (duplicate content).
    // But for fixing Biology2.json which ALREADY has 50 items (but bad IDs), we just need to re-index it.
    // If we run `node script file file output`, we get file+file = 100 items!

    // New Logic: If file2 is "REINDEX_ONLY", we just reindex file1.

    let combined = [];

    if (file2Path === 'REINDEX_ONLY') {
        combined = [...data1];
        console.log(`Re-indexing single file mode: ${data1.length} questions.`);
    } else {
        const data2 = JSON.parse(fs.readFileSync(file2Path, 'utf8'));
        if (!Array.isArray(data1) || !Array.isArray(data2)) {
            throw new Error('Input files must contain arrays of questions');
        }
        combined = [...data1, ...data2];
    }

    // Re-index IDs
    const reindexed = combined.map((q, index) => ({
        ...q,
        id: index + 1
    }));

    fs.writeFileSync(outputPath, JSON.stringify(reindexed, null, 2), 'utf8');

    console.log(`Successfully processed questions.`);
    console.log(`Created ${outputPath} with ${reindexed.length} questions.`);
} catch (err) {
    console.error('Error processing files:', err.message);
}
