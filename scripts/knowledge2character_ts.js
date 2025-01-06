#!/usr/bin/env node

import fs from 'fs';
import inquirer from 'inquirer';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { execSync } from 'child_process';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const promptUser = async (question, defaultValue = '') => {
  console.log();
  const { answer } = await inquirer.prompt([
    {
      type: 'input',
      name: 'answer',
      message: question,
      default: defaultValue,
    },
  ]);
  return answer;
};

const readJsonFile = (filePath) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
};

const compileTypeScript = async (tsFilePath) => {
  try {
    // Check if typescript is installed
    try {
      require.resolve('typescript');
    } catch (e) {
      console.log('TypeScript not found. Installing...');
      execSync('pnpm add -D typescript', { stdio: 'inherit' });
    }

    const ts = require('typescript');
    const source = fs.readFileSync(tsFilePath, 'utf8');
    
    // Parse the TypeScript file
    const result = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ESNext,
        moduleResolution: ts.ModuleResolutionKind.NodeNext,
        esModuleInterop: true,
      }
    });

    // Create a temporary JS file
    const tempJsPath = join(__dirname, '_temp.mjs');
    const tempContent = `
      import { createRequire } from 'module';
      const require = createRequire(import.meta.url);
      ${result.outputText}
      export default character;
    `;
    fs.writeFileSync(tempJsPath, tempContent);

    try {
      // Import and evaluate the JS file
      const imported = await import(tempJsPath);
      // Clean up temp file
      fs.unlinkSync(tempJsPath);
      return imported.default;
    } catch (importError) {
      console.error('Error importing compiled file:', importError);
      // Clean up temp file even if import fails
      fs.unlinkSync(tempJsPath);
      return null;
    }
  } catch (error) {
    console.error('Error compiling TypeScript file:', error);
    return null;
  }
};

const writeJsonFile = (filePath, data) => {
  try {
    const jsonContent = JSON.stringify(data, null, 2);
    fs.writeFileSync(filePath, jsonContent, 'utf8');
    console.log(`Successfully wrote JSON file: ${filePath}`);
  } catch (error) {
    console.error(`Error writing JSON file ${filePath}:`, error);
  }
};

const main = async () => {
  try {
    let characterFilePath = process.argv[2];
    let knowledgeFilePath = process.argv[3];
    let outputFilePath = process.argv[4];

    if (!characterFilePath) {
      characterFilePath = await promptUser('Please provide the path to the character file (TS or JSON):', 'src/character.ts');
    }

    if (!knowledgeFilePath) {
      knowledgeFilePath = await promptUser('Please provide the path to the knowledge JSON file:', 'knowledge.json');
    }

    let character;
    if (characterFilePath.endsWith('.ts')) {
      character = await compileTypeScript(characterFilePath);
    } else {
      character = readJsonFile(characterFilePath);
    }
    
    const knowledge = readJsonFile(knowledgeFilePath);

    if (!character || !knowledge) {
      console.error('Invalid input files. Please provide valid character (TS/JSON) and knowledge (JSON) files.');
      return;
    }

    if (!outputFilePath) {
      const characterName = character.name.replace(/\s/g, '_');
      outputFilePath = `${characterName}.knowledge.character.json`;
    }

    character.knowledge = knowledge;
    writeJsonFile(outputFilePath, character);

    console.log('Script execution completed successfully.');
  } catch (error) {
    console.error('Error during script execution:', error);
  }
};

main(); 