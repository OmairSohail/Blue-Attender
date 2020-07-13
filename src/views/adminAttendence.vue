<template>
  <v-app>
       <h2>Attendence</h2>
        <h4>Pick Month For Attendence Report</h4>
        <v-date-picker
          v-model="picker"
          :landscape="landscape"  
          :reactive="reactive"
          :flat="flat"
          :full-width="fullWidth"
          :show-current="showCurrent" 
           color="blue lighten-1"
          :type="month ? 'month' : 'date'"
          :multiple="multiple"
          :readonly="readonly"
          :disabled="disabled"
          :events="enableEvents ? functionEvents : null"
          @change="processMonth"
        ></v-date-picker>

         <v-card>
          <v-card-title>
            Students
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
            
            :search="search"
          ></v-data-table>
        </v-card>
  </v-app>
</template>

<script>
export default {
    name:'adminAttendence',
    firestore(){
      return{
        users:this.$fs.collection('blueAttender_Users')
      }
    },
    data () {
      return {
        userdata:[],
        users:this.users,    
        picker: new Date().toISOString().substr(0, 10),
        landscape: false,
        reactive: false,
        fullWidth: true,
        flat: false,
        showCurrent: true,
        month: true,
        multiple: false,
        readonly: false,
        disabled: false,
        enableEvents: false,
        search: '',
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
          // { text: 'Actions', value: 'actions', sortable: false },
        ],
      }
    },

    computed: {
      functionEvents () {
        return this.month ? this.monthFunctionEvents : this.dateFunctionEvents
      },
      processMonth () {
        const s = this.picker.split('-');
        const m = this.$moment(`${s[0]}-${s[1]}`).format('YYYY-MM')
        console.log(m);
        // console.log(m.month());
        return m;
      },
      getStudents(){
        const dataprocess = this.$moment(this.processMonth).format('MM-YYYY');
        // const all = this.users.filter(x=> x.type === 'Student');
        this.userdata = [];
        const check = () => {
           const data = this.$db.ref(`students/`).child(`${dataprocess}`);
            data.on('value',(snapshot) => {
              if(snapshot.val())
              { 
                snapshot.forEach((data)=>{
                  let key = data.key;
                  this.userdata.push(data.val()); 
                })  
              }else{
                    
              }
            });
        }
        check();
        
        console.log('dataprocess',dataprocess,`${dataprocess}`);
        const filter = this.userdata.filter(x=> console.log(x));
        
        return null;
      },
      getUsers(){
            
      }
    },
    methods: {
      dateFunctionEvents (date) {
        const [,, day] = date.split('-')
        if ([12, 17, 28].includes(parseInt(day, 10))) return true
        if ([1, 19, 22].includes(parseInt(day, 10))) return ['red', '#00f']
        return false
      },
      monthFunctionEvents (date) {
        const month = parseInt(date.split('-')[1], 10)
        if ([1, 3, 7].includes(month)) return true
        if ([2, 5, 12].includes(month)) return ['error', 'purple', 'rgba(0, 128, 0, 0.5)']
        return false
      },
    },
}
</script>

<style>

</style>