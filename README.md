# cwBLOG
Under development. cwBLOG is a free and open-source content management system.

![Under Development](https://img.shields.io/badge/release-development-red)
[![GNU General Public License v3.0](https://img.shields.io/github/license/codewinks/cwblog.svg)](https://opensource.org/licenses/GPL-3.0)
[![Go Report Card](https://goreportcard.com/badge/github.com/codewinks/cwblog)](https://goreportcard.com/report/github.com/codewinks/cwblog)
[![Join the chat at https://img.shields.io/discord/619054480297820161](https://img.shields.io/discord/619054480297820161)](https://discord.gg/ZjnCGcX)

## Overview

## Getting Started

### Features
* [x] API – Built with GoLang using [cwORM](https://github.com/codewinks/cworm)
* [x] Admin – Built with React
* [ ] Blog – TBD


### Roadmap:
- [ ] Documentation
- [x] CWB CMD Line
    - [ ] Easy setup 
- [x] DB Migrations
    - [x] `migrate`             – Run the database migrations
    - [x] `migrate:fresh`       – Drop all tables and re-run all migrations
    - [ ] `migrate:refresh`     – Reset and re-run all migrations         (coming soon)
    - [ ] `migrate:reset`       – Rollback all database migrations        (coming soon)
    - [ ] `migrate:rollback`    – Rollback the last database migration    (coming soon)
    - [x] `migrate:status`      – Show the status of each migration
- [x] API
    - [x] [cwORM](https://github.com/codewinks/cworm) Integration
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
        - [ ] Choose category/tag from create/edit post
        - [ ] New category/tag from create/edit post
        - [ ] Add Pagination
        - [ ] JS Validation
        - [ ] SEO configuration
        - [ ] SEO preview
        - [ ] Visual content editor
    - [ ] Page CRUD/API Integration
    - [x] Categories CRUD/API Integration
    - [x] Tags CRUD/API Integration
    - [ ] User CRUD/API Integration (Auth0 Integration)
        - [x] Create user in database on successful login
        - [ ] Manage users/roles
        - [ ] Manage roles/permissions
    - [ ] Media library
    - [ ] Add notifications feature for new announcements and site activity
    - [ ] Contact/Custom form management
        - [ ] Add notifications of new messages
    - [ ] Compile static blog frontend
    - [ ] Compile to static pages as export for uploading to other providers
    - [ ] Blog settings/configuration
        - [ ] Serve as dynamic loaded pag
        - [ ] Serve as static html pages
        - [ ] Globally enable/disable commenting
        - [ ] Google Analytics
        - [ ] Google Tag Manager
        - [ ] Social links
        - [ ] Media settings
- [ ] Blog Frontend
    - [ ] Serve dynamic pages
    - [ ] Serve static pages

## Contributing

## License
© Codewinks, LLC 2019 – [https://codewinks.com](https://codewinks.com)

Released under the [GNU General Public License v3.0](https://github.com/codewinks/cwblog/blob/master/LICENSE)


