## Local site dev error

Due to running an ancient version of Gatsby for the site, all the dependencies of the site have rotted and there are incompatibilities on M1 Macs.

The site currently builds fine in CI (not an M1), but locally you may see the following error:

```bash
info sharp Downloading https://github.com/lovell/sharp-libvips/releases/download/v8.10.5/libvips-8.10.5-darwin-arm64v8.tar.br
ERR! sharp Prebuilt libvips 8.10.5 binaries are not yet available for darwin-arm64v8
info sharp Attempting to build from source via node-gyp but this may fail due to the above error
info sharp Please see https://sharp.pixelplumbing.com/install for required dependencies
```

## Workaround

Installing `vips` via homebrew seemed to unblock running the site locally:

```bash
brew install vips
```

[Ref](https://www.powerlifting.stream/posts/gatsby-m1/)

## Going forward

Keen to rebuild the site in more modern tech with better documentation for the latest APIs of Capsize.
Upgrading seemed to be more pain that it was worth, so for now rolling with this workaround until the site is rebuilt.
