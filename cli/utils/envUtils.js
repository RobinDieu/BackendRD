function envBackupContent(projectName, protocol = "https") {
  return `
MONGO_URI=mongodb://localhost:27017/${projectName}
JWT_SECRET=YOU_SHOULD_CHANGE_THIS
API_KEY=YOU_SHOULD_CHANGE_THIS_TOO
SESSION_SECRET=YOU_SHOULD_CHANGE_THIS_TOO_AS_WELL

# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
MICROSOFT_CLIENT_ID=your_microsoft_client_id
MICROSOFT_CLIENT_SECRET=your_microsoft_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# CORS Origin
CORS_ORIGIN=http://localhost:3000

# Base URL
BASE_URL=${protocol}://localhost:5000/api
  `;
}

const envReactContent = String.raw`
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_API_KEY=YOU_SHOULD_CHANGE_THIS_TOO
`;

module.exports = {
  envBackupContent,
  envReactContent,
};
