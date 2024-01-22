<template>
  <card type="plain" title="Upload file">
    <form @submit.prevent="submitForm">
      <div>
        <div class="input-group mb-3">
          <div class="custom-file">
            <input 
              type="file" 
              class="custom-file-input"
              ref="fileInput"
              id="inputGroupFile04"
              aria-describedby="inputGroupFileAddon04"
              @change="handleFileChange"  
            >
            <label class="custom-file-label" for="inputGroupFile04">{{ fileName }}</label>
          </div>
        </div>
        <div class="mb-3">
          <small id="emailHelp" class="form-text text-muted">.csv or .xlsx</small>
        </div>
        <div class="d-flex justify-content-end">
          <base-button 
            native-type="submit" 
            type="primary"
            :disabled="!file"
          >
            Enviar
          </base-button>
        </div>
      </div>
    </form>
  </card>
</template>

<script>
import store from '../store';

export default {
  data() {
    return {
      file: null,
      fileName: "Choose file"
    };
  },
  methods: {
    handleFileChange(event) {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        this.file = this.$refs.fileInput.files[0];
        this.fileName = this.file.name;
      }
    },
    async submitForm() {
      const formData = new FormData();
      formData.append('file', this.file);
      try {
        const response = await this.$axios.post('http://localhost:3000/api/file', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        });
        store.commit('setResponse', response.data.body);
        this.$router.push('/dashboard');
      } catch (error) {
        console.error('Api error: ', error);
      }
    }
  }
}
</script>