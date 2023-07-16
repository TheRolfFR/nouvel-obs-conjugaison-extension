<img src="extension/images/app_icon_144px.png" align="right">

# Nouvel Obs Conjugaison

## Building and running locally

Build scripts are tested on **Windows**. They were initially tested on **Mac**. These will probably work on Linux and Windows Subsystem for Linux, but I have not tested them.

- Make sure you have Node.js 18.15.0 or later installed
- Open the folder containing this README
- Run `pnpm install`
- Run `pnpm run build`

Continue the process with the steps listed below.

### Firefox
- Open Firefox's [debugging page](about:debugging#/runtime/this-firefox) (`about:debugging#/runtime/this-firefox`)
- Click "Load Temporary Add-on..."
- Navigate to this project's root and select `manifest.json`

I eased this process with `web-ext` npm module to create and load firefox profiles.<br>
Just run `pnpm run start:firefox` which will create a custom firefox profile where you will be able to pin the extension to the bar and web-ext will auto-refresh the install of the extension when developing.

### Dev
Run `pnpm run dev:firefox`. It starts firefox with web-ext to auto-refesh the built extension and it automates the build by watching source files.

### Dev the popup only
If you just want the popup, you can develop it as a standard svlte app:
- In vscode, open a [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) on [popup.html](./public/popup.html)
- In a console, run `pnpm run watch:build`
