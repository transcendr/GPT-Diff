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
- custom diffing (right now it only does `git diff`)
- etc.


