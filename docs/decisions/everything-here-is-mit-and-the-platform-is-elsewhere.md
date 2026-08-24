---
title: "Everything here is MIT, and the platform is elsewhere"
summary: Why the editor ships open and local from this repository while the hosted platform is a separate closed one
status: stable
---

# Everything here is MIT, and the platform is elsewhere

Every package in this repository is MIT. The editor runs locally against a consumer's own
storage and identity, which is what
[the studio is self-hosted](the-studio-is-self-hosted-with-optional-surfaces-on-top.md) and
[the studio does not own identity](the-studio-does-not-own-identity.md) already commit it to.
The hosted platform is a different repository, and it is closed.

Three reasons hold that line, and each stands without the others.

**A contributor knows what they are contributing to.** Someone who improves the canvas is
improving something MIT, with no assignment to sign and no second licence waiting for the part
they touched. That is worth more than any clause a contributor agreement could add, and it is
lost the moment one package in the tree is licensed differently.

**A published manifest is reconnaissance.** A public repository publishes its lockfile, so it
names the authentication library, the provider SDKs and the versions of both. Between a
disclosure and a patch, that is a list of exactly what to try. A scanner reads that list the
moment an advisory lands, without waiting for anyone to be awake; one maintainer answers it when
they next are. This is not secrecy standing in for a control — the control is patching, and an
unpublished manifest is what buys the time patching takes. It closes the largest signal rather than every signal: cookie
names, callback shapes and anything reaching a client bundle still fingerprint a stack, so the
assumption stays that a determined reader can guess it.

**The paid layer is separable.** What
[the business is convenience](free-and-open-source-the-business-is-convenience.md) lists as
costing money is what one person cannot do alone in a browser — review, roles, retention,
somewhere for assets to live. A local editor is complete without any of it.

Rejected: licensing the studio differently from the rest. It buys nothing the split does not
already buy, and it costs the first reason outright.

Rejected: keeping the platform in this repository behind a private directory. A lockfile is one
file for the whole tree, so the manifest is published either way and the second reason is lost
while the repository stops being MIT throughout.
