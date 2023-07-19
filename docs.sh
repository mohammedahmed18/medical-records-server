#!/bin/bash

# Run the command to generate the docs
npm run generate_docs

# Add all the changes in the ./medical_records_api_docs directory to the second git repository
cd ./medical_records_api_docs
git add .

git commit -m "api docs"

git push origin master -f

cd -

# Print the link to the live documentation
echo "The docs are live at: https://medical-server-api-docs.vercel.app/"
