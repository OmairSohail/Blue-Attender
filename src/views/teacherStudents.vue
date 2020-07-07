<template>
  <v-app>
      <h2>
        Create Class
      </h2>
      <v-form>
        <v-text-field
          :rules="classRule"
          v-model="Class"
          label="Class"
          type="number"
          required
      ></v-text-field>
        
        <v-btn>Add</v-btn>
      </v-form>
      <v-spacer></v-spacer>
      <h2>Students</h2>
        <v-card>
        <v-card-title>
         
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
                  @click="editItem(item)"
                >
                  mdi-format-vertical-align-top
                </v-icon>
                <v-icon
                  small
                  @click="deleteItem(item)"
                >
                  mdi-format-vertical-align-bottom
                </v-icon>
              </template>
              <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              </template>
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
     editItem(item){
        console.log(item);
     }
   }
}
</script>

<style>

</style>