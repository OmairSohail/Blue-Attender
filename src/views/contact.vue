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
                <v-toolbar-title>Contact Us</v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" ref="login"> 

                  <v-text-field
                    label="Name"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="username"
                    :rules="usernameRule"
                    required
                  ></v-text-field>

                  <v-text-field
                    label="Email"
                    prepend-icon="mdi-account"
                    type="text"
                    v-model="email"
                    :rules="emailRule"
                    required
                  ></v-text-field>

                  <v-textarea
                    
                    label="Message"
                    v-model="message"
                    ></v-textarea>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue lighten-1" medium @click="sendEmail()">Submit</v-btn>
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
import emailjs from 'emailjs-com';
export default {
    name:'contact',
    data()
    {
        return{
            value:false,
            username:'',
            email:'',
            message:'',
            usernameRule:[
                 v => !!v || 'Name is required',
                 v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ],
            emailRule:[
                v => !!v || 'E-mail is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            messageRule:[
                  v => !!v || 'Message is required',
                  // v => (v && v.length <= 10) || 'Name must be less than 10 characters',
            ]
        }
    },
    methods:{
          sendEmail() {
            const templateParams = {
                username: this.username,
                message: this.message
            };

          emailjs.send('gmail', 'blueattender_email', templateParams,'user_EQqNIJcsOblfFbEtARAXf')
            .then(function(response) {
              console.log('SUCCESS!', response.status, response.text);
            }, function(error) {
              console.log('FAILED...', error);
            });
      }
    }

}
</script>

<style>

</style>