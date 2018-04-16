# Implementation

## Window Title

The window title is always set to the "basename" of the URL. That is,
the part of the URL following the last `/`, and until the `.html`
filename extension. For instance, if the URL is
`file:///home/oleks/inf5510v18/eric.html`, the window title becomes
`eric`.

This is done because, by default, when you attempt to save an HTML
file you opened in your browser, the browser will attempt to save the
file under a filename derived from the window title. It is considered
more sensible for `html-remarks` to overwrite the original HTML file
by default, rather than suggest to save it under some different name.
This means, for instance, that you can maintain an HTML file per
student.

One possible alternative, would be to add a text-field for quickly
setting the window title.
