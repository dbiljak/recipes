module.exports = {
  pages: {
    index: {
      entry: './src/pages/Home/main.js',
      template: 'public/index.html',
      filename: "index.html",
      title: 'Home Page - Recipes',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    recipe: {
      entry: './src/pages/Recipe/main.js',
      template: 'public/recipe.html',
      filename: "recipe.html",
      title: 'Recipe Page - Recipes',
      chunks: ['chunk-vendors', 'chunk-common', 'recipe']
    }
  }
}