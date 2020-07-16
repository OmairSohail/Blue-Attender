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
             single-select
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

                <!-- <v-chip color="blue lighten-1" dark>PRESENT</v-chip> -->
           </template>
              <!-- <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
              </template> -->
          </v-data-table>
      </v-card>

      <v-snackbar
            v-model="snackbar">
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
   data(){
     return{
      users:this.users,
      Class:'',
      search:'',
      snackbar:false,
      text:'',
      Students:'',
      studentStatus:false,
      currentStudent:null,
      headers:[
          {
            text: 'Roll_No',
            align: 'start',
            sortable: false,
            value: 'rollNo',
          },
          { text: 'Name', value: 'username' },
          { text: 'Email', value: 'email' },
          { text: 'Class', value: 'class' },
          { text: 'Joining', value: 'joinDate' },
          { text: 'Status', value: 'report.status' },
          { text: 'Actions', value: 'actions', sortable: false },
        ],
      classRule:[

      ]  
     }
   },
    computed:{
     students()
     {
       const data = this.$db.ref(`users/`);
            data.on('value',(snapshot) => {
              if(snapshot.val())
              {
                this.Students =  snapshot.val();
              }
            });
       const makeArray = Array.of(this.Students);
       console.log(Object.keys(this.Students));
       const l = Object.values(this.Students); 
       const st = l.filter(x=> x.type == 'Student');
       return st; 
     },
     pStudent(){
       const all = this.users.filter(x => x.id === this.currentStudent);  
       return all;
     },
     teachers()
     {
       const all = this.users.filter(x => x.type === 'Teacher');
       return all;
     },
     checkReport()
     {
       const t = $this.moment().format(`DD-MM-YYYY`);
       const all = this.users.filter(x => x.report);
       return all;
     }
   },
   methods:{
     attended(item){
        const ref = this.$db.ref(`users/`);
       
        const month = this.$moment().format('MM');
        const nowDate = this.$moment().format('DD-MM-YYYY');
        const nowTime = this.$moment().format('LT');   
        const insertData = (uid,time,date,month) => {
              const i = this.$db.ref(`users/${uid}/report/${month}`).push().key;
              const attendence = this.$db.ref(`users/${uid}/report/${month}`).child(i);
              attendence.set({
                status:'Present',
                tickTime:time,
                date:date
              });  
        }

         const check = (email) => {
           this.$db.ref(`users/${item.id}/`).on('value', (snapshot) => {
              const alldata = snapshot.val();
              console.log(alldata);
              if(alldata.report)
              {
                const m = this.$moment().format('MM');
                const date = this.$moment().format('DD-MM-YYYY');
                const report = alldata.report;
                const presentMonthReport = Object.values(report[m]);
                const filter = presentMonthReport.find(x => x.date == date);
                if(filter == undefined)
                {
                        insertData(item.id,nowTime,nowDate,month);
                }else{
                    console.log('Already Present');
                }    
              }else{
                console.log('no');
              }
              //  const redata = Object.values(alldata);
              //  const a = redata.filter(x => x.email == email);
              //  this.currentStudent = null;
              //  this.currentStudent = a[0];
           })
        }  
        const checkPresence = async() => {
           await check(item.email);
        }
        checkPresence(); 
     }
   }
}
</script>

<style>

</style>