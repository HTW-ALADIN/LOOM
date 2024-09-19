# LOOM

LOOM is a component library for [CARPET](https://github.com/HTW-ALADIN/CARPET). It is built with Vue 3 and Vite.

<!-- https://shields.io/badges -->

![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/:HTW-ALADIN/:LOOM/:deploy-github-pages.yaml)

## Component catalog.

The available components are showcased in a [Storybook](htw-aladin.github.io/LOOM/).
To run the Storybook locally, clone the repository, install all dependencies with `npm i` and then run `npm run storybook`.

## Add components.

To add components to the library, create a new sub-directory in the `src/components` directory with the name of your new component.
Eacg component should have its own `.vue` file for the rendering logic, a `.ts` file for the business and statemanagement logic (documented with JSDoc-Strings - docs will be built automatically), a `.stories.ts` file for the visual component documentation in Storybook and a `.spec.ts` file for unit tests.
Vue-components should be written as a [SFC](https://vuejs.org/guide/scaling-up/sfc.html) (Single File Component) with the [composition API](https://vuejs.org/guide/extras/composition-api-faq.html).
The business logic should be encapsulated in a class that extends from the BaseComponent class in the `src/components/BaseComponent.ts`. This class provides the component with reactive properties and methods to update them. The entire state of the created component should be handled and exposed via those methods.
To include the component in the npm-package, it has to be exported in the `index.ts` file in the `src` directory.

## Releases and Commit Schema

This repository follows the [ConventionalCommits-Schema](https://www.conventionalcommits.org/en/v1.0.0/). This means that every commit should follow this schema:

```
<type>[optional scope]: <comment>

<long description>

<word-token> #<reference>
```

[Example](https://www.conventionalcommits.org/en/v1.0.0/#commit-message-with-multi-paragraph-body-and-multiple-footers).

Releases are derived from the commit messages. The versioning is done automatically via [Semantic Versioning](https://semver.org/).

## Development

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

### Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

### Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

### Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
