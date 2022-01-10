<template>
  <div id="app">
    <div class="container my-5">
      <h1 class="mx-auto mt-5 mb-3 text-center">Recipe</h1>
      <a :href="`${baseUrl}`" class="btn btn-primary mb-5 mx-auto d-table">Home</a>
      
      <div class="row">
        <div class="col-8">
          <div>

            <div class="form-group">
              <label for="recipeName">Recipe Name</label>
              <input type="name" class="form-control" v-model="recipeObj.name">
            </div>
            
            <div class="form-group">
              <label for="recipeDescription">Description</label>
              <textarea class="form-control" v-model="recipeObj.description" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label for="recipeIngredients">Ingredients</label>
              <textarea class="form-control" v-model="recipeObj.ingredients" rows="3"></textarea>
              <small class="form-text text-muted">Ingredients separated with coma.</small>
            </div>

            <div class="form-group">
              <label for="recipeImage">Image</label>
              <input type="file" class="form-control-file" ref="file" @change="handleImageUpload">
            </div>

            <button v-if="recipeObj.id" v-on:click="editRecipe(recipeObj.id)" class="btn btn-primary mt-5 px-4">Edit recipe</button>
            <button v-else @click="addRecipe" class="btn btn-primary mt-5 px-4">Add new recipe</button>
          </div>
        </div>

        <div class="col-4">
          <img :src="`${publicPath}uploads/${recipeObj.image}`" class="img-fluid" alt="">
        </div>

      </div>

    </div>
  </div>
</template>

<script>
import axios from 'axios'
const apiPath = 'http://localhost:1950/api/recipes';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const recipe = urlParams.get('recipe')

export default {
  name: 'app',
  data () {
    return {
      baseUrl: window.location.origin,
      publicPath: process.env.BASE_URL,
      recipeObj: {
        id: '',
        name: '',
        description: '',
        image: '',
        ingredients: ''
      },
      uploadedImage: ''
    }
  },
  async created() {
    try {
      if (recipe) {
        await axios.get(`${apiPath}/${recipe}`).then((res) => {
          let ing = res.data.ingredients

          this.recipeObj.id = res.data._id
          this.recipeObj.name = res.data.name
          this.recipeObj.description = res.data.description
          this.recipeObj.image = res.data.image
          this.recipeObj.ingredients = ing.join(', ')
        });
      }
    } catch (e) {
      console.error(e)
    }
  },
  methods: {
    async addRecipe() {
      let formData = new FormData()

      // ima i boljih nacina naravno
      if ( this.uploadedImage ) {
        formData.append('image', this.uploadedImage, this.uploadedImage.name)
      }

      formData.append('name', this.recipeObj.name)
      formData.append('description', this.recipeObj.description)
      formData.append('image', this.recipeObj.image)

      if (this.recipeObj.ingredients && this.recipeObj.ingredients !== '') {
        formData.append('ingredients', this.recipeObj.ingredients)
      }
    
      await axios.post(`${apiPath}`, formData)
        .then((res) => {
          console.log("success", res);
          window.location.href = `${this.baseUrl}/recipe/?recipe=${res.data._id}`
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          console.log(this.recipeObj);
        });
    },
    async editRecipe(id) {
        let formData = new FormData()

        // ima i boljih nacina naravno
        if ( this.uploadedImage ) {
          formData.append('image', this.uploadedImage, this.uploadedImage.name)
        }
        
        formData.append('name', this.recipeObj.name)
        formData.append('description', this.recipeObj.description)
        formData.append('image', this.recipeObj.image)

        if (this.recipeObj.ingredients && this.recipeObj.ingredients !== '') {
          formData.append('ingredients', this.recipeObj.ingredients)
        }

        await axios.patch(`${apiPath}/${id}`, formData)
        .then((res) => {
          console.log("success", res);
          this.recipeObj.image = res.data.image
        })
        .catch((error) => {
          console.log("error", error);
        })
        .finally(() => {
          console.log(this.recipeObj);
        });
    },
    async handleImageUpload( event ) {
      this.uploadedImage = event.target.files[0];
    }
  }
}
</script>
