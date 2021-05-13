# E2E encrypted Asteroid Field Prospector

## Running
This app uses Subtle Crypto API which is available only in HTTPS context, so you need to start it with HTTPS=true env variable, i.e.
```bash
HTTPS=true npm run start
```

## Configuration
Following configuration variables are available:
* `REACT_APP_PERSISTENCE` configures what persistence type application (restful when set to `REST` or localStorage in any other case) 
* `REACT_APP_API_BASE` only applies if `REACT_APP_PERSISTENCE=REST`. Specifies endpoint base URL used. You can plug in your own as long as it implements api specified in [openapi.yml](openapi.yml)
* `REACT_APP_ENCRYPTION` configures encryption, uses SubtleCrypto if set to `subtle` and no encryption otherwise.



