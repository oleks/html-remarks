# A zero-install, server-less implementation of remarks

[![License: BSD 3-Clause](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)](LICENSE)

This is a zero-install, HTML-resident implementation of
[remarks](https://github.com/DIKU-EDU/remarks). `remarks` was originally a DSL,
but it proves a hassle to have people install software on their systems.

## Design

* Zero install for all: Both teachers and students should be able to open a
  remarks file in their browser.
* Save-and-resume: Manipulate the DOM rather than the JavaScript run-time. This
  enables saving the file once changes have been made to the document.
* Mobile-first for students: When a remarks file is finalized for student view,
  this student view should be friendly for view on handheld devices (tablet, or
  mobile).

## TypeScript Style Guide

* Don't use `var` for non-variables, use `let`.
* Don't use `document.createElement` without a wrapper function that hence
  asserts a type for the created element.
* Always use `===`.
* Always specify the return type of a function (especially, if it is `void`).
