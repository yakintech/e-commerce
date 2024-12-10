const express = require('express');
const app = express();
const { BlobServiceClient } = require("@azure/storage-blob");
const { v4: uuidv4 } = require("uuid");
const cors = require('cors');
const multer = require('multer');



const upload = multer({ storage: multer.memoryStorage() });



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const PORT = process.env.PORT || 3000;



app.get('/', (req, res) => {
    res.send('Hello World');
})

app.get("/products", (req, res) => {
    let products = [
        {
            id: 1,
            name: "laptop"
        },
        {
            id: 2,
            name: "mobile"
        }
    ];

    return res.json(products);
});



app.post("/upload",upload.array("files", 10), async (req, res) => {
    try {
        const folder = req.body.folder;
        
        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const blobName = await uploadToAzureBlob(folder, file);
            console.log(blobName);
        }
        return res.json({ success: true });
    } catch (error) {
        console.log("Error uploading to Azure Blob", error);
        return res.json({ success: false });
    }
});



const AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=neveracagatay;AccountKey=clZJ2G7LdrAbzt2C9vav7zZUBNweAmPvD8ZbdKLsPxeej3hQnOAyPzPL8kcfdjZaPIDQgANDvfeV+ASt8u8Blw==;EndpointSuffix=core.windows.net"

async function uploadToAzureBlob(folder, file) {
    const containerName = "izmir"
    const accountName = "neveracagatay"

    try {
        

        console.log("Uploading to Azure Blob",AZURE_STORAGE_CONNECTION_STRING);
        const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
        const containerClient = blobServiceClient.getContainerClient(containerName);

        // Create the container if it does not exist
        await containerClient.createIfNotExists();

        // Blob name with folder
        const blobName = `${folder}/${uuidv4()}-${file.originalname}`;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Upload the file as a blob
        await blockBlobClient.upload(file.buffer, file.buffer.length);
        console.log(`https://${accountName}.blob.core.windows.net/${containerName}/${blobName}`);
        return blobName;
    } catch (error) {
        console.log("Error uploading to Azure Blob", error);
        return null;
    }


}



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
 });



