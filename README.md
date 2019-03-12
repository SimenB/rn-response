1. `yarn install`
1. `yarn start` to start the expo server
1. `node server` to start the apollo server
1. click "Upload" in the app and pick an image
1. See the error in the app

To reproduce the bug

1. Comment out line 25 (`const data = await getStream.buffer(createReadStream(), { encoding });`) in `server.js`
1. Run `node server`
1. Upload a new image from the app
1. Even though the server says it returns an error, it is never picked up by the client

My debugging so far shows that neither `then` nor `catch` are invoked on the `fetch` call made in `apollo-upload-client`
