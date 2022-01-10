<template>
  <div id="app">
    <div class="container my-5">
      <h1 class="mx-auto mt-5 mb-3 text-center">Recipes</h1>
      <a :href="`${baseUrl}/recipe`" class="btn btn-primary mb-5 mx-auto d-table">Add new Recipe</a>

      <p class="text-center my-5">Or</p>

      <div class="form-group mb-5">
        <input @keyup.enter="searchRecipes" type="name" class="form-control" v-model="search" placeholder="search...">
      </div>

      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">
              Name
              <span style="cursor: pointer;" @click="changeOrder">&udarr;</span>
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody v-for="recipe of recipes" :key="recipe._id">
          <tr>
            <td>{{ recipe.name }}</td>
            <td class="text-right">
              <a :href="`${baseUrl}/recipe/?recipe=${recipe._id}`" class="btn btn-primary mx-1 w-25">Edit</a>
              <button v-on:click="deleteRecipe(recipe)" class="btn btn-warning mx-1 w-25">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
console.log(window.location.origin);
import axios from 'axios'
const apiPath = 'http://localhost:1950/api/recipes';
export default {
  name: 'app',
  data () {
    return {
      baseUrl: window.location.origin,
      publicPath: process.env.BASE_URL,
      recipes: [],
      search: '',
      order: 1
    }
  },
  async created() {
    try {
      const res = await axios.get(apiPath)

      this.recipes = res.data
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    async deleteRecipe(recipe) {
      try {
        await axios.delete(`${apiPath}/${recipe._id}`).then(() => {
          const idx = this.recipes.indexOf(recipe)
          this.recipes.splice(idx, 1)
        });
      } catch (e) {
        console.error(e);
      }
    },
    async searchRecipes() {
      try {
        if (this.search) {
          await axios.get(`${apiPath}/search/?s=${this.search}`).then((res) => {
            this.recipes = res.data;
          });
        }
      } catch (e) {
        console.error(e)
      }
    },
    async changeOrder() {
      this.order *= -1
      try {
        const res = await axios.get(`${apiPath}/?order=${this.order}`)

        this.recipes = res.data
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
