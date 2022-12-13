# Get the path to this script
echo "Running gdsum..."
SCRIPT_PATH="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
echo "Path: $SCRIPT_PATH"

if [ "$1" = "y" ]; then
  gdsum_output=$(node "$SCRIPT_PATH/index.js" y $2)
  echo $gdsum_output
  echo "$gdsum_output" | pbcopy
else
  if [ "$1" = "n" ]; then
    node "$SCRIPT_PATH/index.js" $1 $2
  else
    node "$SCRIPT_PATH/index.js" n $1 $2
  fi
fi

echo "Finished!"
