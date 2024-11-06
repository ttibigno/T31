# AroundYou DevBuild

## Setup
For local testing use the script defined inside of `package.json`
```shell
> npm start
```
Create the `.env` file in the project root with a field of the database uri

- Default: `database = 'mongodb://127.0.0.1:27017'`

## Loading and clearing data
You can populate and clear the database with the scripts found inside the `scripts/` folder using
```shell
> npm run clear
> npm run load
```