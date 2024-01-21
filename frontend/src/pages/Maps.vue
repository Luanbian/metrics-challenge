<template>
  <card type="plain" title="Upload file">
    <form @submit.prevent>
      <input type="file"/>
      <small slot="helperText" id="fileHelper" class="form-text text-muted">.csv or .xlsx</small>
      <base-button native-type="submit" type="primary">Enviar</base-button>
    </form>
  </card>
</template>
