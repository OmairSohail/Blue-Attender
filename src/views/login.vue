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
                <v-btn dark medium  @keyup.enter="login()" @click="login()">Login</v-btn>
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

      <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
     </v-overlay>
  </v-app>
</template>

<script>
import {mapActions} from 'vuex';
export default {
    name:'login',
    firestore(){
      return{
         users:this.$fs.collection('blueAttender_Users')
      }
    },
    data(){
        return{ 
            id:null,
            userEmail:null,
            users:this.users,      
            valid:false,
            overlay:false,
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
        }
    },
    created(){
       this.$firebaseAuth.onAuthStateChanged((user)=>{
         if(user)
         {
            this.id = user.uid;
            this.userEmail = user.email;
         }else{

         }
       })
    },
    computed:{
      
    },
    methods:{
       ...mapActions(['createUser']),
      login()
      { 
      const status = () => {
        //  // Fetch the current user's ID from Firebase Authentication.
        //             // const uid = this.$firebaseAuth.currentUser.uid;

        //             // Create a reference to this user's specific status node.
        //             // This is where we will store data about being online/offline.
        //             const userStatusDatabaseRef = this.$db.ref('/status/' + this.id);

        //             // We'll create two constants which we will write to 
        //             // the Realtime database when this device is offline
        //             // or online.
        //             const isOfflineForDatabase = {
        //                 state: 'offline',
        //                 last_changed: this.$timestamp,
        //             };

        //             const isOnlineForDatabase = {
        //                 state: 'online',
        //                 last_changed: this.$timestamp,
        //             };

        //             // Create a reference to the special '.info/connected' path in 
        //             // Realtime Database. This path returns `true` when connected
        //             // and `false` when disconnected.
        //             this.$db.ref('.info/connected').on('value', function(snapshot) {
        //                 // If we're not currently connected, don't do anything.
        //                 if (snapshot.val() == false) {
        //                     return;
        //                 };

        //                 // If we are currently connected, then use the 'onDisconnect()' 
        //                 // method to add a set which will only trigger once this 
        //                 // client has disconnected by closing the app, 
        //                 // losing internet, or any other means.
        //                 userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase)
        //             }); 

      }
      
      const firelogin = () => {
         this.$refs.login.validate();
         this.$firebaseAuth.signInWithEmailAndPassword(this.email,this.password).then(()=>{
           
            this.snackbar = true;  
             this.$refs.login.reset();
           this.$router.replace('/');        

         }).catch((err)=>{

            this.text = err.message;
            this.snackbar = true;

         })  
      }

      const logging = async() => {
        
        await firelogin();
        status();
        // status();
       
      } 
      
      logging();
      }
    }
}
</script>