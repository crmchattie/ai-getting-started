// Import necessary libraries
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

// Configure the AWS SDK
AWS.config.update({
  region: 'us-east-2', // e.g., 'us-west-1'
});

// Create an S3 instance
const s3 = new AWS.S3();

async function uploadFile(filePath, bucketName) {
  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: bucketName,
    Key: path.basename(filePath),
    Body: fileContent,
    ContentType: 'application/pdf',
  };

  try {
    const data = await s3.upload(params).promise();
    console.log(`File uploaded successfully to ${data.Location}`);
  } catch (error) {
    console.error('Error uploading the file:', error.message);
  }
}

// Define the main function to upload all PDFs from 'research' directory
async function uploadAllPDFs() {
  const researchDir = path.join(__dirname, 'research');
  const files = fs.readdirSync(researchDir);

  for (const file of files) {
    if (path.extname(file) === '.pdf') {
      await uploadFile(path.join(researchDir, file), 'investment-pdf-storage');
    }
  }
}

// Execute the function
uploadAllPDFs();
