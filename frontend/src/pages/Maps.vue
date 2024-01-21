<template>
  <card type="plain" title="Upload file">
    <div>
      <div class="input-group mb-3">
        <div class="custom-file">
          <input type="file" class="custom-file-input" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04">
          <label class="custom-file-label" for="inputGroupFile04">Choose file</label>
        </div>
      </div>
      <div class="mb-3">
        <small id="emailHelp" class="form-text text-muted">.csv or .xlsx</small>
      </div>
      <div class="d-flex justify-content-end">
        <base-button native-type="submit" type="primary">Submit</base-button>
      </div>
    </div>
  </card>
</template>
