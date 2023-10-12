# Website Device Emulator

This script uses Puppeteer to take screenshots of specified web pages across multiple devices.

## Prerequisites

- Node.js and npm must be installed.
- Google Chrome or Chromium browser is required as Puppeteer relies on it for rendering web pages.

## Setup

1. Install Node.js and npm if you haven't already.
2. Clone this repository.
3. Run `npm install` to install the required packages.
4. Create a `.env` file in the root directory and specify the subpages and base URL like so:

### .env
SUBPAGES=,about-us,products/services,contact
BASE_URL=https://example.com

## Usage
Run node app.js to execute the script. Screenshots will be saved in a folder named screenshots.

### Customization
You can customize the list of devices and subpages by modifying the .env file.

### Device Information
The device information used for emulation comes from Puppeteer's built-in device descriptors. This includes a variety of mobile, tablet, and desktop configurations.