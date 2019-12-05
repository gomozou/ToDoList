new Vue({
  el: "#app",
  data: {
    todo:[
    ],
    doing:[
    ],
    done:[
    ],
    achievement: 0,
    allOpacityAvtive: false,
    conversion: "",
    enabled: false,
    todoOpacity:false,
    doingOpacity:false,
    doneOpacity:false,
    rollSpeed: 30,
    wave: 0
  },
  computed:{
    calcAchievement: function(){
      var list1 = this.todo.length;
      var list2 = this.doing.length;
      var list3 = this.done.length;
      var sum = list1 + list2 + list3;
      if(sum == 0){
        this.wave = 100;
        return 0;
      } else if(list1 == 0 && list2 == 0 && (list3 > 0)){
        this.wave = 0;
        return 100;
      } else {
        this.wave = 100 - Math.round(list3 / sum * 100);
        return Math.round(list3 / sum * 100);
      }
    }
  },
  watch:{
    calcAchievement: function(newVal, oldVal){
      if(newVal > oldVal){
        this.drumRoll(newVal, "up");
      } else{
        this.drumRoll(newVal, "down");
      }
    }
  },
  methods:{
    addItem: function(){
      var length = this.todo.length;
      if(length == 0){
        this.enabled =! this.enabled;
        this.editModeFalse();
        var num = 0;
        if(this.todo.concat(this.doing, this.done).length > 0){
          num = Math.max.apply(null,this.todo.concat(this.doing, this.done).map(function(item){return item.id;})) + 1;
        }
        this.todo.push(
          {id: num, text: '', editMode: true}
        )
        this.$nextTick(() => this.$refs.todo[length].focus());
      } else{
        if(this.todo[length-1].text !== ""){
          this.enabled =! this.enabled;
          this.editModeFalse();
          var num = 0;
          if(this.todo.concat(this.doing, this.done).length > 0){
            num = Math.max.apply(null,this.todo.concat(this.doing, this.done).map(function(item){return item.id;})) + 1;
          }
          this.todo.push(
            {id: num, text: '', editMode: true}
          )
        }
        this.$nextTick(() => this.$refs.todo[this.todo.length - 1].focus());
      }
    },
    changeEditMode:function(index, target){
      this.enabled =! this.enabled;
      if(this[target][index].editMode === true){
        this.editModeFalse();
      } else{
        this.editModeFalse();
        this[target][index].editMode = !this[target][index].editMode;
        this.$nextTick(() => this.$refs[target][index].focus());
      }
      this.noInput();
    },
    drumRoll: function(val, key){
      var countup = function(){
        if(key === "up"){
          this.achievement++;
        } else{
          this.achievement--;
        }
        var loop = setTimeout(countup, this.rollSpeed);
        if(this.achievement == val){
          clearTimeout(loop);
        }
      }.bind(this)
      countup();
    },
    editModeFalse: function(){
      for(var index in this.todo){
        if(this.todo[index].editMode === true){
          this.todo[index].editMode = false;
        }
      }
      for(var index in this.doing){
        if(this.doing[index].editMode === true){
          this.doing[index].editMode = false;
        }
      }
      for(var index in this.done){
        if(this.done[index].editMode === true){
          this.done[index].editMode = false;
        }
      }
    },
    editModeState: function(){
      for(var index in this.todo){
        if(this.todo[index].editMode === true){
          return true;
        }
      }
      for(var index in this.doing){
        if(this.doing[index].editMode === true){
          return true;
        }
      }
      for(var index in this.done){
        if(this.done[index].editMode === true){
          return true;
        }
      }
    },
    noInput: function(){
      var length = this.todo.length;
      if(length != 0 && this.todo[length - 1].text === ""){
        this.todo.pop();
      }
    },
    removeItem: function(index, target){
      this[target].splice(index,1);
      this.noInput();
    },
    resize: function(index){
      var target = this.$refs.todo[index];
      target.style.height = target.scrollHeight + 'px'
    },
    endEdit: function(){
      if(!this.conversion){
        this.editModeFalse();
        this.noInput();
        this.enabled =! this.enabled;
      }
    },
    dragStart: function(target){
      this.allOpacityAvtive = true;
      this[target] = true;
    },
    dragEnd: function(){
      this.allOpacityAvtive = false;
    },
    dragEnter: function(target){
      if(target == 'todoOpacity'){
        this[target] = true;
        this.doingOpacity = false;
        this.doneOpacity = false;
      } else if(target == 'doingOpacity'){
        this[target] = true;
        this.todoOpacity = false;
        this.doneOpacity = false;
      } else{
        this[target] = true;
        this.todoOpacity = false;
        this.doingOpacity = false;
      }
    }
  }
});
