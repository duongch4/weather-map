# Weather-Map

1. Google Maps Service
2. Weather Information from Environmental Canada

# Setup

1. Create `.env` for testing production build and `.env.dev` for development
```
GOOGLE_MAP_API_KEY=<Your Google Map API Key>
OVERNIGHT_LOGGER_MODE=<FILE/OFF/CONSOLE>
```
2. Run npm commands:
    1. Development Mode:
    ```[cmd]
    npm run watch
    ```
    2. Production Build:
    ```[cmd]
    npm run build
    ```