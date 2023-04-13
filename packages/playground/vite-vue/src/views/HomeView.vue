<template>
  <main>
    <button @click="handleClick">点击发送Login</button>
  </main>
</template>

<script setup lang="ts">
import { Login } from "@yugu/utils";
const loginFn = new Login({
  corpCode: "jinj",
  account: "yzj",
  password: "Yzj123456",
  stage: "http://cloud.21tb.com",
  mode: import.meta.env.MODE,
});
const handleClick = () => {
  loginFn.login();
};
</script>
