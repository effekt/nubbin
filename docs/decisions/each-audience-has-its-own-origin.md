---
title: "Each audience has its own origin"
summary: Why the product and developer surfaces deploy separately while the docs remain portable
status: stable
---

# Each audience has its own origin

`nubbin.io` is the product origin. `nubbin.dev` is the developer origin, and `nubbin.ca` redirects
to the product origin permanently.

A page that sells the product and a page that documents it answer different questions, and one
page attempting both serves neither with force. The developer surface also has a different
deployment boundary: the documentation application is built entirely from this public repository,
while the shell around it is not part of the product. Separate origins preserve that boundary.

The docs build accepts its site URL and base path as deployment inputs. Its defaults still produce
the standalone GitHub Pages site, so a public fork builds and deploys without credentials. The same
application can therefore live beneath the developer origin without importing a private package or
moving generation logic out of this repository.

Rejected: one origin containing both audiences. It would concentrate inbound links and permit
same-origin transitions, but either the private site would own the public docs build or the product
origin would proxy a separately deployed application. Both make presentation infrastructure part of
the public documentation's reproducibility boundary.

The generator and standalone deployment are settled in
[the design-site entry](the-design-site-runs-docusaurus.md).
