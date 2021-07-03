# My Personal Website

[JKomskis.com](https://jkomskis.com), now backed by Azure Storage, Azure CDN, and Cloudflare.

## Usage

* Run `npm run build` to build the website (files are placed in _site/)
* Run `npm run build:prod` to create a production build of the website (files are placed in _site/)
* Run `npm run serve` to host the _site/ folder locally

## Environmental Variables

The following environmental variables are used:

* `API_BASE_PATH` - Used when building the website. Specifies the base path for languagegarbler API requests.
* `FRONTEND_PATH_PREFIX` - Used when building the website. Specifies the path under which the website will be built.

## Todo List

* [x] Make sure all license requirements are met
* [x] Merge LanguageGarbler project into this repo
* [ ] Add better documentation for ObsceneCommits and LanguageGarbler
  * [ ] Add readme to each subfolder in web
  * [ ] Add architecture details
* [ ] Cleanup deployment process
  * [ ] Remove delete blobs step and only delete extra blobs after upload is done
  * [ ] Move inline scripts to powershell files
  * [ ] Have daily incremental build only upload html files
* [ ] Github syntax highlighting: <https://github.com/philhawksworth/eleventyone/blob/master/src/site/_includes/postcss/_syntax.css>
* [ ] <https://prismjs.com/> for highlighting code

## Licenses

All original work in this repository (which is most files except images/logos from other companies) are covered by the GNU GPLv3 license (see [LICENSE](LICENSE) for details).

This project also uses third party libraries, which are distributed under their own terms (see [LICENSE-3RD-PARTY](LICENSE-3RD-PARTY)).
Note that this is my best effort to meet the license requirements of the third party projects I use.
If you believe I've failed to meet a requirement of a dependency, please let me know and I will do my best to address it.

## Attributions

This section lists the licenses of third party resources used.

Octicons

* Copyright (c) 2020 GitHub Inc.
* <https://github.com/primer/octicons>
* [MIT License](https://github.com/primer/octicons/blob/master/LICENSE)

Office-UI-Fabric-Core

* Office UI Fabric, Copyright (c) Microsoft Corporation
* <https://github.com/OfficeDev/office-ui-fabric-core>
* [MIT License](https://github.com/OfficeDev/office-ui-fabric-core/blob/master/LICENSE)

IBM Plex

* IBM Plex, Copyright © 2017 IBM Corp. with Reserved Font Name "Plex"
* <https://github.com/IBM/plex>
* [SIL Open Font License 1.1](https://github.com/IBM/plex/blob/master/LICENSE.txt)

Infinite Scroll

* Infinite Scroll, Copyright 2018-2020 Metafizzy
* <https://github.com/metafizzy/infinite-scroll>
* [GNU GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)

Font Awesome

* <https://github.com/FortAwesome/Font-Awesome>
* [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) (Icons)
* [MIT](https://opensource.org/licenses/MIT) (Code)

Lit

* Lit, Copyright (c) 2017 Google LLC. All rights reserved.
* <https://github.com/lit/lit>
* [BSD3](https://github.com/lit/lit/blob/main/LICENSE)


## Acknowledgements

* Project structure and style heavily inspired by <https://github.com/zachleat/zachleat.com>
* Also inspired by <https://bholmes.dev/>
* CSS structure inspired by <http://getbem.com/>
