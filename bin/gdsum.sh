echo "Running gdsum..."

if [ "$1" = "y" ]; then
  gdsum_output=$(node ./index.js y $2)
  echo $gdsum_output
  echo "$gdsum_output" | pbcopy
else
  if [ "$1" = "n" ]; then
    node ./index.js $1 $2
  else
    node ./index.js n $1 $2
  fi
fi

echo "Finished!"
