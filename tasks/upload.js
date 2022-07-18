// upload.js
const fs = require("fs");
const getDriveService = require("./gdrive");

const uploadSingleFile = async (filePath, fileName) => {
  const folderId = "1NJqb-QaObb2T6ilP3tzy-xyIcXyAZ6cj";
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
