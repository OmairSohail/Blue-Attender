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
        <v-btn class="mx-2" :to="dashboard">Dashboard</v-btn>
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
  </div>
</template>

<script>
export default {
    name:'siteNavbar',
    firestore(){
      return{
        users:this.$fs.collection('blueAttender_Users')
      }
    },
    computed:{
      currentUser () {
            const ema = this.$firebaseAuth.currentUser;
            const user = this.users.filter(x => x.email == ema.email)
            return user;
      },
      userType () {
           const em = this.$firebaseAuth.currentUser;
           const user = this.users.filter(x => x.email == em.email);
           return user;
      },
      dashboard () {
             if(this.$store.state.user.type == "Teacher")
              {
                  return '/teacher/dashboard'
                }else if(this.$store.state.user.type  == "Student"){
                  return '/student/dashboard'
                }else if(this.$store.state.user.type  == "Admin"){
                  return '/admin/dashboard'
                }
      }
    },
    data(){
      return{
        users:this.users,
        loggedIn:false,
        username:'',
        email:'',
        profileImage:'',
        id:'',
        snackbarLogout:false,
        logoutText:'User Signed Out Successfully'
      }
    },
    created()
    {
      this.$firebaseAuth.onAuthStateChanged((user)=>{
        
        if(user)
        {
           this.loggedIn = true;
           this.username = user.displayName;
           this.email = user.email;
           this.profileImage = user.photoUrl;
           this.id = user.uid;

        }
      })
    },
    methods:{
      signout()
      {

        const uid = this.$firebaseAuth.currentUser.uid;

        this.$firebaseAuth.signOut().then(()=>{
            this.logoutText = 'User Signed Out Successfully';
            this.snackbarLogout = true;
            this.loggedIn = false;
         
                            // Fetch the current user's ID from Firebase Authentication.
      

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

            this.$store.dispatch('deleteUser');
        }).catch((err)=>{
            this.logoutText = err.message;
            this.snackbarLogout = true;
        });
        
      },
     

    }
}
</script>

