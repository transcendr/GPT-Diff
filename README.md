# GPT Diff

GPT your git diff and get a detailed list of all changes in your current branch's diff.

To use, you need:
1. an OpenAI API key. See: https://beta.openai.com/account/api-keys
2. set the environment variable `OPENAI_API_KEY` to your API key
3. Then, run `gpt-diff` in your git repo.

GPT Diff will split up large diffs into smaller chunks and send them to the OpenAI API. It will then combine the results and print them to your terminal as well as your clipboard ready to paste.

To skip the confirmation prompt, use the `y` flag, `gpt-diff y`, otherwise you will be ask to confirm the operation, and shown how many requests it will take to complete it.

ATM, rate-limiting is not implemented, but at 40 requests / minute, you mostly should not be affected by it.  Try smaller diffs if you are or I'd be happy to merge any contribution be it this or other cool stuff I'd like such as:

- being able to pass in custom API options as args
- pre-fixing or replacing the default prompt
- splitting the results by file or directory
[x] custom diffing (right now it only does `git diff`)
- etc.

## Usages

```bash
# Run it with defaults, requires confirmation, diffs against HEAD
gpt-diff

# Run it with y flag, skips confirmation, diffs against HEAD
gpt-diff y

# Run it with y flag and a custom diff, skips confirmation and diff against custom diff 
gpt-diff y HEAD~1

# Omit the y flag and use a custom diff, requires confirmation and diff against custom diff
gpt-diff HEAD~1
```

## Example output:

```bash
$: gpt-diff

This gdsum will require 1 requests. Continue? [y/n] (selecting n will exit) y

Processing chunk 1 with a length of 3000 and max tokens at 2500
Processing chunk 1 with a length of 3000 and max tokens at 2500
Processing chunk 1 with a length of 3000 and max tokens at 2500
Processing chunk 1 with a length of 3000 and max tokens at 2500
Processing chunk 1 with a length of 548 and max tokens at 3726

🌮 index.js:
• Added code to handle if the first argument is an empty string 
• Added code to use the function splitText to split the git diff output into chunks of 3000 characters 
• Added code to warn the user and confirm before continuing 
• Added code to handle each chunk and print the number of requests processed 
• Added code to read the environment variable for the OpenAI API key 
• Added code to check for the .git directory 
🌮 .gitignore:
• Added .DS_Store and .env to .gitignore 
🌮 index.js
• Added try block with prompt and response code 
• Added parameters for openai with temperature, max_tokens, top_p, frequency_penalty and presence_penalty 
• Added the resolve with response text 
• Added the Promise.all and closing of the rl 
🌮 package-lock.json
• Added various dependencies including asynckit, axios, child_process, follow-redirects 
🌮index.js:
• Added new object to node_modules with dependencies, engines and version information
• Added node_modules/follow-redirects with funding, engines and peerDependenciesMeta information 
• Added node_modules/form-data with dependencies, engines and version information
• Added node_modules/mime-db with engines and version information
• Added node_modules/mime-types with dependencies, engines and version information
• Added node_modules/openai with dependencies and version information
• Added "asynckit" to the "dependencies" section Request failed with status code 400 
📦 package.json:
• Added name, version, description, main, scripts, bin, keywords, author, email, license, dependencies, and child_process. 
• Updated dependencies to include openai.
```
