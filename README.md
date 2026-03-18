# SmartWatch Data Collector

Export every sensor reading from your Amazfit watch to your own server. Take back ownership of your health data.

[![License: GPL-3.0](https://img.shields.io/badge/License-GPL--3.0-blue.svg?style=flat-square)](LICENSE)
[![Zepp OS](https://img.shields.io/badge/Zepp%20OS-v1.0-black?style=flat-square)](https://docs.zepp.com/docs/1.0/intro/)
[![Platform](https://img.shields.io/badge/Platform-Amazfit%20GTR%203%20Pro-red?style=flat-square)](https://www.amazfit.com)

---

## The Problem

Amazfit and most smartwatch manufacturers lock your personal health data behind their own apps and cloud services. There is no official export for raw sensor readings. This project is a workaround: a custom watch face that continuously collects all sensor data in the background, a watch app that syncs it to your server, and a lightweight PHP receiver on the server side.

**Your body data. Your server. Your control.**

---

## Screenshots

<p align="center">
  <img src="https://raw.githubusercontent.com/Fullbaro/SmartWatchDataCollector/main/WatchFace/assets/480x480-amazfit-gtr-3-pro/screenshot.png" width="180" title="Watch face">
  <img src="https://raw.githubusercontent.com/Fullbaro/SmartWatchDataCollector/main/App/assets/common/screenshot_1.png" width="180" title="App screen 1">
  <img src="https://raw.githubusercontent.com/Fullbaro/SmartWatchDataCollector/main/App/assets/common/screenshot_2.png" width="180" title="App screen 2">
  <img src="https://raw.githubusercontent.com/Fullbaro/SmartWatchDataCollector/main/App/assets/common/screenshot_3.png" width="180" title="App screen 3">
  <img src="https://raw.githubusercontent.com/Fullbaro/SmartWatchDataCollector/main/App/assets/common/screenshot_4.png" width="180" title="App screen 4">
</p>

---

## How It Works

Zepp OS imposes two major restrictions: watch apps cannot run in the background, and they have no direct internet access. This project works around both:

```
[Watch Face]  -- continuously collects sensor data --> [Watch Storage]
     |                                                        |
[Watch App]  <---- reads on demand -------------------------+
     |
[App-Side Service]  -- HTTP POST --> [Your Server]  --> [CSV files]
```

1. **Watch Face** runs as a persistent background process. It polls all sensors every 5 minutes (configurable) and appends readings to local storage files.
2. **Watch App** is opened manually when you want to sync. It reads the accumulated data from storage and passes it to the app-side component.
3. **App-Side Service** runs on your phone (via the Zepp app). It has internet access and forwards the data to your server as HTTP POST requests.
4. **PHP Server** receives the data, validates the secret key, and appends rows to CSV files organized by data type.

---

## What Gets Collected

### Automatic (Watch Face)

| Category | Fields |
|----------|--------|
| Basic | Battery, steps, calories, distance, standing time |
| Weather | City, current temperature, forecast high/low |
| Body temperature | Skin temperature |
| Heart rate | Value at event time |
| SpO2 | Blood oxygen saturation at event time |
| Stress | Stress level at event time |
| Wear detection | Whether the watch is being worn |
| Sleep | Start/end time, score, wake/REM/light/deep duration |

### Manual (Watch App)

Log events that sensors cannot detect automatically:

| Category | Options |
|----------|---------|
| Drinks | Water, juice, soda, energy drink (with quantity) |
| Food | Light, medium, heavy, very heavy meal |
| Alcohol | Beer/wine, spirits |
| Smoking/Vaping | Single tap logging |
| Bathroom | Urination, bowel movement |
| Health events | Headache |

---

## Supported Devices

Tested and configured for the following Amazfit models running **Zepp OS v1.0**:

- GTR 3 Pro / GTR 3 Pro Women
- GTR 3 / GTR 3 Women
- T-Rex 2 / T-Rex 2 Women
- GTS 3 / GTS 3 Women
- GTS 4 / GTS 4 Women

> Developed and tested on the **Amazfit GTR 3 Pro**. Other listed models share the same screen resolution and API version but are untested.

---

## Prerequisites

- An Amazfit watch from the supported list above running **Zepp OS v1.0**
- The **Zepp** phone app with **developer mode enabled**
- **Zeus CLI** installed on your computer ([installation guide](https://docs.zepp.com/docs/1.0/guides/tools/cli/))
- A web server with **PHP** and **HTTPS** support

### Enable Developer Mode

In the Zepp phone app: **Profile > Settings > About**, then tap the Zepp logo 7 times until a confirmation popup appears.

---

## Configuration

### 1. Generate a secret key

Generate a UUID at [uuidgenerator.net](https://www.uuidgenerator.net). You will use the same key in both the app and the server.

### 2. Configure the Watch App

Edit `App/utils/config/constants.js`:

```js
const ENDPOINT = "https://your-server.com/post.php";  // your server URL
const KEY = "your-generated-uuid-here";               // secret key
const CHUNK_SIZE = 250;                               // rows per HTTP request
const INTERVAL = 300000;                              // collection interval in ms
```

### 3. Configure the Watch Face

Edit `WatchFace/utils/config/constants.js`:

```js
const INTERVAL = 300000;  // sensor polling interval in milliseconds (5 minutes)
```

### 4. Configure the Server

Edit `Server/post.php` and set the same secret key:

```php
$secret_key = "your-generated-uuid-here";
```

---

## Installation

### Watch App and Watch Face

1. Install Zeus CLI:
   ```bash
   npm install -g @zeppos/zeus-cli
   ```

2. Build and preview the **Watch Face**:
   ```bash
   cd WatchFace
   zeus preview
   ```
   Scan the QR code shown in the terminal using the Zepp app (developer tab).

3. Build and preview the **Watch App**:
   ```bash
   cd App
   zeus preview
   ```
   Scan the QR code shown in the terminal using the Zepp app (developer tab).

### Server

1. Place `Server/post.php` on your web server (Apache or NGINX).
2. Create a `data/` directory next to the PHP file and make it writable by the web server:
   ```bash
   mkdir data
   chmod 750 data
   ```
3. Block public access to the `data/` directory in your web server config. Example for NGINX:
   ```nginx
   location /data/ {
       deny all;
   }
   ```
4. Set up HTTPS. Plain HTTP is not recommended since the secret key travels in the request body.

---

## Usage

### Syncing data

1. Open the **Data Collector** app on your watch.
2. The app reads all accumulated sensor data from storage and sends it to your server in chunks.
3. Progress is displayed on screen (0 to 100%).
4. When complete, CSV files are updated on your server under the `data/` directory.

**Tip:** Assign the Data Collector app to the bottom button of your watch for quick access.

### Watch face settings

For reliable background collection, set the watch face to **Always On Display** in the Zepp app settings.

Also ensure all relevant sensors are enabled in the Zepp app:
- Heart rate continuous monitoring
- SpO2 monitoring
- Stress monitoring
- Sleep tracking

---

## Data Format

Each data type is stored as a CSV file in the `data/` directory on your server.

Example: `data/heart.csv`
```
time,value
1710500000,72
1710503600,68
```

All timestamps are **Unix epoch (UTC)**.

---

## Project Structure

```
SmartWatchDataCollector/
├── WatchFace/                  # Zepp OS watch face (background data collection)
│   ├── watchface/index.js      # Main watch face entry point
│   └── utils/config/           # Interval and storage configuration
├── App/                        # Zepp OS watch app (manual logging + sync)
│   ├── pages/index.js          # Watch-side UI
│   ├── app-side/index.js       # Phone-side HTTP service
│   └── utils/config/           # Endpoint, key, chunk size configuration
└── Server/
    └── post.php                # PHP receiver endpoint
```

---

## Contributing

Contributions are welcome. If you own a different Zepp OS v1.0 device and want to add support or have verified compatibility, please open an issue or pull request.

If the Zepp API changes between OS versions cause breakage, opening an issue with the OS version and error details helps a lot.

---

## License

This project is licensed under the **GNU General Public License v3.0**.
See [LICENSE](LICENSE) for the full text.

The GPL-3.0 ensures that any derivative work must also remain open source. If you modify and distribute this project, you must publish your changes under the same license.

---

## Links

- [Zepp OS v1.0 documentation](https://docs.zepp.com/docs/1.0/intro/)
- [Zeus CLI guide](https://docs.zepp.com/docs/1.0/guides/tools/cli/)
- [Official Amazfit data export (limited)](https://user.huami.com/privacy/index.html)
- [Watch face design assets (Figma)](https://www.figma.com/file/vRE1wTHGOqUN3NSEEFcj5b/)
