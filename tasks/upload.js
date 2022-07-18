// upload.js
const fs = require("fs");
const getDriveService = require("./gdrive");

require("dotenv").config();

const uploadSingleFile = async (filePath, fileName) => {
  const folderId = process.env.FOLDER_ID;
  let drive = getDriveService();
  const { data: { id, name } = {} } = await drive.files.create({
    resource: {
      name: fileName,
      parents: [folderId],
    },
    media: {
      mimeType: "application/json",
      body: fs.createReadStream(filePath),
    },
    fields: "id,name",
  });
  console.log("File Uploaded", name, id);
};

module.exports = uploadSingleFile;
