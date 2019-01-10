# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# to launch the app on mobile device
npm install -g ngrok

ngrok http 8080

npm run dev

Then go to your mobile web browser and go to the url given by ngrok
