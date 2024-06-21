const { google } = require('googleapis');
const { OAuth2 } = google.auth;
const fs = require('fs');

// Load your OAuth2 credentials
const oAuth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const youtube = google.youtube({
  version: 'v3',
  auth: oAuth2Client
});

exports.uploadVideo = async (req, res) => {
  try {
    const { buffer, originalname } = req.file;

    const response = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: originalname,
          description: 'Uploaded via Node.js',
          tags: ['nodejs', 'video upload'],
          categoryId: '22',
        },
        status: {
          privacyStatus: 'private',
        },
      },
      media: {
        body: Buffer.from(buffer),
      },
    });

    res.status(200).json({
      message: 'Video uploaded successfully',
      data: response.data,
    });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({
      message: 'Failed to upload video',
      error: error.message,
    });
  }
};
