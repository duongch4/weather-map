const path = require("path");

module.exports = {
    parser: "@typescript-eslint/parser",
    plugins: [
        "@typescript-eslint",
        "@typescript-eslint/tslint",
        "react"
    ],
    env: {
        browser: true,
        jest: true,
        es6: true,
        node: true
    },
    parserOptions: {
        project: path.resolve(__dirname, "./tsconfig.json"),
        tsconfigRootDir: __dirname,
        ecmaVersion: 2018,
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        },
        // extraFileExtensions: ["json", "html", "scss"]
    },
    extends: [
        "plugin:@typescript-eslint/recommended", // recommended rules from @typescript-eslint/eslint-plugin
        // "prettier/@typescript-eslint", // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
        "plugin:react/recommended", // recommended rules from @eslint-plugin-react
        // "prettier/react", // disables react-specific linting rules that conflict with prettier
        // "plugin:prettier/recommended" // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    ],
    rules: {
        // Overwrite rules specified from the extended configs e.g. 
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-unused-vars": ["error", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-inferrable-types": "off",

        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": ["error", {"default": "array-simple"}],
        "@typescript-eslint/ban-types": [
            "error",
            {
                "types": {
                    "Object": "Avoid using the `Object` type. Did you mean `object`?",
                    "Function": "Avoid using the `Function` type. Prefer a specific function type, like `() => void`.",
                    "Boolean": "Avoid using the `Boolean` type. Did you mean `boolean`?",
                    "Number": "Avoid using the `Number` type. Did you mean `number`?",
                    "String": "Avoid using the `String` type. Did you mean `string`?",
                    "Symbol": "Avoid using the `Symbol` type. Did you mean `symbol`?",
                }
            }
        ],
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/explicit-member-accessibility": ["error", {"overrides": {"constructors": "off"}}],
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/triple-slash-reference": "error",
        "@typescript-eslint/no-use-before-declare": "off",
        "@typescript-eslint/no-var-requires": "off",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/consistent-type-definitions": ["error", "type"],
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/type-annotation-spacing": "error",
        "@typescript-eslint/unified-signatures": "error",
        "arrow-parens": ["error", "always"],
        "brace-style": ["error", "stroustrup"],
        // "brace-style": ["error", "1tbs"],
        "complexity": "off",
        "constructor-super": "error",
        "curly": "error",
        "dot-notation": "off",
        "eol-last": "error",
        "guard-for-in": "off",
        "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
        "max-classes-per-file": "off",
        "max-depth": "error",
        "max-lines": ["error", 300],
        "max-statements-per-line": "error",
        "member-ordering": "off",
        "new-parens": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": "error",
        "no-debugger": "error",
        "no-empty": "error",
        "no-empty-function": "error",
        "no-eval": "error",
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": "error",
        "no-new-wrappers": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "no-var": "error",
        "object-shorthand": "off",
        "one-var": "off",
        "prefer-const": "off",
        "quote-props": "off",
        // "quote-props": ["error", "consistent-as-needed"],
        "radix": "error",
        "space-before-function-paren": ["error", {"anonymous": "always", "named": "ignore", "asyncArrow": "always"}],
        "use-isnan": "error",
        "valid-typeof": "off",

        //----------------------------- TSLint -----------------------------
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rulesDirectory": [
                    "./node_modules/tslint-microsoft-contrib"
                ],
                "rules": {
                    "align": [
                        true,
                        "parameters",
                        "statements"
                    ],
                    "comment-format": [
                        true,
                        "check-space"
                    ],
                    "import-spacing": true,
                    "jsdoc-format": true,
                    "no-implicit-dependencies": [
                        true,
                        "dev"
                    ],
                    "no-reference-import": true,
                    "no-shadowed-variable": true,
                    "no-unused-expression": true,
                    // "one-line": [
                    //     true,
                    //     "check-catch",
                    //     "check-else",
                    //     "check-finally",
                    //     "check-open-brace",
                    //     "check-whitespace"
                    // ],
                    "quotemark": [
                        true,
                        "double",
                        "avoid-escape"
                    ],
                    "semicolon": [
                        true,
                        "always"
                    ],
                    "triple-equals": [
                        true,
                        "allow-null-check"
                    ],
                    "variable-name": [
                        true,
                        "ban-keywords",
                        "check-format",
                        "allow-leading-underscore",
                        "allow-pascal-case"
                    ],
                    "whitespace": [
                        true,
                        "check-branch",
                        "check-decl",
                        "check-operator",
                        "check-separator",
                        "check-type",
                        "check-typecast"
                    ],
                    "max-func-body-length": [
                        true,
                        100,
                        {
                            "ignore-comments": true,
                            "ignore-parameters-to-function-regex": "^describe$"
                        }
                    ],
                    "max-line-length": [
                        true,
                        150
                    ],
                    "no-console": false,
                    "class-name": true,
                    "indent": [
                        true,
                        "spaces"
                    ],
                    "typedef-whitespace": [
                        true,
                        {
                            "call-signature": "nospace",
                            "index-signature": "nospace",
                            "parameter": "nospace",
                            "property-declaration": "nospace",
                            "variable-declaration": "nospace"
                        },
                        {
                            "call-signature": "onespace",
                            "index-signature": "onespace",
                            "parameter": "onespace",
                            "property-declaration": "onespace",
                            "variable-declaration": "onespace"
                        }
                    ],
                    "no-var-requires": false,
                    "no-var-keyword": true,
                    "no-internal-module": true,
                    "no-trailing-whitespace": true,
                    "no-null-keyword": true,
                    "prefer-const": true,
                    "no-string-literal": false,
                    "only-arrow-functions": false,
                    "space-before-function-paren": [
                        true,
                        {
                            "anonymous": "always",
                            "named": "never",
                            "asyncArrow": "always"
                        }
                    ],
                    "object-literal-sort-keys": false,
                    "interface-over-type-literal": false,
                    "forin": false,
                    "ordered-imports": false,
                    "member-ordering": false,
                    "max-classes-per-file": false,
                    "trailing-comma": false,
                    "object-literal-shorthand": false
                }
            }
        ],

        //----------------------------- React -----------------------------
        // These rules don"t add much value, are better covered by TypeScript and good definition files
        "react/no-direct-mutation-state": "off",
        "react/no-deprecated": "off",
        "react/no-string-refs": "off",
        "react/require-render-return": "off",
        "react/no-unescaped-entities": "off",

        "react/jsx-filename-extension": [
            "warn",
            {
                extensions: [".js", ".jsx", ".ts", ".tsx"]
            }
        ], // also want to use with ".tsx"
        // "import/no-extraneous-dependencies": [
        //     "warn",
        //     {
        //         devDependencies: ["./client/**/test.tsx", "./server/**/test.ts"] 
        //     }
        // ],
        "react/prop-types": "off" // Is this incompatible with TS props type?
    },
    settings: {
        "import/parsers": {
            "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
            typescript: {},
        },
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    },
    ignorePatterns: ["*config*.js", "node_modules/", "dist/"],
    overrides: [
        {
            "files": ["**/*.spec.ts"],
            "rules": {
                "max-lines": "off"
            }
        },
    ]
}
