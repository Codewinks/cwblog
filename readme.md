# CWBlog
Under development. CWBlog is a free and open-source content management system.

[![GNU General Public License v3.0](https://img.shields.io/github/license/codewinks/cwblog.svg)](https://opensource.org/licenses/GPL-3.0)

## Overview

## Getting Started

### Features
* [x] API – Built with GoLang using [CWorm](https://github.com/codewinks/cworm)
* [ ] Admin – Built with React
* [ ] Blog – TBD


### Roadmap:
- [ ] Project structure and plan
- [ ] Documentation
- [x] CWB CMD Line
- [ ] DB Migrations
    - [x] Initial migrations
    - [ ] Port migrations so that it runs as its own package
    - [ ] Add migrate generate/rollback/reset/refresh
    - [ ] Update command line
- [x] API
    - [x] CWORM Integration
    - [x] Posts CRUD Endpoints
        – [ ] Multi-error responses
    - [x] Users CRUD Endpoints
    - [x] Auth0 Integration
- [ ] Admin
    - [x] Auth0 Login Integration
        - [x] Register – Create user on API
        - [ ] Solution for disabled registration/signup
        - [ ] User roles admin, guest
        - [ ] Invite – Invite user/admin
    - [x] API/Auth0 Authentication
    - [ ] Dashboard with statistics
    - [x] Post CRUD/API Integration
        – [x] Error handler
        - [ ] Add Pagination
        - [ ] JS Validation
        - [ ] SEO block with preview
        - [ ] Wysiwyg content
    - [ ] Categories CRUD/API Integration
    - [ ] Tags CRUD/API Integration
    - [ ] User CRUD/API Integration
        - [x] Create user in database on successful login
        - [ ] Manage users
    - [ ] Blog settings/configuration
    - [ ] Compile static blog frontend
    - [ ] Compile to static pages    
- [ ] Blog Frontend
    - [ ] Serve dynamic pages
    - [ ] Serve static pages

## Contributing

## License
© Codewinks, LLC 2019

Released under the [GNU General Public License v3.0](https://github.com/codewinks/cwblog/blob/master/LICENSE)






