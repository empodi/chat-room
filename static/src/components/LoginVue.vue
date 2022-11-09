<template>
  <div>
    <h2>Login</h2>
    <form @submit="onSubmit(email, password)">
      <input type="text" v-model="email" placeholder="Email Address" />
      <input type="password" v-model="password" placeholder="Password" />
      <input type="submit" value="Login" />
    </form>
    <p>
      <i>{{ msg }}</i>
    </p>
  </div>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      password: "",
      msg: "",
    };
  },
  methods: {
    onSubmit(email, password) {
      // LOGIN 액션 실행
      console.log(email, password);
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      try {
        this.axios
          .post(
            "/auth/login",
            { email, password },
            {
              canclToken: source.token,
            }
          )
          .then((res) => console.log(res));
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
