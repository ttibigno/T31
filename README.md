# AroundYou DevBuild

## Setup
For local testing use the script defined inside of `package.json`
```shell
> npm start local
```
or, for testing with the Atlas server
```shell
> npm start cloud
```

Create the `.env` file in the project root with a field of the database uri
- Default: `database = 'mongodb://127.0.0.1:27017'`

If you want to access the MongoDB atlas cluster you have to add
- `cloudDatabase = MongoDBaddress`

To generate a safe SECRET_ACCESS_TOKEN and ADMIN_SECRET to include in `.env` file:
>node
>require('crypto').randomBytes(64).toString('hex')


## Loading and clearing data
You can populate and clear the database with the scripts found inside the `scripts/` folder using
```shell
> npm run clear
> npm run load
```
