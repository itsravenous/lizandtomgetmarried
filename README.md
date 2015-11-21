Wedding website for Tom and Liz
===============================

This site is built with the help of [Bastet](https://github.com/itsravenous/bastet), a lightweight, component-focused static site builder.

## Getting started
Install dependencies:

`npm install`

## Creating your site components
Create a new component:

`bastet create component --id god_avatar --name "God Avatar"`

a new page template:

`bastet create template --id god_profile --name "God profile template"`

or a new page instance:

`bastet create page --template god_profile --id ra --title "Ra's profile page"`

## Compiling the site
Bastet sites use [Gulp](http://gulpjs.com/) to compile the various source files to HTML, CSS and JavaScript that your browser can render.

Build the site and compile and reload browser on changes:

`gulp`
