# Gulp Boilerplate

Simple setup to use as a starting point for a project using Gulp

## Prerequisites

You will require [node](http://nodejs.org) and [npm](https://npmjs.org) installed.

You should also install [gulp](https://github.com/gulpjs/gulp) globaly.

Run `$ npm install -g gulp`

## Setup

Install node modules

Run `$ npm install`

## Tasks

### compile
This task compiles all source files

### scripts
This task validates the JavaScript and compiles it

### styles
This task runs compass to compile the SCSS files into CSS

### markup
This task minifies all HTML files

### assets
This task is not yet complete, but will compress all image files

### init
This task adds all the branches you will require to develope with

### feature
This task deals with creating and removing branches to work on new features.

The feature branch will be pre-fixed with `f_`. You do not have to add this to the options.

Options
- `--new "featureName"` start a new feature branch
- `--complete "featureName"` merge the new feature back into the `dev` branch

### readyToTest
This task merges the `dev` branch into the `test` branch. It enables other developers to continue adding features while you test the features for the next release.

### release
This task releases the code to the `master` branch. It also increases the version number (depending on the options set)

Options
- `--mgs "commit message"` The commit message
- `--type [major|minor|patch]` The type of release (default - patch)

### hotfix
This task deals with quick patches to the main code

The hotfix branch will be pre-fixed with `hf_`. You do not have to add this to the options.

Options
- `--new "hotfixName"` start a new hotfix branch
- `--complete "hotfixName"` merge the fix back into the `master` branch and release immediatly

On complete the changes made will also be merged into the `dev` branch, so that future release include the bug fixes.
