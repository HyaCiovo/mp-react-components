This repo contains a set of components for displaying and interacting with material science data. These components provide the building blocks for the interactive components of the Materials Project website.

## This Fork vs. Original Repository

This repository is no longer a byte-for-byte copy of the original `materialsproject/mp-react-components` project. The current fork focuses on package consumption, React 18 host compatibility, and npm distribution validation.

Key differences in this fork:

- The published package name is `@gnosys/mp-react-components`.
- The package metadata has been modernized for npm consumers, including explicit `main`, `module`, `types`, `exports`, `files`, and `sideEffects` fields.
- `react` and `react-dom` are treated as peer dependencies for consumers, which is safer for React 18 host projects.
- Consumer-facing declaration issues in the published package have been fixed, especially around components that accept `children`.
- A dedicated `react18-smoke` app is used to validate the installed npm package in a React 18 environment, instead of validating only through local source imports or Storybook.
- Releases in this fork are currently driven by an explicit build -> publish -> smoke-verify workflow, rather than relying only on the original upstream tag-based release automation.

When the README below still references the original Materials Project package name or release flow, prefer the fork-specific notes in this section.

## Docs and Examples

Check out the [mp-react-components storybook](https://materialsproject.github.io/mp-react-components/) to see examples and documentation for each component in this library.

## Getting Started with Local Development

Clone the mp-react-components repo:

```
git clone git@github.com:materialsproject/mp-react-components.git
```

Ensure you're using a modern Node.js version. Node 18+ is recommended, and Node 20+ is preferred for local development and package validation.
If you don't have nvm (Node Version Manager) installed, you can install it using the following command:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Install and use Node.js 18+.

```
nvm install 18
nvm use 18
```

To check Node.js version

```
node -v
```

From inside the top directory, install the dependencies:

```
npm install
```

Deploy the app to <https://localhost:3000>:

```
npm start
```

## Installing as a Node Module

Install the current forked package:

```
npm install @gnosys/mp-react-components
```

## Developing Components

All the components are located in `src/components`

Create a new folder for each new component and name the folder after the component.

The file structure for each component should look like the following:

- `MyComponent/`
  - `MyComponent.tsx`
  - `index.tsx`
  - `MyComponent.css`
  - `MyComponent.test.tsx`

### TypeScript and JSX

This repo is configured to use TypeScript and JSX. Any file that uses TypeScript and JSX syntax (i.e. component files and any other files that include components) should use the `.tsx` extension.

### Testing Components During Development

To see how your component looks and behaves while you are developing it, you have a few different options. When you start the app locally, the main entry point that determines what is rendered is in `src/app.tsx`. Because this is a component library and not a fully integrated app, the `app.tsx` file exists solely as a testing sandbox. A simple routing structure has been setup to test out different kinds of pages in a react-only environment. These test pages live in the `src/pages` directory. When testing a new component, you can use it inside of one of the existing pages or you can create a new page. There is also the `Sandbox` page within the `pages` directory that is intended to be cleared out any time and used to test new discrete components.

If you prefer, you can also test your component inside of storybook. To do this, create a new story within the `src/stories` directory. See the Storybook section below for more info about Storybook.

### Classes

By convention, almost all components are given a top-level class which is the name of the component converted into kabob-case and prefixed with "mpc-". For example, the `DataBlock` component has the class `mpc-data-block`. The `className` prop for any component should extend the default class rather than replace it.

The components in this library are intended to be used with the [Bulma CSS Framework](https://bulma.io/). For that reason, many bulma classes and component patterns are utilized within the components.

### Styles

Components should come with styles that are important for their usage. To include styles for a component, add a CSS file named `MyComponent.css` in the component's folder and import that CSS file into the main component file.

```
import './MyComponent.css';
```

Remember that these components are intended to be used with the [Bulma CSS framework](https://bulma.io/), so the styles in the custom stylesheet can (and often do) take this into account.

### Test IDs

Also by convention, almost all components are given a test ID via the attribute `data-testid`. In some cases, a component may have multiple elements with test IDs. These IDs make it easier to select the components and their testable parts within the unit tests.

### Component Utils

For more complicated components like `MaterialsInput` and `SearchUI`, some of the re-usable or complex functions are housed in a `utils.tsx` file within the component folder. For example, all of the validation methods for the `MaterialsInput` can be found in `MaterialsInput/utils.tsx`.

Other utils that are used across multiple components can be found in the higher-level `src/utils` directory. For example, the functions for initializing table columns can be found in `src/utils/table.tsx`.

### Component Types

Many components will implement their own TypeScript types or interfaces to reduce errors and improve code readability. In some cases, these types are defined directly in the component file. In cases where there are many types for a set of components, there may be a `types.tsx` file inside the component folder (e.g. `SearchUI/types.tsx`).

Most components also have their own props interface defined. Note that this interface should usually be uniquely named and exported so that it can be used inside the component's storybook file.

### Exporting Components

Any component that you want to be usable when this library is imported as a third-party node module must be added to the exports list in `src/index.ts`.

## Unit Tests

This repo uses [jest](https://jestjs.io/) and [react testing library](https://testing-library.com/) to write and run unit tests. Any file in the `src` directory with the `.test.tsx` or `.spec.tsx` extension will be detected as a runnable test.

Run all the unit tests:

```
npm run test
```

Run a specific test suite:

```
npm run test MaterialsInput
```

The jest configuration can be found in `jest.config.js`

### Mocks

To test the fetching behavior of the `SearchUI` components, there is a `mocks` directory which sets up a Mock Service Worker using the `msw` package. See more [here](https://mswjs.io/docs/getting-started/integrate/node).

## Deploying to npm

### Release Procedures

The original upstream project used Git tags and CI/CD-based publishing. In this fork, the actively used workflow is a manual package build and publish flow, followed by verification from the `react18-smoke` consumer app.

### Manual Release Workflow Used in This Fork

1. Update the package version in `package.json`.

1. Build the publishable library output:

```
npm run clean:bundle
npm run build-publish
```

1. Optionally inspect the packaged contents locally:

```
npm pack
```

1. Publish the package to the configured registry:

```
npm publish
```

1. In `react18-smoke`, install the published version and run a production build to validate npm consumption:

```
cd react18-smoke
npm install @gnosys/mp-react-components@<VERSION>
npm run build
```

### Historical Upstream Tag-Based Procedure

The following notes are preserved as historical context from the original repository workflow:

1. Tag the commit locally:

```
git tag -a <UPDATED_VERSION> -m "<DESCRIPTION OF CHANGES>"
```

1. Push the tag to GitHub:

```
git push origin <UPDATED_VERSION>
```

1. Finalize the Release: Navigate to the "Releases" tab on GitHub and publish the release based on the new tag. This triggers the CI/CD pipeline to stamp the version into package.json and publish to NPM.

To use the latest published fork package, type the following command

```
npm install @gnosys/mp-react-components
```

### Manual Release

Use `npm build-publish` to build the project.
Use `npm publish` to push to npm

### Automated Minor Release (un-tested)

Run `npm version minor -m "Upgrade to %s"` to add a tag. Once the tag is pushed, an action willg
build the components and push the package to build to npm

## Developing with dash-mp-components

If you have a local version of `dash-mp-components` and `mp-react-components`, you may
want to use the local version of `mp-react-components` for a better development workflow.
Running those commands will tell `NPM` to use your local version of `mp-react-components`

```
 cd <DASH_MP_HOME>
 npm link <REACT_MP_HOME>
```

After publishing a new package version from this fork, you can re-install that version from your local `dash-mp-components` repo using:

```
npm install @gnosys/mp-react-components@<VERSION>
npm run build
```

## Storybook

This library uses [Storybook](https://storybook.js.org/) to document the components and their usage. All of the exported components have a set of "stories" that showcase different examples of how to use the component and its props. The stories can be found inside of `src/stories`.

### Storybook Configuration

Storybook is configured using webpack and various plugins offered by Storybook. The config can be found in `.storybook/main.js`. Note that in general, all of the `@storybook/` dependencies should be using the same version as each other. This can occasionally cause issues with the storybook build.

### Story Order and Styles

The order and hierarchy of the stories are set in `.storybook/preview.js`. This file is also where styles are imported into the storybook. Any styles that the storybook needs that aren't already imported into the components themselves should be included here.

### Run Storybook Locally

Run the story book locally:

```
npm run storybook
```

You should be able to access the storybook at <http://localhost:6006>

### Deploy Storybook to GitHub Pages

This will **build** and **deploy** the storybook.
Stories are defined in `./src/stories`

```
npm deploy-storybook
```

If successful, the changes will be live at <https://materialsproject.github.io/mp-react-components/>

### Build Tools

This repo uses Parcel to build and run the app locally and Rollup to publish the app. Parcel does not have a config file, but it does use Babel to transpile the code for this repo. The babel configuration exists in `.babelrc` and `babel.config.js`. The Rollup configuration is defined in `rollup.config.js`. In the future, both of these build tools may be removed in favor of a single unified tool (potentially webpack as it is used in dash-mp-components).
