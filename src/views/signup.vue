<template>
   <v-app id="inspire">
    <v-main>
      <!-- Navbar -->
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
                <v-toolbar-title>Signup form</v-toolbar-title>
                <v-spacer></v-spacer>
                
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" ref="signupform"> 
                    <v-text-field
                    
                    label="Fullname"
                    name="fullname"
                    prepend-icon="mdi-account-box"
                    type="text"
                    :rules="fullnameRule"
                    v-model="fullname"
                    
                    required
                  ></v-text-field>

                  <v-text-field
                    label="Email"
                    name="login"
                    prepend-icon="mdi-email"
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

                  <v-text-field
                    
                    label="Confirm Password"
                    name="confirmpassword"
                    prepend-icon="mdi-lock"
                    type="password"
                    :rules="confirmpasswordRule"
                    v-model="confirmpassword"
                    
                    required
                  ></v-text-field>

                  <v-select
                    :items="['Student','Teacher']"
                    v-model="type"
                  ></v-select>

                  <v-checkbox
                    v-model="terms"
                    :rules="[v => !!v || 'You must agree to continue!']"
                    label="Do you accept the terms and Conditions ?"
                    required
                  ></v-checkbox>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn dark medium @click="signup()">Create Account</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>

    <v-snackbar
      v-model="snackbarsignup"
    >
      {{ textsignup }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="pink"
          text
          v-bind="attrs"
          @click="snackbarsignup = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <!-- Footer -->
    <site-footer/>
  </v-app>
</template>

<script>
import {mapActions} from 'vuex';
export default {
   name:'signup',
   firestore(){
     return{
        users: this.$fs.collection('blueAttender_Users'),   
     }
   },
   data()
   {
     return{
       users:this.users,
       valid:false,
       fullname:'',
       email:'',
       password:'',
       confirmpassword:'',
       terms:false,
       type:'Student',
       snackbarsignup:false,
       textsignup:'',
       fullnameRule:[
          v => !!v || 'Name is required',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters',
       ],
       emailRule:[
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
       ],
       passwordRule:[
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must be atleast 8 characters',
       ],
       confirmpasswordRule:[
          v => (!!v && v) === this.password || 'Values do not match'
       ]
     }
   },
   computed:{
     countNo()
     {
       const c = this.count[0];
       return c;
     }
   },
   methods:{
     ...mapActions(['createUser']),
     signup()
     {
       this.$refs.signupform.validate();
       
       const randomid = Math.floor(100000 + Math.random() * 900000);
     
       this.$firestore.users.add({
                username:this.fullname,
                email:this.email,
                type:this.type,
                joinDate:new Date().toDateString(),
                rollNo: randomid
            });
         

       this.$firebaseAuth.createUserWithEmailAndPassword(this.email,this.password).then(()=>{
           this.snackbarsignup = true;
           this.textsignup = 'Account Has Been Created Successfully';
           
           const user = this.$firebaseAuth.currentUser;
          //  const userId = user.uid
           
           user.updateProfile({
             displayName:this.fullname,
           })
           

            const u = this.users.filter(x => x.email == this.email);
            

             const uid = user.currentUser.uid;

      // Create a reference to this user's specific status node.
      // This is where we will store data about being online/offline.
      const userStatusDatabaseRef = this.$db.ref('/status/' + uid);

      // We'll create two constants which we will write to 
      // the Realtime database when this device is offline
      // or online.
      const isOfflineForDatabase = {
          state: 'offline',
          last_changed: this.$timestamp,
      };

      const isOnlineForDatabase = {
          state: 'online',
          last_changed: this.$timestamp,
      };

      // Create a reference to the special '.info/connected' path in 
      // Realtime Database. This path returns `true` when connected
      // and `false` when disconnected.
      this.$db.ref('.info/connected').on('value', function(snapshot) {
          // If we're not currently connected, don't do anything.
          if (snapshot.val() == false) {
              return;
          };

          // If we are currently connected, then use the 'onDisconnect()' 
          // method to add a set which will only trigger once this 
          // client has disconnected by closing the app, 
          // losing internet, or any other means.
          userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
              // The promise returned from .onDisconnect().set() will
              // resolve as soon as the server acknowledges the onDisconnect() 
              // request, NOT once we've actually disconnected:
              // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect
            
              // We can now safely set ourselves as 'online' knowing that the
              // server will mark us as offline once we lose connection.
              userStatusDatabaseRef.set(isOnlineForDatabase);
            
          });
      });
        
            this.createUser({
                  email:u[0].email,
                  id:u[0].id,
                  joinDate:u[0].joinDate,
                  rollNo:u[0].rollNo,
                  type:u[0].type,
                  username:u[0].username,
                  profileImage:null
           });

           this.$refs.signupform.reset(); 
           
           if(this.type === 'Student')
           {            
              this.$router.replace('/student/dashboard');
           } else if(this.type == 'Teacher'){
              this.$router.replace('/teacher/dashboard');
           } else {
              this.$router.replace('/student/dashboard');
           }
       }).catch((err)=>{
           this.snackbarsignup = true;
           this.textsignup = err.message;
       })
     }
   }
}
</script>

<style>

</style>