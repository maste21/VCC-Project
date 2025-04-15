# Commands:

Azure Developer CLI Installation:

     winget install microsoft.azd
     
Verify the Azure CLI installation

     azd version
     
Node.js can be downloaded and installed from this site https://nodejs.org/

Verify Node and NPM installation

     node -v
     npm -v

Log in to Azure account with the Azure Developer CLI

     azd auth login

Provision and deploy to Azure

     azd up     

To delete the Azure resources

     azd down

Web application (both web and API) local setup commands:

Install local dependencies

     npm ci

Build and Compile the code

    npm run build

Run the application in local server

    npm start
