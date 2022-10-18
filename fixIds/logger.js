const fs = require('fs');

const updateString = (oldId, newId, filePath) => {
  try {
    let content = getContents(filePath);
    const string = content.replace(oldId, newId);
    fs.writeFile(filePath, string, 'utf8', (err) => {
      if (err) {
        console.log(err);
        console.log('Could not save logs to file!');
      } else {
        console.log('Succeeded in saving file!');
      }
    });
  } catch (error) {
      console.log(error);
  }
};

const updateJSONFile = (filePath, newContent) => {
  try {
    fs.writeFile(filePath, JSON.stringify(newContent), 'utf8', (err) => {
      if (err) {
        console.log(err);
        console.log('Could not save logs to file!');
      } else {
        console.log('Succeeded in saving file!');
      }
    });
  } catch (error) {
      console.log(error);
  }
}

const getContents = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return data;
  } catch (error) {
    throw error;
  }
};

const getObject = (filePath) => {
  const objsString = getContents(filePath);
  return JSON.parse(objsString);
}

module.exports = {
  updateString,
  updateJSONFile,
  getContents,
  getObject
};
