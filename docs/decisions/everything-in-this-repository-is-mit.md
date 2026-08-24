---
title: "Everything in this repository is MIT"
summary: Why no part of the tree is licensed differently, and why the infrastructure that runs it is not here
status: stable
---

# Everything in this repository is MIT

Every package here carries the same licence, the editor along with the contract it edits
against. Nothing in the tree is reserved, and nothing waits behind a second licence.

**A contributor knows what they are contributing to.** Someone improving the canvas is
improving something MIT, with no assignment to sign and no part of what they touched held back.
Licensing one package differently was rejected for that alone: it would put a contributor in the
position of reading a licence header before deciding whether a fix is worth writing.

**A published manifest is reconnaissance.** A public repository publishes its lockfile, which
names the authentication library, the provider SDKs, and the versions of both. Between an
advisory and a patch that is a list of exactly what to try, and a scanner reads it without
waiting for anyone to be awake — where one maintainer answers when they next are. So the
infrastructure that runs a deployment is not in this tree. That is not secrecy standing in for a
control: the control is patching, and an unpublished manifest buys the time patching takes. It
closes the largest signal rather than every signal, since cookie names, callback shapes and
anything reaching a client bundle still fingerprint a stack.

Rejected: keeping that infrastructure here under a private directory. A lockfile is one file for
the whole tree, so its dependencies would be published either way, and the licence would stop
being one answer for everything in it.
