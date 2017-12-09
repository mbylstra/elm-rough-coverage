#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');

const commandLineArgs = require('command-line-args');

const optionDefinitions = [
  { name: 'files', type: String, multiple: true, defaultOption: true },
];

function setup() {
  const options = commandLineArgs(optionDefinitions);

  settingsFile = readSettingsFile();
  if (settingsFile) {
    printInfo();
    parseSettingsFile(settingsFile);
  } else {
    if (typeof options.files === 'undefined' || options.files.length != 2) {
      displayUsage();
    } else {
      printInfo();
      checkFilePair(options.files[0], options.files[1]);
    }
  }
}

function printInfo() {
  console.log('\nFunctions with at least *some* tests');
  console.log('*** 100% accuracy not guaranteed ***');
  console.log(
    '----------------------------------------------------------------------------\n'
  );
}

function checkFilePair(testFilePath, sourceFilePath) {
  if (checkFilePath(testFilePath) && checkFilePath(sourceFilePath)) {
    try {
      const testFileContents = readFile(testFilePath);
      const sourceFileContents = readFile(sourceFilePath);
      const functionNames = findFunctionNames(sourceFileContents);
      console.log(sourceFilePath + '\n');
      for (functionName of functionNames) {
        checkFunction(functionName, testFileContents);
      }
      console.log('\n');
    } catch (error) {
      console.log(error);
    }
  }
}

function checkFunction(functionName, testSourceCode) {
  if (isFunctionTested(functionName, testSourceCode)) {
    console.log(chalk.green('✔ ' + functionName));
  } else {
    console.log(chalk.red('✘ ' + functionName));
  }
}

function isFunctionTested(functionName, testSourceCode) {
  return testSourceCode.search(functionName) > -1;
}

function findFunctionNames(sourceCode) {
  const lines = sourceCode.split('\n');
  const numLines = lines.length;

  const functionNames = [];

  for (var lineNumber = 0; lineNumber < numLines; lineNumber++) {
    const line = lines[lineNumber];

    const matches = line.match(functionRegex);
    if (matches) {
      const functionName = matches[1];
      functionNames.push(functionName);
    }
  }
  return functionNames;
}

function checkFilePath(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(
      chalk.red('\nD’oh! ') + filePath + chalk.red(' does not exist ⊙﹏⊙\n')
    );
    return false;
  } else {
    return true;
  }
}

function readSettingsFile() {
  try {
    return readFile('./elm-rough-coverage.txt');
  } catch (error) {}
}

function parseSettingsFile(settingsFile) {
  var testFilePath, sourceFilePath;
  const lines = settingsFile.split('\n');
  for (line of lines) {
    if (line.trim() != '') {
      [testFilePath, sourceFilePath] = line.split(' ');
      checkFilePair(testFilePath, sourceFilePath);
    }
  }
}

function readFile(path) {
  return fs.readFileSync(path, 'utf-8');
}

function displayUsage() {
  console.log(
    chalk.red('\nHow to use:\n') +
      '\nelm-rough-coverage path/to/test/file path/to/source/file\n' +
      '\n- or -\n' +
      '\nCreate a file named elm-rough-coverage.txt. See https://github.com/mbylstra/elm-rough-coverage for details\n'
  );
}

const functionRegex = /^([a-z][a-zA-Z0-9_]+)[ ]*:[^:].*->.*/; // the group is the function name

setup();
