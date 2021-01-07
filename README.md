# cwBLOG
Under development. cwBLOG is a free and open-source content management system.

![Under Development](https://img.shields.io/badge/release-development-red)
[![GNU General Public License v3.0](https://img.shields.io/github/license/codewinks/cwblog.svg)](https://opensource.org/licenses/GPL-3.0)
[![Go Report Card](https://goreportcard.com/badge/github.com/codewinks/cwblog)](https://goreportcard.com/report/github.com/codewinks/cwblog)
[![Join the chat at https://img.shields.io/discord/619054480297820161](https://img.shields.io/discord/619054480297820161)](https://discord.gg/ZjnCGcX)

## Overview

## Getting Started

### Features
* [x] API – Built with GoLang using go-chi and go-pg
* [x] Admin – Built with React (Development)
* [ ] Blog – Frontend (TBD)


### Roadmap:
- [ ] Documentation
- [x] CWB CMD Line
    - [ ] Easy setup 
- [x] DB Migrations
    - [x] `migrate`             – Run the database migrations
    - [x] `migrate:fresh`       – Drop all tables and re-run all migrations
    - [x] `migrate:refresh`     – Reset and re-run all migrations
    - [x] `migrate:reset`       – Rollback all database migrations
    - [x] `migrate:rollback`    – Rollback the last database migration
    - [x] `migrate:status`      – Show the status of each migration
- [x] API
    - [x] [go-pg](https://github.com/go-pg/pg) Integration
    - [x] Posts CRUD Endpoints
    - [x] Users CRUD Endpoints
    - [x] Auth0 Integration
- [ ] Admin
    - [x] Auth0 Login Integration
        - [x] Register – Create user on API
        - [x] Solution for disabled registration/signup
        - [x] Invite – Invite user/admin
    - [x] Create Login Splash Page
    - [x] API/Auth0 Authentication
    - [ ] Dashboard with statistics
    - [x] Post CRUD/API Integration
        - [x] Error handler
        - [x] Choose category/tag from create/edit post
        - [x] Add new tags from create/edit post
        - [x] Visual content editor
        - [ ] Content versioning
        - [ ] Add Pagination
        - [ ] JS Validation
        - [ ] SEO configuration
        - [ ] SEO preview
    - [ ] Page CRUD/API Integration
        - [ ] Visual page builder
    - [x] Categories CRUD/API Integration
    - [x] Tags CRUD/API Integration
    - [ ] User CRUD/API Integration (Auth0 Integration)
        - [x] Create user in database on successful login
        - [x] Manage users/roles
        - [ ] Manage roles/permissions
    - [ ] Media library
    - [ ] Add notifications feature for new announcements and site activity
    - [ ] Contact/Custom form management
        - [ ] Add notifications of new messages
    - [ ] Compile static blog frontend
    - [ ] Compile to static pages as export for uploading to other providers
    - [ ] Blog settings/configuration
        - [ ] Serve as dynamic loaded pages
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


