const { ethers } = require("ethers");

const fs = require("fs");

const uploadSingleFile = require("./upload");
const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

function chunkArray(myArray, chunk_size) {
  var index = 0;
  var arrayLength = myArray.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += chunk_size) {
    let myChunk = myArray.slice(index, index + chunk_size);
    // Do something if you want with the group
    tempArray.push(myChunk);
  }

  return tempArray;
}

async function snapshot(address) {
  const provider = new ethers.providers.JsonRpcProvider(
    "http://127.0.0.1:8545/"
  );

  const SNAPSHOT_CONTRACT_ADDRESS = address;

  if (!SNAPSHOT_CONTRACT_ADDRESS) {
    throw new Error("SNAPSHOT_CONTRACT_ADDRESS is not set");
  }

  const contract = new ethers.Contract(
    SNAPSHOT_CONTRACT_ADDRESS,
    abi,
    provider
  );

  const totalSupply = await contract.totalSupply();
  const name = await contract.name();
  // Generate Array of numbers from 1 to 10000
  const indexes = Array.from({ length: totalSupply }, (_, i) => i + 1);

  let chunks = chunkArray(indexes, 50);

  let output = [];

  // Loop through Chunks
  for (let chunk of chunks) {
    console.log(
      "Snapshotting Tokens:",
      chunk[0],
      "to",
      chunk[chunk.length - 1]
    );
    const owners = await Promise.allSettled(
      chunk.map((x) => contract.ownerOf(x))
    );
    console.log("🚀 | main | owners", owners);

    owners.map((x) => {
      output.push(x.value);
    });
  }

  let data = JSON.stringify(output, null, 2);
  let date = new Date();
  let year = date.getFullYear();
  let month = ("0" + (date.getMonth() + 1)).slice(-2);
  let day = ("0" + date.getDate()).slice(-2);
  let hour = date.getHours();
  let minute = date.getMinutes();

  let formatted_date = `${year}${month}${day}_${hour}${minute}`;

  let fileName = `${name}_${formatted_date}.json`;
  let filePath = `./snapshots/${fileName}`;
  fs.writeFileSync(filePath, data);

  // Mail to mailing list
  await uploadSingleFile(filePath, fileName);
  console.log("Send Mail");
}

module.exports = { snapshot };
