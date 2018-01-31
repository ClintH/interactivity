This is a slight mod of Facebook's messenger platform sample. The server echos received messages to connected websocket clients, and also supports live reload.

Some set up is required at first. [This guide roughly covers it](https://medium.com/@ThomasBrd/in-this-quick-post-we-will-see-how-to-configure-and-quickstart-a-facebook-messenger-bot-plateform-86dcc013741d).

However, instead of using the original sample, you'll use this code instead.

In brief, the steps are:

1. Download this project and afterward run `npm install`
2. [Create your own page on Facebook](https://www.facebook.com/pages/create)
3. [Create a Facebook App](https://developers.facebook.com/quickstarts/?platform=web). After you've given it a name, opt to 'Skip Quick Start'.
4. Add 'Messenger' as a product for your app.
5. Select your page under the app's Messenger settings
6. Paste the page access token to the `config/default.json` file.
7. Paste your app secret from your app's page on Facebook into the config file too. You need to click 'show' to see it
8. Type something random to be your 'validationToken'. You'll need this for your app setup too.
9. Install `ngrok` if you don't already have it, and then run it via `ngrok http 5000`. Note the HTTPS URL - this needs to go into your config file, making sure '/webhook' is appended.
10. Boot up your server: `npm start`
11. Create a new webhook under your app's Messenger settings. You'll need your your ngrok URL again, with `/webhook` appended. Select the following events: messages, messaging_postbacks, messaging_optins, message_deliveries.
12. 'Verify and Save' and make sure it's subscribed to your page.

---

# Messenger Platform Sample -- node.js

This project is an example server for Messenger Platform built in Node.js. With this app, you can send it messages and it will echo them back to you. You can also see examples of the different types of Structured Messages.

It contains the following functionality:

* Webhook (specifically for Messenger Platform events)
* Send API
* Web Plugins
* Messenger Platform v1.1 features

Follow the [walk-through](https://developers.facebook.com/docs/messenger-platform/quickstart) to learn about this project in more detail.

## Setup

Set the values in `config/default.json` before running the sample. Descriptions of each parameter can be found in `app.js`. Alternatively, you can set the corresponding environment variables as defined in `app.js`.

Replace values for `APP_ID` and `PAGE_ID` in `public/index.html`.

## Run

You can start the server by running `npm start`. However, the webhook must be at a public URL that the Facebook servers can reach. Therefore, running the server locally on your machine will not work.

You can run this example on a cloud service provider like Heroku, Google Cloud Platform or AWS. Note that webhooks must have a valid SSL certificate, signed by a certificate authority. Read more about setting up SSL for a [Webhook](https://developers.facebook.com/docs/graph-api/webhooks#setup).

## Webhook

All webhook code is in `app.js`. It is routed to `/webhook`. This project handles callbacks for authentication, messages, delivery confirmation and postbacks. More details are available at the [reference docs](https://developers.facebook.com/docs/messenger-platform/webhook-reference).

## License

See the LICENSE file in the root directory of this source tree. Feel free to use and modify the code.
