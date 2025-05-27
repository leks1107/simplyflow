# Typeform to Google Sheets Integrator

This project is a Node.js application that acts as an integrator between Typeform and Google Sheets. It listens for webhook requests from Typeform and processes the data according to specified validation rules before adding it to a Google Sheets document.

## Features

- Receives webhook requests from Typeform.
- Validates incoming data to ensure it meets specific criteria.
- Interacts with Google Sheets API to store validated data.
- Logs actions taken (added or skipped entries).

## Project Structure

```
typeform-sheets-integrator
├── src
│   ├── app.js                     # Entry point of the application
│   ├── controllers
│   │   └── webhookController.js    # Handles incoming webhook requests
│   ├── services
│   │   ├── googleSheetsService.js  # Interacts with Google Sheets API
│   │   └── validationService.js    # Validates incoming request data
│   ├── middleware
│   │   └── errorHandler.js         # Error handling middleware
│   └── utils
│       └── logger.js               # Logging utility
├── package.json                    # NPM configuration file
├── .env.example                    # Example environment variables
└── README.md                       # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd typeform-sheets-integrator
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Create a `.env` file:**
   Copy the `.env.example` file to `.env` and fill in the required environment variables:
   ```
   SPREADSHEET_ID=<your_spreadsheet_id>
   GOOGLE_CLIENT_EMAIL=<your_google_client_email>
   GOOGLE_PRIVATE_KEY=<your_google_private_key>
   ```

4. **Run the application:**
   ```
   npm start
   ```

## Usage

- The application listens for POST requests at the `/webhook` endpoint.
- Ensure that your Typeform is configured to send webhook requests to this endpoint.
- The application will validate the incoming data and log whether the data was added to Google Sheets or skipped due to validation rules.

## License

This project is licensed under the MIT License.