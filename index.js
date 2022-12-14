#!/usr/bin/env node

const fs = require("fs");
const { Configuration, OpenAIApi } = require("openai");

// Set the OpenAI API key to use
const apiKey = process.env.OPENAI_API_KEY;

// Check if there is a .git directory, if not error out
if (!fs.existsSync(".git")) {
  console.log("No .git directory found, please run this command in a git repository");
  process.exit(1);
}

if (!apiKey) {
  console.error("Please set the OPENAI_API_KEY environment variable to your OpenAI API key found here: https://beta.openai.com/account/api-keys.");
  process.exit(1);
}

const configuration = new Configuration({
  apiKey,
});
const openai = new OpenAIApi(configuration);

// Set the first script agrument to a variable
const acceptYes = process.argv[2] || "unset";

// Max chunk size
const maxChunkSize = 3000;

// Get the branch from args or default to HEAD
const branch = process.argv[3] || "HEAD";
// Define the diff command
const diffCommand = `git diff ${branch}`; // --unified=0

// Run git diff on the current branch
const gitDiffOutput = require("child_process").execSync(diffCommand).toString();

// Split the diff output into chunks of X characters
// Define the split_text function
function splitText(chunkSize, text) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
}

// Split the text and print each chunk with a label
let numRequestsRequired = 0;
splitText(maxChunkSize, gitDiffOutput).forEach((_chunk) => {
  numRequestsRequired++;
  //console.log(`Splitting diff into chunks of ${maxChunkSize} characters: ${numRequestsRequired} chunks`);
});

if (numRequestsRequired === 0) {
  console.log("No changes detected");
  process.exit(0);
}

// Initialize a variable to store the response
let responseText = "";

// Warn the user and confirm before continuing
let response = "n";
let numRequestsProcessed = 1;
const rl = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout
});

const handleRequest = async () => {
  // Iterate over each chunk
  const promises = []
  splitText(maxChunkSize, gitDiffOutput).forEach(async (chunk) => {
    // Print "processing chunk number x and show the first 20 characters of the chunk"
    const promise = new Promise(async (resolve) => {
      const max_tokens = Math.ceil(4000 - (chunk.length / 2))
      console.log(`Processing chunk ${numRequestsProcessed} with a length of ${chunk.length} and max tokens at ${max_tokens}`);
      try {
        // const prompt = `Give me a detailed bullet list "• " of all code changes in this diff:

        // ${chunk}`;
        const prompt = `Do not attempt to generate or complete the following code. 
          Give me a summarized text bullet list "• " in plain English of all code changes in this diff and group them by file like (🌮 index.js):
          \`\`\`diff
          ${chunk}
          \`\`\``;

        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt,
          temperature: 0.9,
          max_tokens,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          //stop: "",
        });
        numRequestsProcessed++;
        const text = response.data.choices[0].text;
        resolve(text);
      } catch (error) {
        numRequestsProcessed++;
        resolve(error.message);
      }
    });
    promises.push(promise);
  });

  Promise.all(promises).then((values) => {
    responseText = values.join(" ");
    // Remove all empty lines
    responseText = responseText.replace(/^\s*[\r ]*\n/gm, "");
    console.log(responseText);
    rl.close();
  });
}

if (acceptYes === "y") {
  handleRequest();
} else {
  rl.question("This gdsum will require " + numRequestsRequired + " requests. Continue? [y/n] ", (answer) => {
    response = answer;
    if (response.match(/^[yY]/) || acceptYes === "y") {
      handleRequest();
      rl.close();
    } else {
      // Print the text of the response to terminal
      console.log("Aborting");

      // Copy the text of the response to clipboard
      rl.close();
    }
  });
}
