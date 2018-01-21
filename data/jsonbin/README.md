# jsonbin

Demonstrates saving data to JSONbin and fetching it again.

Try adding some fruits, and then click 'Save to server'. Reload the page and you'll see the previously saved fruits appear.

The example creates a server-side bin for our data if we haven't already, or updates it. The bin id is saved into local storage. This effectively means that each browser will have it's own server-side data.

To use a common pool for data, the bin should be created in advance, and have each client use the same hard-coded id.

Read more
* [JSONbin](https://jsonbin.io/api-reference)
* [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
* [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
