# LanguageGarbler

A website that uses language translation APIs to translate text through multiple languages at a time.

## Usage

* Run `num run watch` from the `backend/obscenecommits` folder to build and watch the Azure functions
* Run `npm run start` from the `backend/obscenecommits` folder to run the Azure functions locally

## Environmental Variables

The following environmental variables are used:

* `AZURE_SECRET_KEY` - Used when running the functions. Specifies the API key for Azure Translation.
* `AZURE_FUNCTIONAPP_PUBLISH_PROFILE` - Used when deploying the functions. Provided by Azure to deploy the functions to an existing functions app.
