<template>
  <v-app id="inspire">
    <v-main>
      <site-navbar/>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="dark"
                dark
                flat
              >
                <v-toolbar-title>Login form</v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" ref="login"> 
                  <v-text-field
                    label="Email"
                    name="login"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="email"
                    :rules="emailRule"
                    required
                  ></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="passwordRule"
                    v-model="password"
                    counter="8"
                    required
                  ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark medium @click="login()">Login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbar"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <site-footer/>
  </v-app>
</template>

<script>
import {mapActions} from 'vuex';
export default {
    name:'login',
    data: () => ({
      
            valid:false,
            email:'',
            password:'', 
            passwordRule: [
              v => !!v || 'Password is required',
              v => v.length >= 8 || 'Password must be more than 8 characters',
            ],
            emailRule: [
              v => !!v || 'E-mail is required',
              v => /.+@.+/.test(v) || 'E-mail must be valid',
            ],
            snackbar:false,
            text: 'Login Successfull'
      
    }),
    methods:{
       ...mapActions(['createUser']),
      login()
      { 
         this.$refs.login.validate();
         this.$firebaseAuth.signInWithEmailAndPassword(this.email,this.password).then(()=>{
           
            this.snackbar = true;
            const user = this.$firebaseAuth.currentUser;
            this.createUser({
                id:user.uid,
                username:user.displayName,
                email:user.email,
           });

            this.$refs.login.reset();
            this.$router.replace('/');
         }).catch((err)=>{
            this.text = err.message;
            this.snackbar = true;
         })  
      }
    }
}
</script>