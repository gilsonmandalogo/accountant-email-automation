# accountant-email-automation

Automates some tasks I need to do monthly.

To summarize, it takes some files from [Wise](https://wise.com/), processes them by extracting relevant financial data, scrapes and exports some documents from [Vendus](https://www.vendus.pt/), and attaches everything into an .eml file so I can open it in any email client and just hit the "Send" button.

It was built to be used as an add-on inside [Home Assistant](https://www.home-assistant.io/) so I can automate tasks like sending a notification when it's time to prepare and send the monthly email.

## Usage

You probably will need to fork this repo and change it because I have some very specific use case, but it's possible to use it as is, some configurations are loaded from environment variables.
