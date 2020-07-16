<template>
  <div>
    <v-app-bar
      color="grey darken-4"
      dense
      dark
      height="80"
    >
      <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->

      <v-toolbar-title><v-img src="../assets/logo.png"></v-img></v-toolbar-title>
     
      <v-spacer></v-spacer>

      <div class="ml-4">
        <v-btn class="mx-2" to="/">Home</v-btn>
        <v-btn class="mx-2" :to="`/${this.$store.state.userType}/dashboard`">Dashboard</v-btn>
        <v-btn class="mx-2" to="/aboutus">About Us</v-btn>
        <v-btn class="mx-2" to="/contactus">Contact Us</v-btn>
      </div>  
      <!-- <v-btn icon>
        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn> -->
       <p class="text-overline mt-4" v-if="loggedIn">{{email}}</p>
        <v-avatar class="ml-4" color="teal" size="48">
        </v-avatar>  
      <v-menu
        left
        bottom
        transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title v-if="!loggedIn"><v-btn to="/login">Login</v-btn> </v-list-item-title>
            <v-list-item-title v-if="!loggedIn"><v-btn to="/signup">Signup</v-btn> </v-list-item-title>
            <v-list-item-title v-if="loggedIn"><v-btn @click="signout()">SignOut</v-btn></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
     <v-snackbar
      v-model="snackbarLogout"
    >
      {{ logoutText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="snackbarLogout = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
    name:'siteNavbar',
    computed:{
      dashboard () {
          // const id = this.$firebaseAuth.currentUser.uid;
          const ref = this.$db.ref(`users/${this.id}`);
          ref.on('value', (snapshot) => {
            var user = snapshot.val();
            if(user.type == 'Student')
            {
               this.type = 'Student';
               this.$store.dispatch('addType','Student');

            }else if(user.type == 'Teacher')
            {
              //  return '/teacher/dashboard';  
               this.type = 'Teacher';
               this.$store.dispatch('addType','Teacher');
            }else if(user.type == 'Admin')
            { 
              //  return '/admin/dashboard';     
               this.type = 'Admin';
               this.$store.dispatch('addType','Admin');      
            }
          });
          
        
          
      },
     },
     data(){
      return{
        users:this.users,
        loggedIn:false,
        username:'',
        email:'',
        overlay:false,
        profileImage:'',
        id:'',
        type:null,
        snackbarLogout:false,
        logoutText:'User Signed Out Successfully'
      }
    },
    created()
    {
              console.log('Created Hook');
              this.$firebaseAuth.onAuthStateChanged((user)=>{       
                if(user)
                {
                  this.loggedIn = true;
                  // this.username = user.displayName;
                  this.email = user.email;
                  this.username = user.displayName;
                  this.profileImage = user.photoUrl;
                  this.id = user.uid;    
                }else{
                  console.log('user not logged in');
                }
          })
    },
    methods:{
      signout()
      {   
         const logout = () => {
            this.$firebaseAuth.signOut().then(()=>{
                this.logoutText = 'User Signed Out Successfully';
                this.snackbarLogout = true;
                this.loggedIn = false;
                this.$store.dispatch('deleteUser');
            }).catch((err)=>{
                this.logoutText = err.message;
                this.snackbarLogout = true;
            });
        } 
        const status = () => {
          
            // const userStatusDatabaseRef = this.$db.ref('/status/' + this.id);
            // const isOfflineForDatabase = {
            //     state: 'offline',
            //     last_changed: this.$timestamp,
            // };
            // const isOnlineForDatabase = {
            //     state: 'online',
            //     last_changed: this.$timestamp,
            // };
            // this.$db.ref('.info/connected').on('value', (snapshot) => {
            //     if (snapshot.val() == false) {
            //         return;
            //     }
            //     userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase)      
            // });
        }
        
        const logginout = async () => {  
          this.overlay = true; 
          await logout();
          this.overlay = false;
        }
      
        logginout();
      },
        

        

    }
}
</script>

