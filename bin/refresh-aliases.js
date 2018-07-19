/* eslint-disable import/no-extraneous-dependencies, no-console, no-param-reassign */

const path = require('path');
const Request = require('request');
const fs = require('fs');

const destinationDir = path.resolve(__dirname, '../src/');
const destination = path.resolve(destinationDir, 'aliases.json');
const endpoint = 'https://www.nanode.co/api/alias/all';

const reducer = (hash, data) => {
  hash[data.account] = data.alias;
  return hash;
};

Request.get(endpoint, (error, response, body) => {
  if (error) {
    return console.dir(error);
  }

  const aliases = JSON.parse(body);
  const output = aliases.reduce(reducer, {});

  const successCallback = () => {
    console.log(output);
    return console.log(`Imported ${aliases.length} aliases`);
  };

  return fs.writeFile(destination, JSON.stringify(output), 'utf8', successCallback);
});
