# Introduction

This repo contains a JS script that parses a CSV and performs a Single Factor ANOVA test on every row. The output is written to a CSV File.

# How to use
Format your CSV file so that the ANOVA factors to analyze are the row labels and that the classes for the ANOVA test are the column labels. In index.js, set the targetClass variable to identify which folder the file is in and what the filename prefix is. Set the filtered variable to active class filtering. The filtered classes are defined in the filterClassesArrayMap variable.

## How to run
1. Install node https://nodejs.org/en/download. Use the version defined in package.json
2. Run "npm install" command in this directory
3. Run "node index.js" command in this directory
