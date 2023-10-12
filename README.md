# Website Device Emulator

This script uses Puppeteer to take screenshots of specified web pages across multiple devices.

## Setup

1. Install Node.js and npm if you haven't already.
2. Clone this repository.
3. Run `npm install` to install the required packages.
4. Create a `.env` file in the root directory and specify the subpages and base URL like so:

```env
SUBPAGES=,about-us,products/services,contact
BASE_URL=https://example.com
