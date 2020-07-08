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
                    label="Category"
                    :items="['Student','Teacher']"
                    v-model="type"
                    :rules="categoryRule"
                    @change="Class = null"
                  ></v-select>
                  
                  <v-select
                    label="Class"
                    :items="[1,2,3,4,5,6,7,8,9,10]"
                    :rules="classRule"
                    v-model="Class"
                    :multiple="type == 'Teacher' ? true : false" 
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
    
    <site-footer class="mt-4"/>
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
       Class:'',
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
       ],
       categoryRule:[
         v => !!v || 'Category is required',
       ],
       classRule:[
         v => !!v || 'Class is required',
       ]
     }
   },
   computed:{
    
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
                rollNo: randomid,
                class:this.Class
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