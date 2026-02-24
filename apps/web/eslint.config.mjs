import vue from "eslint-plugin-vue";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default [
  {
    ignores: [".output/**", ".nuxt/**", "node_modules/**", "dist/**", "*.min.js"]
  },
  ...vue.configs["flat/recommended"],
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ["**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: "module",
        extraFileExtensions: [".vue"]
      }
    }
  },
  {
    rules: {
      "vue/multi-word-component-names": "off"
    }
  }
];
