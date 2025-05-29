# @capsizecss/vanilla-extract

## 2.0.1

### Patch Changes

- [#227](https://github.com/seek-oss/capsize/pull/227) [`2e83f03`](https://github.com/seek-oss/capsize/commit/2e83f03fc7fac9d50014d8452582964fdea72aa7) Thanks [@askoufis](https://github.com/askoufis)! - `createTextStyle`: Correctly pass through `debugId` and remove redundant classname

## 2.0.0

### Major Changes

- [#168](https://github.com/seek-oss/capsize/pull/168) [`8819ff1`](https://github.com/seek-oss/capsize/commit/8819ff1db53b9bb8e8cf1b3f1451a1ec49a32857) Thanks [@mrm007](https://github.com/mrm007)! - Precompile Capsize packages with [Crackle]

  Migrating Capsize packages to be precompiled with [Crackle], with a key change being Crackle now handles entry points instead of [Preconstruct].

  Other benefits include:

  - Modern module entry point syntax using the ["exports" field] with better tooling compatibility.
  - Improved types and better ESM and CJS compatibility
  - Better alignment between compiled code and module entry points

  ### BREAKING CHANGES:

  #### API changes

  While technically a breaking change, consumers of Capsize's public APIs are not affected by this change.
  If you are affected due to reaching into package internals, please get in touch and see if we can find a more maintainable approach.

  #### TypeScript

  TypeScript consumers should ensure they are using a compatible [`moduleResolution` strategy in TSConfig] — either `node16`, `nodenext` or `bundler`. This will ensure types are correctly resolved across the different module specifications.

  [Crackle]: https://github.com/seek-oss/crackle?tab=readme-ov-file#-crackle-
  [Preconstruct]: https://preconstruct.tools/
  ["exports" field]: https://nodejs.org/api/packages.html#exports
  [`moduleResolution` strategy in tsconfig]: https://www.typescriptlang.org/tsconfig#moduleResolution

- [#171](https://github.com/seek-oss/capsize/pull/171) [`e73da2d`](https://github.com/seek-oss/capsize/commit/e73da2d34eab23a6b68c204d727d8f53a0760421) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Drop support for Vanilla Extract below v1.4

  Upgrading to use Vanilla Extract's [style composition] API in favour of the long time deprecated `composeStyles` function.
  There is no API change for Capsize consumers, but this change will require a peer dependency of `vanilla-extract@1.4.0` or greater.

  [style composition]: https://vanilla-extract.style/documentation/api/style/#style-composition

### Patch Changes

- [#168](https://github.com/seek-oss/capsize/pull/168) [`8819ff1`](https://github.com/seek-oss/capsize/commit/8819ff1db53b9bb8e8cf1b3f1451a1ec49a32857) Thanks [@mrm007](https://github.com/mrm007)! - Fix ESM compatibility of generated CSS module

  When consumed via ESM, the generated CSS module had a bug which could result in missing Vanilla Extract file scopes.

- Updated dependencies [[`8819ff1`](https://github.com/seek-oss/capsize/commit/8819ff1db53b9bb8e8cf1b3f1451a1ec49a32857), [`a308885`](https://github.com/seek-oss/capsize/commit/a308885657a34a698596cf1d9103d50e1b3c0537), [`a308885`](https://github.com/seek-oss/capsize/commit/a308885657a34a698596cf1d9103d50e1b3c0537)]:
  - @capsizecss/core@4.0.0

## 1.0.1

### Patch Changes

- [#157](https://github.com/seek-oss/capsize/pull/157) [`151e940`](https://github.com/seek-oss/capsize/commit/151e940e442734b87d6531d6b2ece2fa286ba48c) Thanks [@mrm007](https://github.com/mrm007)! - Add missing Vanilla Extract file scopes

## 1.0.0

### Major Changes

- [#41](https://github.com/seek-oss/capsize/pull/41) [`beb400b`](https://github.com/seek-oss/capsize/commit/beb400beab5296353da32c4676466355184ab22b) Thanks [@michaeltaranto](https://github.com/michaeltaranto)! - Initial release
