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
            Teachers
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
        headers: [
          {
            text: 'Dessert (100g serving)',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          { text: 'Calories', value: 'calories' },
          { text: 'Fat (g)', value: 'fat' },
          { text: 'Carbs (g)', value: 'carbs' },
          { text: 'Protein (g)', value: 'protein' },
          { text: 'Iron (%)', value: 'iron' },
        ],
      }
    },

    computed: {
      functionEvents () {
        return this.month ? this.monthFunctionEvents : this.dateFunctionEvents
      },
      processMonth () {
        const s = this.picker.split('-');
        const m = this.$moment(s);
        console.log(m.month(),m.year());
        // console.log(m.month());
        return m;
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