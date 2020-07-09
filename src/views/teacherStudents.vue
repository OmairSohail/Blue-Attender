<template>
  <v-app>
      
        <v-card>
        <v-card-title>
           Students Attendence
          <v-spacer></v-spacer>
          <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
           </v-card-title>
          <v-data-table
            :headers="headers"
             :items="students"
            :search="search"
          >
           <template v-slot:item.actions="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="attended(item)"
                >
                  mdi-check
                </v-icon>
           </template>
              <!-- <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              </template> -->
          </v-data-table>
      </v-card>


     
  </v-app>
</template>

<script>
export default {
   name:'teacherStudents',
   firestore(){
     return{
        users:this.$fs.collection('blueAttender_Users')
     }
   },
   computed:{
     students()
     {
       const all = this.users.filter(x => x.type === 'Student');
       return all;
     },
     teachers()
     {
       const all = this.users.filter(x => x.type === 'Teacher');
       return all;
     }
   },
   data(){
     return{
      users:this.users,
      Class:'',
      search:'',
      headers:[
          {
            text: 'Roll_No',
            align: 'start',
            sortable: false,
            value: 'rollNo',
          },
          { text: 'Name', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Joining', value: 'joinDate' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      classRule:[

      ]  
     }
   },
   methods:{
     attended(item){
        console.log(item.id)

        function writeUserData(userId, name, email, date , time) {
          this.$db.ref(`students/${userId}/${date}`).set({
            username: name,
            email: email,
            date:date,
            time:time
          }).then(()=>{
              console.log('Present Ticked')  
          })
        }
        
        const nowDate = this.$moment().format('DD-MM-YYYY');
        const nowTime = this.$moment().format('LT');
        writeUserData(item.id,item.username,item.email,nowDate,nowTime);


     }
   }
}
</script>

<style>

</style>